from __future__ import annotations

from dataclasses import dataclass
from math import log10

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.config import Settings
from ag47_radar.enums import AlertSeverity, AlertType, Chain, DataQuality
from ag47_radar.errors import ProviderModeError
from ag47_radar.models import (
    MarketSnapshot,
    OpportunityScore,
    Token,
    TokenEvent,
    TokenSignal,
    TradingPair,
)
from ag47_radar.providers.registry import ProviderRegistry
from ag47_radar.schemas import ScoreComponentsInput
from ag47_radar.services.alerts import AlertCommand, create_alert_if_new, process_alert_rules
from ag47_radar.services.events import generate_market_events
from ag47_radar.services.scoring import calculate_score, safety_from_risk
from ag47_radar.services.signals import generate_signals


@dataclass(slots=True)
class IngestionSummary:
    discovered: int = 0
    persisted: int = 0
    partial_failures: int = 0


def _momentum_score(change_1h: float | None, volume_1h: float | None) -> float | None:
    if change_1h is None and volume_1h is None:
        return None
    change_component = min(10, max(0, 5 + (change_1h or 0) / 5))
    volume_component = min(10, max(0, log10(max(1, volume_1h or 0)) * 1.6))
    return round(change_component * 0.65 + volume_component * 0.35, 2)


def _liquidity_score(liquidity_usd: float | None) -> float | None:
    if liquidity_usd is None:
        return None
    return round(min(10, max(0, (log10(max(1, liquidity_usd)) - 3) * 3.2)), 2)


async def run_ingestion_cycle(
    session: AsyncSession,
    settings: Settings,
    providers: ProviderRegistry,
    *,
    limit: int = 10,
) -> IngestionSummary:
    """Discover and persist only real data; demo fallback is deliberately forbidden here."""

    if settings.demo_mode:
        raise ProviderModeError("Real ingestion is disabled while demo mode is active")

    confirmed_alerts_to_dispatch = []

    from sqlalchemy import func
    from ag47_radar.models import TokenTruth
    from ag47_radar.services.queries import get_latest_scoring_weights

    dynamic_weights = None
    try:
        truth_count = await session.scalar(select(func.count(TokenTruth.id))) or 0
        if truth_count >= 100:
            dynamic_weights = await get_latest_scoring_weights(session)
    except Exception:
        pass

    discovery = await providers.discovery.discover(list(Chain), limit=limit)
    if discovery.mode.value != "real":
        raise ProviderModeError("Discovery provider returned non-real data in real mode")
    summary = IngestionSummary(
        discovered=len(discovery.data), partial_failures=len(discovery.partial_errors)
    )
    for pair_data in discovery.data:
        market_result = await providers.market.get_pair(pair_data.chain, pair_data.pair_address)
        market = market_result.data
        if market_result.mode.value != "real" or market is None:
            summary.partial_failures += 1
            continue
        token = await session.scalar(
            select(Token).where(
                Token.chain == market.chain.value,
                Token.contract_address == market.contract_address,
                Token.is_demo.is_(False),
            )
        )
        token_is_new = token is None
        if token is None:
            token = Token(
                chain=market.chain.value,
                contract_address=market.contract_address,
                symbol=market.token_symbol,
                name=market.token_name,
                decimals=pair_data.decimals,
                metadata_json={"provider_mode": "real"},
                source=providers.discovery.provider_id,
                is_demo=False,
            )
            session.add(token)
            await session.flush()
        pair = await session.scalar(
            select(TradingPair).where(
                TradingPair.token_id == token.id,
                TradingPair.pair_address == market.pair_address,
            )
        )
        if pair is None:
            pair = TradingPair(
                token_id=token.id,
                pair_address=market.pair_address,
                quote_token=market.quote_token,
                dex=market.dex,
                created_at=market.pair_created_at,
                source=providers.market.provider_id,
                source_url=market.source_url,
                is_demo=False,
            )
            session.add(pair)
            await session.flush()
        old_snapshot = await session.scalar(
            select(MarketSnapshot)
            .where(MarketSnapshot.pair_id == pair.id)
            .order_by(MarketSnapshot.captured_at.desc())
            .limit(1)
        )

        new_snapshot = MarketSnapshot(
            pair_id=pair.id,
            price_usd=market.price_usd,
            liquidity_usd=market.liquidity_usd,
            volume_5m=market.volume_5m,
            volume_1h=market.volume_1h,
            volume_24h=market.volume_24h,
            price_change_5m=market.price_change_5m,
            price_change_1h=market.price_change_1h,
            price_change_24h=market.price_change_24h,
            market_cap=market.market_cap,
            fdv=market.fdv,
            buyers=market.buyers,
            sellers=market.sellers,
            source=providers.market.provider_id,
            data_quality=market_result.quality.value,
            is_demo=False,
        )
        session.add(new_snapshot)
        await session.flush()

        events = generate_market_events(old_snapshot, new_snapshot, token.id)
        if events:
            event_hashes = [e.caused_by_hash for e in events]
            existing_events_result = await session.scalars(
                select(TokenEvent.caused_by_hash).where(
                    TokenEvent.token_id == token.id, TokenEvent.caused_by_hash.in_(event_hashes)
                )
            )
            existing_hashes = set(existing_events_result.all())
            new_events = [e for e in events if e.caused_by_hash not in existing_hashes]

            if new_events:
                session.add_all(new_events)
                await session.flush()

                signals = generate_signals(new_events, token.id)
                if signals:
                    signal_hashes = [s.caused_by_hash for s in signals]
                    existing_signals_result = await session.scalars(
                        select(TokenSignal.caused_by_hash).where(
                            TokenSignal.token_id == token.id,
                            TokenSignal.caused_by_hash.in_(signal_hashes),
                        )
                    )
                    existing_sig_hashes = set(existing_signals_result.all())
                    new_signals = [
                        s for s in signals if s.caused_by_hash not in existing_sig_hashes
                    ]

                    if new_signals:
                        session.add_all(new_signals)
                        await session.flush()

                        from ag47_radar.knowledge.learning import process_signals_and_learn

                        await process_signals_and_learn(
                            session, token.id, new_signals, is_demo=False
                        )

                        for sig in new_signals:
                            new_alerts = await process_alert_rules(
                                session,
                                settings,
                                source_kind="signal",
                                source_id=sig.id,
                                token_id=token.id,
                                source_type=sig.signal_type,
                                strength=float(sig.strength) if sig.strength is not None else None,
                                confidence=float(sig.confidence)
                                if sig.confidence is not None
                                else None,
                                payload=sig.metadata_json,
                            )
                            for a in new_alerts:
                                if a.confidence_level == "confirmado":
                                    confirmed_alerts_to_dispatch.append((
                                        a.id,
                                        token.symbol,
                                        sig.signal_type,
                                        float(a.severity) if a.severity is not None else 0.0,
                                        float(a.confidence) if a.confidence is not None else 0.0,
                                    ))

        critical_flags: list[str] = []
        safety_score_val: float | None = None
        risk_result = await providers.risk.assess(market.chain, market.contract_address)
        if risk_result and risk_result.data:
            risk = risk_result.data
            raw_risk_score = getattr(risk, "risk_score", None)
            if isinstance(raw_risk_score, (int, float)):
                safety_score_val = safety_from_risk(float(raw_risk_score))

            if getattr(risk, "honeypot_status", None) == "honeypot":
                critical_flags.append("honeypot_detectado")
            if getattr(risk, "mintable", None) is True:
                critical_flags.append("contrato_mintavel")
            buy_tax = getattr(risk, "buy_tax", None)
            sell_tax = getattr(risk, "sell_tax", None)
            if (isinstance(buy_tax, (int, float)) and buy_tax > 10.0) or (
                isinstance(sell_tax, (int, float)) and sell_tax > 10.0
            ):
                critical_flags.append("taxa_de_transacao_elevada")
            if getattr(risk, "blacklist_capability", None) is True:
                critical_flags.append("capacidade_de_blacklist")
            flags = getattr(risk, "flags", [])
            if isinstance(flags, list):
                for flag in flags:
                    if isinstance(flag, dict) and flag.get("level") in ("critical", "CRITICAL"):
                        critical_flags.append(str(flag.get("code") or "risco_critico"))

        calculated = calculate_score(
            ScoreComponentsInput(
                momentum_score=_momentum_score(market.price_change_1h, market.volume_1h),
                liquidity_score=_liquidity_score(market.liquidity_usd),
                community_score=None,
                distribution_score=None,
                safety_score=safety_score_val,
                data_quality_score=(8.0 if market_result.quality == DataQuality.HIGH else 6.0),
            ),
            critical_flags=critical_flags,
            weights=dynamic_weights,
        )

        session.add(
            OpportunityScore(
                token_id=token.id,
                **calculated.model_dump(exclude={"classification"}),
                classification=calculated.classification.value,
                is_demo=False,
            )
        )
        if token_is_new:
            await create_alert_if_new(
                session,
                AlertCommand(
                    token_id=token.id,
                    type=AlertType.NEW_PAIR,
                    severity=AlertSeverity.INFO,
                    title=f"Novo par: {token.symbol}",
                    message=(
                        f"{market.dex} detectado por GeckoTerminal e confirmado por DexScreener."
                    ),
                    payload={"pair_address": pair.pair_address, "chain": token.chain},
                    deduplication_key=pair.pair_address,
                    is_demo=False,
                ),
                deduplication_window_minutes=settings.alert_deduplication_window_minutes,
            )
        summary.persisted += 1

    from ag47_radar.services.truth_engine import run_truth_engine

    await run_truth_engine(session)

    await session.commit()

    if confirmed_alerts_to_dispatch:
        import asyncio
        from ag47_radar.db import get_session_factory
        from ag47_radar.services.alerts import dispatch_telegram_alert_bg
        session_factory = get_session_factory()
        for alert_id, symbol, sig_type, severity, confidence in confirmed_alerts_to_dispatch:
            asyncio.create_task(
                dispatch_telegram_alert_bg(
                    session_factory,
                    settings,
                    alert_id,
                    symbol,
                    sig_type,
                    severity,
                    confidence,
                )
            )

    return summary
