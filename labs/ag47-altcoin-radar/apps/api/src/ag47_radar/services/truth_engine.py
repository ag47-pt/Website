"""Truth Engine Service (Empirical Validation & Knowledge Loop).

Evaluates pending TokenHypothesis entities against real forward market snapshots,
calculating empirical outcome metrics (forward return %, max drawdown %, verdict status, strength)
and propagating feedback to GlobalKnowledge.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime, timedelta

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.db import utc_now
from ag47_radar.knowledge.confidence import calculate_historical_confidence
from ag47_radar.models import (
    GlobalKnowledge,
    MarketSnapshot,
    Token,
    TokenHypothesis,
    TokenTruth,
    TradingPair,
)

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class TruthEvaluationResult:
    hypothesis_id: str
    token_id: str
    entry_price: float
    exit_price: float
    forward_return_pct: float
    max_drawdown_pct: float
    status: str  # "success", "partial", "failure", "neutral"
    strength: str  # "strong", "moderate", "weak"
    accuracy_score: float


@dataclass(frozen=True)
class TruthSummary:
    total_validated: int
    success_count: int
    failure_count: int
    neutral_count: int
    hit_rate_pct: float
    avg_gain_pct: float
    avg_drawdown_pct: float


async def get_price_at(db: AsyncSession, token_id: str, timestamp: datetime) -> float | None:
    """Retrieves the price snapshot closest to or immediately before the target timestamp."""
    stmt = (
        select(MarketSnapshot)
        .join(MarketSnapshot.pair)
        .where(
            and_(
                TradingPair.token_id == token_id,
                MarketSnapshot.captured_at <= timestamp,
            )
        )
        .order_by(MarketSnapshot.captured_at.desc())
        .limit(1)
    )
    snapshot = (await db.execute(stmt)).scalars().first()
    return float(snapshot.price_usd) if snapshot and snapshot.price_usd is not None else None


async def get_min_price_between(
    db: AsyncSession, token_id: str, start_time: datetime, end_time: datetime
) -> float | None:
    """Retrieves the minimum price snapshot within a time window for drawdown calculation."""
    stmt = (
        select(func.min(MarketSnapshot.price_usd))
        .select_from(MarketSnapshot)
        .join(MarketSnapshot.pair)
        .where(
            and_(
                TradingPair.token_id == token_id,
                MarketSnapshot.captured_at >= start_time,
                MarketSnapshot.captured_at <= end_time,
            )
        )
    )
    result = await db.scalar(stmt)
    return float(result) if result is not None else None


async def evaluate_single_hypothesis(
    db: AsyncSession, hypothesis: TokenHypothesis, now: datetime
) -> TruthEvaluationResult | None:
    """Evaluates a single hypothesis against historical price snapshots if window has passed."""
    metadata = hypothesis.metadata_json or {}
    expected = metadata.get("expected_outcome", {})

    timeframe_hours = expected.get("timeframe_hours", 24)
    target_time = hypothesis.created_at + timedelta(hours=timeframe_hours)
    if target_time.tzinfo is None:
        target_time = target_time.replace(tzinfo=now.tzinfo)

    if now < target_time:
        return None

    price_start = await get_price_at(db, hypothesis.token_id, hypothesis.created_at)
    price_end = await get_price_at(db, hypothesis.token_id, target_time)

    if price_start is None or price_end is None or price_start == 0:
        return None

    price_change_pct = ((price_end - price_start) / price_start) * 100

    min_price = await get_min_price_between(
        db, hypothesis.token_id, hypothesis.created_at, target_time
    )
    if min_price is not None and price_start > 0:
        max_drawdown_pct = float(min(0.0, ((min_price - price_start) / price_start) * 100))
    else:
        max_drawdown_pct = 0.0

    target_value = expected.get("target_value", 0.0)
    operator = expected.get("target_operator", ">")

    status = "neutral"
    if operator == ">":
        if price_change_pct >= target_value:
            status = "success"
        elif price_change_pct > 0:
            status = "partial"
        else:
            status = "failure"
    elif operator == "<":
        if price_change_pct <= target_value:
            status = "success"
        elif price_change_pct < 0:
            status = "partial"
        else:
            status = "failure"

    if status == "success":
        strength = "strong" if abs(price_change_pct) >= 10.0 else "moderate"
    elif status == "partial":
        strength = "weak"
    else:
        strength = "weak" if abs(price_change_pct) < 5.0 else "strong"

    if status == "success":
        accuracy_score = min(1.0, 0.7 + (abs(price_change_pct) / 100.0))
    elif status == "partial":
        accuracy_score = 0.5
    else:
        accuracy_score = max(0.0, 0.3 - (abs(price_change_pct) / 100.0))

    return TruthEvaluationResult(
        hypothesis_id=hypothesis.id,
        token_id=hypothesis.token_id,
        entry_price=price_start,
        exit_price=price_end,
        forward_return_pct=price_change_pct,
        max_drawdown_pct=max_drawdown_pct,
        status=status,
        strength=strength,
        accuracy_score=accuracy_score,
    )


async def run_truth_engine(db: AsyncSession) -> list[TokenTruth]:
    """Runs the Truth Engine: processes all pending unvalidated hypotheses and updates GlobalKnowledge."""
    logger.info("Executing Truth Engine empirical hypothesis validation...")
    now = utc_now()

    stmt_unvalidated = (
        select(TokenHypothesis)
        .outerjoin(TokenTruth, TokenTruth.hypothesis_id == TokenHypothesis.id)
        .where(TokenTruth.id == None)  # noqa: E711
    )

    hypotheses = (await db.execute(stmt_unvalidated)).scalars().all()
    created_truths: list[TokenTruth] = []

    for hypothesis in hypotheses:
        res = await evaluate_single_hypothesis(db, hypothesis, now)
        if res is None:
            continue

        gain = res.forward_return_pct if res.forward_return_pct > 0 else 0.0
        loss = res.forward_return_pct if res.forward_return_pct < 0 else 0.0

        truth = TokenTruth(
            token_id=res.token_id,
            hypothesis_id=res.hypothesis_id,
            expected_outcome=hypothesis.metadata_json.get("expected_outcome", {}),
            observed_outcome={
                "price_start": res.entry_price,
                "price_end": res.exit_price,
                "price_change_pct": res.forward_return_pct,
                "max_drawdown_pct": res.max_drawdown_pct,
                "strength": res.strength,
            },
            gain=gain,
            loss=loss,
            accuracy_score=res.accuracy_score,
            status=res.status,
            is_demo=hypothesis.is_demo,
        )
        db.add(truth)
        created_truths.append(truth)

        if not hypothesis.is_demo:
            token = await db.get(Token, res.token_id)
            chain = token.chain if token else "all"
            market_regime = "bull" if res.forward_return_pct > 0 else "bear"
            expected = hypothesis.metadata_json.get("expected_outcome", {})
            timeframe_hours = expected.get("timeframe_hours", 24)
            validation_window = f"{timeframe_hours}h"

            gk_stmt = select(GlobalKnowledge).where(
                and_(
                    GlobalKnowledge.pattern_name == hypothesis.hypothesis_type,
                    GlobalKnowledge.validation_window == validation_window,
                    GlobalKnowledge.market_regime == market_regime,
                    GlobalKnowledge.chain == chain,
                )
            )
            gk = (await db.execute(gk_stmt)).scalars().first()
            if not gk:
                gk = GlobalKnowledge(
                    pattern_name=hypothesis.hypothesis_type,
                    description=f"Global empirical knowledge for {hypothesis.hypothesis_type}",
                    market_regime=market_regime,
                    chain=chain,
                    validation_window=validation_window,
                    total_occurrences=0,
                    success_count=0,
                    failure_count=0,
                    neutral_count=0,
                )
                db.add(gk)

            gk.total_occurrences += 1
            if res.status == "success":
                gk.success_count += 1
            elif res.status == "failure":
                gk.failure_count += 1
            else:
                gk.neutral_count += 1

            gk.historical_confidence = calculate_historical_confidence(
                gk.success_count, gk.failure_count, gk.neutral_count
            )

    await db.commit()
    logger.info("Truth Engine cycle completed", extra={"truths_created": len(created_truths)})
    return created_truths


async def get_truth_summary(db: AsyncSession) -> TruthSummary:
    """Returns global empirical truth validation metrics."""
    stmt = select(TokenTruth)
    truths = (await db.execute(stmt)).scalars().all()

    if not truths:
        return TruthSummary(
            total_validated=0,
            success_count=0,
            failure_count=0,
            neutral_count=0,
            hit_rate_pct=0.0,
            avg_gain_pct=0.0,
            avg_drawdown_pct=0.0,
        )

    total = len(truths)
    successes = sum(1 for t in truths if t.status in ("success", "hit"))
    failures = sum(1 for t in truths if t.status in ("failure", "miss"))
    neutrals = total - successes - failures

    gains = [t.gain for t in truths if t.gain is not None]
    drawdowns = [
        t.observed_outcome.get("max_drawdown_pct", 0.0)
        for t in truths
        if isinstance(t.observed_outcome, dict)
    ]

    hit_rate = (successes / total) * 100.0 if total > 0 else 0.0
    avg_gain = float(sum(gains) / len(gains)) if gains else 0.0
    avg_dd = float(sum(drawdowns) / len(drawdowns)) if drawdowns else 0.0

    return TruthSummary(
        total_validated=total,
        success_count=successes,
        failure_count=failures,
        neutral_count=neutrals,
        hit_rate_pct=hit_rate,
        avg_gain_pct=avg_gain,
        avg_drawdown_pct=avg_dd,
    )
