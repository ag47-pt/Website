from __future__ import annotations

from datetime import timedelta
from typing import Any
from uuid import NAMESPACE_URL, uuid5

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.db import create_schema, get_session_factory, utc_now
from ag47_radar.enums import OpportunityClassification, RiskSignalLevel
from ag47_radar.fixtures import DEMO_FIXTURE_VERSION, DEMO_TOKENS
from ag47_radar.models import (
    Alert,
    MarketSnapshot,
    OpportunityScore,
    RiskAssessment,
    SocialSnapshot,
    Token,
    TradingPair,
    WatchlistEntry,
)
from ag47_radar.schemas import ScoreComponentsInput
from ag47_radar.services.scoring import calculate_score


def stable_id(key: str) -> str:
    return str(uuid5(NAMESPACE_URL, f"ag47-altcoin-radar:{DEMO_FIXTURE_VERSION}:{key}"))


async def _upsert[ModelT](
    session: AsyncSession, model: type[ModelT], object_id: str, values: dict[str, Any]
) -> ModelT:
    instance = await session.get(model, object_id)
    if instance is None:
        kwargs = dict(values)
        kwargs.pop("id", None)
        instance = model(id=object_id, **kwargs)  # type: ignore[call-arg]
        session.add(instance)
    else:
        for key, value in values.items():
            if key != "id":
                setattr(instance, key, value)
    return instance


async def seed_demo_data(session: AsyncSession | None = None) -> dict[str, int]:
    """Idempotently upsert the coherent Sprint 1 demo dataset."""

    owns_session = session is None
    if owns_session:
        await create_schema()
        session = get_session_factory()()
    assert session is not None
    now = utc_now().replace(microsecond=0)
    counts = {
        "tokens": 0,
        "pairs": 0,
        "market_snapshots": 0,
        "social_snapshots": 0,
        "risks": 0,
        "scores": 0,
        "alerts": 0,
        "watchlist": 0,
    }

    try:
        for position, fixture in enumerate(DEMO_TOKENS, start=1):
            token_created_at = now - timedelta(
                days=max(1, fixture["risk"]["contract_age_days"] or 1)
            )
            pair_created_at = now - timedelta(hours=fixture["pair_age_hours"])
            await _upsert(
                session,
                Token,
                fixture["id"],
                {
                    "chain": fixture["chain"],
                    "contract_address": fixture["contract_address"],
                    "symbol": fixture["symbol"],
                    "name": fixture["name"],
                    "decimals": fixture["decimals"],
                    "created_at": token_created_at,
                    "first_seen_at": pair_created_at,
                    "metadata_json": {
                        "fixture_version": DEMO_FIXTURE_VERSION,
                        "demo_notice": (
                            "Token fictício para validação funcional; não é dado de mercado real."
                        ),
                    },
                    "source": f"demo.seed.{DEMO_FIXTURE_VERSION}",
                    "is_demo": True,
                },
            )
            counts["tokens"] += 1
            await _upsert(
                session,
                TradingPair,
                fixture["pair_id"],
                {
                    "token_id": fixture["id"],
                    "pair_address": fixture["pair_address"],
                    "quote_token": fixture["quote_token"],
                    "dex": fixture["dex"],
                    "created_at": pair_created_at,
                    "first_seen_at": pair_created_at,
                    "source": f"demo.market.{DEMO_FIXTURE_VERSION}",
                    "source_url": None,
                    "is_demo": True,
                },
            )
            counts["pairs"] += 1

            for history_index, factor in enumerate(fixture["history_factors"]):
                captured_at = now - timedelta(
                    hours=(len(fixture["history_factors"]) - 1 - history_index) * 2
                )
                await _upsert(
                    session,
                    MarketSnapshot,
                    stable_id(f"market:{fixture['id']}:{history_index}"),
                    {
                        "pair_id": fixture["pair_id"],
                        "price_usd": round(fixture["price"] * factor, 12),
                        "liquidity_usd": round(fixture["liquidity"] * (0.9 + factor * 0.1), 2),
                        "volume_5m": round(fixture["volume_5m"] * factor, 2),
                        "volume_1h": round(fixture["volume_1h"] * factor, 2),
                        "volume_24h": round(fixture["volume_24h"] * factor, 2),
                        "price_change_5m": fixture["change_5m"] if history_index == 10 else None,
                        "price_change_1h": fixture["change_1h"] if history_index == 10 else None,
                        "price_change_24h": fixture["change_24h"] if history_index == 10 else None,
                        "market_cap": fixture["market_cap"] if history_index == 10 else None,
                        "fdv": fixture["fdv"] if history_index == 10 else None,
                        "buyers": fixture["buyers"] if history_index == 10 else None,
                        "sellers": fixture["sellers"] if history_index == 10 else None,
                        "captured_at": captured_at,
                        "source": f"demo.market.{DEMO_FIXTURE_VERSION}",
                        "data_quality": "medium",
                        "is_demo": True,
                    },
                )
                counts["market_snapshots"] += 1

            for social_index in range(6):
                growth_factor = 0.65 + social_index * 0.07
                social = fixture["social"]
                await _upsert(
                    session,
                    SocialSnapshot,
                    stable_id(f"social:{fixture['id']}:{social_index}"),
                    {
                        "token_id": fixture["id"],
                        "platform": "telegram",
                        "members": round(social["members"] * growth_factor),
                        "member_growth_1h": social["member_growth_1h"],
                        "member_growth_24h": social["member_growth_24h"],
                        "messages_per_minute": round(
                            social["messages_per_minute"] * growth_factor, 3
                        ),
                        "unique_authors": round(social["unique_authors"] * growth_factor),
                        "participation_rate": social["participation_rate"],
                        "engagement_rate": social["engagement_rate"],
                        "repetition_rate": social["repetition_rate"],
                        "estimated_bot_ratio": social["estimated_bot_ratio"],
                        "team_activity": social["team_activity"],
                        "captured_at": now - timedelta(hours=(5 - social_index) * 4),
                        "source": f"demo.social.{DEMO_FIXTURE_VERSION}",
                        "data_quality": "medium",
                        "is_demo": True,
                    },
                )
                counts["social_snapshots"] += 1

            await _upsert(
                session,
                RiskAssessment,
                stable_id(f"risk:{fixture['id']}"),
                {
                    "token_id": fixture["id"],
                    **fixture["risk"],
                    "captured_at": now,
                    "source": f"demo.risk.{DEMO_FIXTURE_VERSION}",
                    "data_quality": "medium",
                    "is_demo": True,
                },
            )
            counts["risks"] += 1

            critical_flags = [
                flag["code"]
                for flag in fixture["risk"]["flags"]
                if flag["level"] == RiskSignalLevel.CRITICAL.value
            ]
            calculated = calculate_score(
                ScoreComponentsInput(**fixture["components"]), critical_flags=critical_flags
            )
            await _upsert(
                session,
                OpportunityScore,
                stable_id(f"score:{fixture['id']}"),
                {
                    "token_id": fixture["id"],
                    **calculated.model_dump(exclude={"classification"}),
                    "classification": calculated.classification.value,
                    "calculated_at": now,
                    "is_demo": True,
                },
            )
            counts["scores"] += 1

            alert_type, severity, title, message, payload = _alert_fixture(
                fixture, calculated.classification
            )
            await _upsert(
                session,
                Alert,
                stable_id(f"alert:{fixture['id']}"),
                {
                    "token_id": fixture["id"],
                    "type": alert_type,
                    "severity": severity,
                    "title": title,
                    "message": message,
                    "payload_json": payload,
                    "deduplication_key": f"demo:{fixture['id']}:{alert_type}",
                    "created_at": now - timedelta(minutes=position * 7),
                    "acknowledged_at": None,
                    "is_demo": True,
                },
            )
            counts["alerts"] += 1

        # A single seeded favorite demonstrates persistence while leaving room for user actions.
        nova_id = DEMO_TOKENS[0]["id"]
        existing_watchlist = await session.scalar(
            select(WatchlistEntry).where(WatchlistEntry.token_id == nova_id)
        )
        if existing_watchlist is None:
            session.add(
                WatchlistEntry(
                    id=stable_id("watchlist:nova"),
                    token_id=nova_id,
                    notes="Fixture inicial da watchlist; notas do utilizador não são sobrescritas.",
                    created_at=now,
                )
            )
        counts["watchlist"] += 1
        await session.commit()
        return counts
    except Exception:
        await session.rollback()
        raise
    finally:
        if owns_session:
            await session.close()


async def seed_global_rules(session: AsyncSession | None = None) -> dict[str, int]:
    """Seed global alert rules."""
    owns_session = session is None
    if owns_session:
        session = get_session_factory()()
    assert session is not None
    counts = {"alert_rules": 0}

    rules = [
        {
            "id": stable_id("rule:liquidity_volume_expansion"),
            "name": "Expansão de Liquidez e Volume",
            "scope": "global",
            "source_kind": "signal",
            "source_type": "liquidity_volume_expansion",
            "minimum_strength": 0.6,
            "minimum_confidence": 0.6,
            "cooldown_minutes": 60,
            "rule_version": "v1",
        },
        {
            "id": stable_id("rule:high_volume_liquidity_contraction"),
            "name": "Contração de Liquidez com Volume",
            "scope": "global",
            "source_kind": "signal",
            "source_type": "high_volume_liquidity_contraction",
            "minimum_strength": 0.5,
            "minimum_confidence": 0.7,
            "cooldown_minutes": 60,
            "rule_version": "v1",
        },
        {
            "id": stable_id("rule:volume_spike"),
            "name": "Pico de Volume",
            "scope": "global",
            "source_kind": "event",
            "source_type": "volume_spike",
            "cooldown_minutes": 30,
            "rule_version": "v1",
        },
        {
            "id": stable_id("rule:liquidity_drop"),
            "name": "Queda de Liquidez",
            "scope": "global",
            "source_kind": "event",
            "source_type": "liquidity_drop",
            "cooldown_minutes": 30,
            "rule_version": "v1",
        }
    ]

    from ag47_radar.models import AlertRule

    try:
        for rule_data in rules:
            await _upsert(session, AlertRule, str(rule_data["id"]), rule_data)
            counts["alert_rules"] += 1
        await session.commit()
        return counts
    except Exception:
        await session.rollback()
        raise
    finally:
        if owns_session:
            await session.close()



def _alert_fixture(
    fixture: dict[str, Any], classification: OpportunityClassification
) -> tuple[str, str, str, str, dict[str, Any]]:
    if fixture["symbol"] == "ORBIT":
        return (
            "mudanca_de_risco",
            "critico",
            "Flag crítica detectada",
            "ORBIT recebeu gate crítico por autoridade de mint ativa no provider demo.",
            {"classification": classification.value, "risk_score": fixture["risk"]["risk_score"]},
        )
    if fixture["symbol"] == "PULSE":
        return (
            "queda_de_liquidez",
            "alto_risco",
            "Liquidez abaixo do piso",
            "PULSE entrou na faixa de liquidez baixa do cenário de demonstração.",
            {"liquidity_usd": fixture["liquidity"], "variation_percent": -21.4},
        )
    if fixture["symbol"] == "NOVA":
        return (
            "score_ultrapassou_limite",
            "informativo",
            "Score acima de 8,0",
            "NOVA alcançou classificação de oportunidade forte no cenário demo.",
            {"score": calculate_score(fixture["components"]).final_score, "threshold": 8.0},
        )
    if fixture["symbol"] == "FARMX":
        return (
            "aceleracao_de_volume",
            "informativo",
            "Volume em aceleração",
            "FARMX apresentou confirmação moderada de volume no cenário demo.",
            {"volume_1h": fixture["volume_1h"], "variation_percent": 18.2},
        )
    return (
        "concentracao_de_holders",
        "atencao",
        "Concentração requer atenção",
        "LYNX possui concentração relevante entre os maiores holders no cenário demo.",
        {"top_holders_percentage": fixture["risk"]["top_holders_percentage"]},
    )
