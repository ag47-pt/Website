import logging
from datetime import datetime, timedelta

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.db import utc_now
from ag47_radar.models import (
    GlobalKnowledge,
    MarketSnapshot,
    TokenHypothesis,
    TokenTruth,
    TradingPair,
)

from .confidence import calculate_historical_confidence

logger = logging.getLogger(__name__)


async def get_price_at(db: AsyncSession, token_id: str, timestamp: datetime) -> float | None:
    # Busca o snapshot mais próximo ANTES ou no exato timestamp (ou mais próximo possível)
    stmt = (
        select(MarketSnapshot)
        .join(MarketSnapshot.pair)
        .where(and_(TradingPair.token_id == token_id, MarketSnapshot.captured_at <= timestamp))
        .order_by(MarketSnapshot.captured_at.desc())
        .limit(1)
    )
    snapshot = (await db.execute(stmt)).scalars().first()
    return float(snapshot.price_usd) if snapshot and snapshot.price_usd else None


async def validate_historical_hypotheses(db: AsyncSession) -> None:
    """
    Motor retrospectivo que avalia Hipóteses para transformá-las em Truths (Verdade).
    Atualiza as estatísticas no GlobalKnowledge no contexto correto e refina a confidence.
    """
    logger.info("Executando validação retrospectiva das Hipóteses...")
    now = utc_now()

    # 1. Buscar todas as hipóteses que AINDA NÃO têm Truth
    stmt_unvalidated = (
        select(TokenHypothesis)
        .outerjoin(TokenTruth, TokenTruth.hypothesis_id == TokenHypothesis.id)
        .where(TokenTruth.id == None)
    )

    hypotheses = (await db.execute(stmt_unvalidated)).scalars().all()

    for hypothesis in hypotheses:
        metadata = hypothesis.metadata_json or {}
        expected = metadata.get("expected_outcome", {})

        # Só valida se tiver um expectation claro
        if not expected or expected.get("type") != "price_change":
            continue

        timeframe_hours = expected.get("timeframe_hours", 24)
        target_time = hypothesis.created_at + timedelta(hours=timeframe_hours)

        # SQLite may return naive datetimes, make sure we compare correctly
        target_time = (
            target_time.replace(tzinfo=now.tzinfo) if target_time.tzinfo is None else target_time
        )

        # Só podemos validar se o tempo já passou
        if now < target_time:
            continue

        # Pega preço na criação da hipótese
        price_start = await get_price_at(db, hypothesis.token_id, hypothesis.created_at)
        # Pega preço no momento da expiração
        price_end = await get_price_at(db, hypothesis.token_id, target_time)

        if not price_start or not price_end or price_start == 0:
            continue

        price_change_pct = ((price_end - price_start) / price_start) * 100

        target_value = expected.get("target_value", 0.0)
        operator = expected.get("target_operator", ">")

        # Determina o Status
        status = "neutral"
        if operator == ">":
            if price_change_pct > target_value:
                status = "success"
            elif price_change_pct > 0:
                status = "partial"
            else:
                status = "failure"
        elif operator == "<":
            if price_change_pct < target_value:
                status = "success"
            elif price_change_pct < 0:
                status = "partial"
            else:
                status = "failure"

        # Calcula gain/loss absolute return
        gain = price_change_pct if price_change_pct > 0 else 0.0
        loss = price_change_pct if price_change_pct < 0 else 0.0

        # Cria a Truth
        truth = TokenTruth(
            token_id=hypothesis.token_id,
            hypothesis_id=hypothesis.id,
            expected_outcome=expected,
            observed_outcome={"price_change_pct": price_change_pct},
            gain=gain,
            loss=loss,
            accuracy_score=None,  # Pode ser calculado com uma métrica mais complexa depois
            status=status,
            is_demo=hypothesis.is_demo,
        )
        db.add(truth)

        if not hypothesis.is_demo:
            # 2. Atualizar o GlobalKnowledge
            # No futuro, market_regime virá do contexto global
            market_regime = "bull" if price_change_pct > 0 else "bear"
            chain = "solana"  # Placeholder: ideal pegar de Token.chain

            gk_stmt = select(GlobalKnowledge).where(
                GlobalKnowledge.pattern_name == hypothesis.hypothesis_type,
                GlobalKnowledge.validation_window == f"{timeframe_hours}h",
                GlobalKnowledge.market_regime == market_regime,
                GlobalKnowledge.chain == chain,
            )
            gk = (await db.execute(gk_stmt)).scalars().first()
            if not gk:
                gk = GlobalKnowledge(
                    pattern_name=hypothesis.hypothesis_type,
                    description=f"Hipótese inferida do tipo {hypothesis.hypothesis_type}",
                    market_regime=market_regime,
                    chain=chain,
                    validation_window=f"{timeframe_hours}h",
                    total_occurrences=0,
                    success_count=0,
                    failure_count=0,
                    neutral_count=0,
                )
                db.add(gk)

            gk.total_occurrences += 1
            if status == "success":
                gk.success_count += 1
            elif status == "failure":
                gk.failure_count += 1
            else:
                gk.neutral_count += 1

            # Recalcula confiança
            gk.historical_confidence = calculate_historical_confidence(
                gk.success_count, gk.failure_count, gk.neutral_count
            )

            # Update score bucket stats in GlobalKnowledge
            from ag47_radar.models import OpportunityScore

            score_val = metadata.get("score")
            if score_val is None:
                score_stmt = (
                    select(OpportunityScore)
                    .where(
                        and_(
                            OpportunityScore.token_id == hypothesis.token_id,
                            OpportunityScore.calculated_at <= hypothesis.created_at,
                        )
                    )
                    .order_by(OpportunityScore.calculated_at.desc())
                    .limit(1)
                )
                score_obj = (await db.execute(score_stmt)).scalars().first()
                score_val = float(score_obj.final_score) if score_obj else 5.0
            else:
                score_val = float(score_val)

            SCORE_BUCKETS = [
                (0.0, 4.0),
                (4.0, 6.0),
                (6.0, 7.0),
                (7.0, 8.0),
                (8.0, 9.0),
                (9.0, 10.0),
            ]
            bucket = next(
                (
                    b
                    for b in SCORE_BUCKETS
                    if (b[0] <= score_val < b[1] if b[1] < 10.0 else b[0] <= score_val <= b[1])
                ),
                (5.0, 6.0),
            )
            bucket_pattern_name = f"score_bucket_{bucket[0]}_{bucket[1]}"

            gk_bucket_stmt = select(GlobalKnowledge).where(
                GlobalKnowledge.pattern_name == bucket_pattern_name,
                GlobalKnowledge.validation_window == f"{timeframe_hours}h",
                GlobalKnowledge.market_regime == market_regime,
                GlobalKnowledge.chain == chain,
            )
            gk_bucket = (await db.execute(gk_bucket_stmt)).scalars().first()
            if not gk_bucket:
                gk_bucket = GlobalKnowledge(
                    pattern_name=bucket_pattern_name,
                    description=f"Estatisticas do bucket de score {bucket[0]} a {bucket[1]}",
                    market_regime=market_regime,
                    chain=chain,
                    validation_window=f"{timeframe_hours}h",
                    total_occurrences=0,
                    success_count=0,
                    failure_count=0,
                    neutral_count=0,
                )
                db.add(gk_bucket)

            gk_bucket.total_occurrences += 1
            if status == "success":
                gk_bucket.success_count += 1
            elif status == "failure":
                gk_bucket.failure_count += 1
            else:
                gk_bucket.neutral_count += 1

            gk_bucket.historical_confidence = calculate_historical_confidence(
                gk_bucket.success_count, gk_bucket.failure_count, gk_bucket.neutral_count
            )

    await db.commit()
