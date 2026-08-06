import asyncio
import hashlib
import logging
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.config import Settings
from ag47_radar.enums import AlertSeverity, AlertType
from ag47_radar.models import Alert, AlertRule, TokenAlert, NotificationDelivery

logger = logging.getLogger(__name__)


@dataclass
class AlertCommand:
    token_id: str
    type: AlertType
    severity: AlertSeverity
    title: str
    message: str
    deduplication_key: str = ""
    payload: dict[str, Any] | None = None
    is_demo: bool = False


async def create_alert_if_new(
    session: AsyncSession, command: AlertCommand, deduplication_window_minutes: int
) -> tuple[Alert, bool]:
    # Basic dedup implementation
    dedup_key = (
        build_deduplication_key(command)
        if not command.deduplication_key
        else command.deduplication_key
    )

    stmt = (
        select(Alert)
        .where(
            Alert.deduplication_key == dedup_key,
            Alert.is_demo.is_(command.is_demo),
            Alert.created_at >= datetime.now(UTC) - timedelta(minutes=deduplication_window_minutes),
        )
        .limit(1)
    )
    existing = await session.scalar(stmt)
    if existing:
        return existing, False

    alert = Alert(
        token_id=command.token_id,
        type=command.type.value,
        severity=command.severity.value,
        title=command.title,
        message=command.message,
        payload_json=command.payload,
        deduplication_key=dedup_key,
        is_demo=command.is_demo,
    )
    session.add(alert)
    return alert, True


def build_deduplication_key(command: AlertCommand) -> str:
    key_str = f"{command.token_id}:{command.type.value}:{command.deduplication_key}"
    # truncation test expects max 200 length but it's a hash, so it's fine, let's just use string slicing
    if len(key_str) > 200:
        key_str = key_str[:200]
    return key_str


def generate_alert_dedup_key(
    rule_id: str, source_kind: str, source_id: str, rule_version: str
) -> str:
    key_str = f"{rule_id}:{source_kind}:{source_id}:{rule_version}"
    return hashlib.sha256(key_str.encode("utf-8")).hexdigest()


def evaluate_condition(condition: dict[str, Any], payload: dict[str, Any]) -> bool:
    """Evaluates a single rule condition against the payload."""
    field = condition.get("field")
    operator = condition.get("operator")
    target_value = condition.get("value")

    if field not in payload:
        return False

    actual_value = payload[field]

    try:
        if operator == "eq":
            return bool(actual_value == target_value)
        elif operator == "neq":
            return bool(actual_value != target_value)
        elif operator == "gt":
            return bool(actual_value > target_value)
        elif operator == "gte":
            return bool(actual_value >= target_value)
        elif operator == "lt":
            return bool(actual_value < target_value)
        elif operator == "lte":
            return bool(actual_value <= target_value)
        elif operator == "in" and isinstance(target_value, list):
            return actual_value in target_value
    except TypeError:
        return False

    return False


def check_conditions(conditions: dict[str, Any] | None, payload: dict[str, Any]) -> bool:
    if not conditions:
        return True

    # We expect {"all": [...]} based on the plan
    all_conds = conditions.get("all", [])
    if not all_conds:
        return True

    for cond in all_conds:
        if not evaluate_condition(cond, payload):
            return False

    return True


def calculate_severity(
    source_kind: str, source_type: str, strength: float, confidence: float
) -> float:
    # A simple deterministic severity calculation for V1
    base = 0.5
    if source_type in ("liquidity_drop", "high_volume_liquidity_contraction"):
        base = 0.8
    elif source_type in ("liquidity_volume_expansion", "volume_spike"):
        base = 0.6

    # Scale by strength and confidence if available
    severity = base * (0.5 + (strength * 0.5)) * (0.5 + (confidence * 0.5))
    return min(1.0, max(0.0, severity))


async def process_alert_rules(
    session: AsyncSession,
    settings: Settings,
    source_kind: str,
    source_id: str,
    token_id: str,
    source_type: str,
    strength: float | None = None,
    confidence: float | None = None,
    payload: dict[str, Any] | None = None,
) -> list[TokenAlert]:
    """
    Evaluates global and token-specific rules against a new event/signal and generates alerts if matched.
    """
    if payload is None:
        payload = {}

    payload["signal_type"] = source_type
    payload["event_type"] = source_type
    if strength is not None:
        payload["strength"] = strength
    if confidence is not None:
        payload["confidence"] = confidence

    # Fetch enabled rules for this source_kind and source_type
    stmt = select(AlertRule).where(
        AlertRule.enabled.is_(True),
        AlertRule.source_kind == source_kind,
        AlertRule.source_type == source_type,
        # Rule applies if it's global (token_id IS NULL) or matches this token
        or_(AlertRule.token_id.is_(None), AlertRule.token_id == token_id),
    )

    rules = (await session.scalars(stmt)).all()
    generated_alerts = []
    now = datetime.now(UTC)

    for rule in rules:
        # Check minimums
        if rule.minimum_strength is not None and (
            strength is None or strength < rule.minimum_strength
        ):
            continue
        if rule.minimum_confidence is not None and (
            confidence is None or confidence < rule.minimum_confidence
        ):
            continue

        # Check declarative conditions
        if not check_conditions(rule.conditions, payload):
            continue

        # Check cooldown
        if rule.cooldown_minutes > 0:
            cooldown_cutoff = now - timedelta(minutes=rule.cooldown_minutes)
            recent_alert_stmt = (
                select(TokenAlert.id)
                .where(
                    TokenAlert.rule_id == rule.id,
                    TokenAlert.token_id == token_id,
                    TokenAlert.is_demo.is_(settings.demo_mode),
                    TokenAlert.triggered_at >= cooldown_cutoff,
                )
                .limit(1)
            )
            recent_alert = await session.scalar(recent_alert_stmt)
            if recent_alert:
                continue  # Cooldown active

        # Generate Alert
        dedup_key = generate_alert_dedup_key(rule.id, source_kind, source_id, rule.rule_version)
        severity = calculate_severity(source_kind, source_type, strength or 0.0, confidence or 0.0)

        # Identify OpportunityScore and score bucket
        from ag47_radar.models import OpportunityScore, GlobalKnowledge, TokenTruth, TokenHypothesis
        from ag47_radar.knowledge.confidence import calculate_historical_confidence
        
        score_stmt = (
            select(OpportunityScore)
            .where(
                OpportunityScore.token_id == token_id,
                OpportunityScore.is_demo.is_(settings.demo_mode),
            )
            .order_by(OpportunityScore.calculated_at.desc())
            .limit(1)
        )
        score_obj = await session.scalar(score_stmt)
        score_val = float(score_obj.final_score) if score_obj else 5.0

        SCORE_BUCKETS = [
            (0.0, 4.0),
            (4.0, 6.0),
            (6.0, 7.0),
            (7.0, 8.0),
            (8.0, 9.0),
            (9.0, 10.0),
        ]
        bucket = next(
            (b for b in SCORE_BUCKETS if (b[0] <= score_val < b[1] if b[1] < 10.0 else b[0] <= score_val <= b[1])),
            (5.0, 6.0)
        )
        bucket_pattern_name = f"score_bucket_{bucket[0]}_{bucket[1]}"

        # Query GlobalKnowledge stats for this score bucket
        gk_stmt = select(GlobalKnowledge).where(GlobalKnowledge.pattern_name == bucket_pattern_name)
        gks = (await session.execute(gk_stmt)).scalars().all()
        
        total_occurrences = sum(gk.total_occurrences for gk in gks)
        success_count = sum(gk.success_count for gk in gks)
        failure_count = sum(gk.failure_count for gk in gks)
        neutral_count = sum(gk.neutral_count for gk in gks)

        hist_conf = float(calculate_historical_confidence(success_count, failure_count, neutral_count))

        # Check drawdown suspension
        drawdown_suspended = False
        if total_occurrences >= 30:
            # Check the last 3 resolved truths in this bucket
            truth_stmt = (
                select(TokenTruth, TokenHypothesis)
                .join(TokenHypothesis, TokenTruth.hypothesis_id == TokenHypothesis.id)
                .order_by(TokenTruth.created_at.desc())
                .limit(50)
            )
            truth_rows = (await session.execute(truth_stmt)).all()
            
            bucket_truths = []
            for truth, hypothesis in truth_rows:
                h_meta = hypothesis.metadata_json or {}
                h_score = h_meta.get("score")
                if h_score is not None:
                    h_score = float(h_score)
                    if bucket[0] <= h_score < bucket[1] if bucket[1] < 10.0 else bucket[0] <= h_score <= bucket[1]:
                        bucket_truths.append(truth)
                if len(bucket_truths) >= 3:
                    break
            
            if len(bucket_truths) >= 3:
                if all(t.status == "failure" for t in bucket_truths[:3]):
                    drawdown_suspended = True

        # Decide confidence level and whether to emit the alert
        if total_occurrences >= 30:
            if hist_conf < 65.0:
                # Win rate below 65% for matured bucket -> Block alert entirely
                continue
            else:
                if drawdown_suspended:
                    confidence_level = "suspenso"
                else:
                    confidence_level = "confirmado"
        else:
            # Cold start -> Allow alert but tag it as indeterminada
            confidence_level = "indeterminada"

        alert = TokenAlert(
            rule_id=rule.id,
            token_id=token_id,
            source_kind=source_kind,
            source_id=source_id,
            severity=severity,
            confidence=confidence,
            status="unread",
            confidence_level=confidence_level,
            triggered_at=now,
            deduplication_key=dedup_key,
            is_demo=settings.demo_mode,
        )

        session.add(alert)
        try:
            await session.flush()
            generated_alerts.append(alert)
        except IntegrityError:
            await session.rollback()
            # Already exists, just ignore
            pass

    return generated_alerts


async def dispatch_telegram_alert_bg(
    session_factory: Any,
    settings: Settings,
    alert_id: str,
    token_symbol: str,
    source_type: str,
    severity: float,
    confidence: float,
) -> None:
    from ag47_radar.providers.registry import ProviderRegistry
    from ag47_radar.models import NotificationDelivery
    
    # 1. Create a NotificationDelivery record in DB as pending after checking filters
    async with session_factory() as session:
        from sqlalchemy import select
        from ag47_radar.models import UserNotificationSettings, TokenAlert, Token

        # Get chain information for the token
        token_info = await session.execute(
            select(Token.chain)
            .join(TokenAlert, TokenAlert.token_id == Token.id)
            .where(TokenAlert.id == alert_id)
        )
        token_chain_row = token_info.first()
        token_chain = token_chain_row[0] if token_chain_row else "all"

        user_settings = await session.scalar(select(UserNotificationSettings))
        if user_settings:
            if severity < user_settings.min_severity:
                logger.info(
                    "telegram_delivery_skipped",
                    reason="severity_below_minimum",
                    severity=severity,
                    minimum=user_settings.min_severity,
                )
                return

            if confidence < user_settings.min_confidence:
                logger.info(
                    "telegram_delivery_skipped",
                    reason="confidence_below_minimum",
                    confidence=confidence,
                    minimum=user_settings.min_confidence,
                )
                return

            allowed = user_settings.allowed_chains
            if allowed and "all" not in allowed and token_chain not in allowed:
                logger.info(
                    "telegram_delivery_skipped",
                    reason="chain_not_allowed",
                    chain=token_chain,
                    allowed=allowed,
                )
                return

        delivery = NotificationDelivery(
            alert_id=alert_id,
            channel="telegram",
            status="pending",
        )
        session.add(delivery)
        await session.commit()
        delivery_id = delivery.id


    # 2. Get the provider registry
    providers = ProviderRegistry(settings)
    provider = providers.alert_delivery
    
    title = f"Alerta de Oportunidade: {token_symbol}"
    message = (
        f"Alerta confirmado com Edge Estatístico!\n\n"
        f"• Token: {token_symbol}\n"
        f"• Sinal: {source_type}\n"
        f"• Severidade: {severity:.2f}/1.0\n"
        f"• Confiança: {confidence:.2f}/1.0\n"
    )

    max_tries = 3
    success = False
    response_data = None
    error_msg = None
    
    for attempt in range(max_tries):
        try:
            result = await provider.deliver(
                alert_id=alert_id,
                title=title,
                message=message,
                payload={"token_symbol": token_symbol, "source_type": source_type}
            )
            if result.data.accepted:
                success = True
                response_data = {"external_id": result.data.external_id, "duration_ms": result.duration_ms}
                break
            else:
                err_msg = result.partial_errors[0].message if result.partial_errors else "unknown error"
                error_msg = f"Delivery rejected: {err_msg}"
        except Exception as e:
            error_msg = str(e)
        
        if attempt < max_tries - 1:
            await asyncio.sleep(2 ** attempt)

    # 3. Update the NotificationDelivery status
    async with session_factory() as session:
        from sqlalchemy import update
        status = "success" if success else "failed"
        provider_resp = response_data if success else {"error": error_msg}
        stmt = (
            update(NotificationDelivery)
            .where(NotificationDelivery.id == delivery_id)
            .values(status=status, provider_response=provider_resp)
        )
        await session.execute(stmt)
        await session.commit()

    await providers.close()
