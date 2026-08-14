from datetime import timedelta
from decimal import Decimal

import pytest

from ag47_radar.db import utc_now
from ag47_radar.knowledge.confidence import calculate_historical_confidence
from ag47_radar.knowledge.learning import process_signals_and_learn
from ag47_radar.knowledge.registry import registry
from ag47_radar.knowledge.validation import validate_historical_hypotheses
from ag47_radar.models import (
    GlobalKnowledge,
    MarketSnapshot,
    TokenHypothesis,
    TokenSignal,
    TokenTruth,
)


def test_confidence_calculation():
    # Poucas ocorrências, win_rate = 100% -> Confiança ajustada não deve ser 100%
    conf_small_sample = calculate_historical_confidence(1, 0, 0)
    assert conf_small_sample < Decimal("100.0")
    assert conf_small_sample > Decimal("50.0")

    # Muitas ocorrências, win_rate = 100% -> Confiança deve ser quase 100%
    conf_large_sample = calculate_historical_confidence(100, 0, 0)
    assert conf_large_sample > conf_small_sample

    # Win rate de 0% -> deve ir para 0.
    conf_zero = calculate_historical_confidence(0, 10, 0)
    assert conf_zero < Decimal("50.0")


def test_infer_hypotheses():
    s1 = TokenSignal(
        id="sig1",
        token_id="t1",
        signal_type="liquidity_volume_expansion",
        created_at=utc_now(),
        strength=Decimal("1.0"),
        confidence=Decimal("1.0"),
    )

    hypotheses = registry.infer_all([s1])
    assert len(hypotheses) == 1

    h = hypotheses[0]
    assert h["hypothesis_type"] == "accumulation_suspected"
    assert h["caused_by"][0]["id"] == "sig1"


@pytest.mark.asyncio
async def test_learning_pipeline(db_session):
    from ag47_radar.models import Token

    t = Token(
        id="t1",
        chain="solana",
        contract_address="addr1",
        symbol="ABC",
        name="ABC Token",
        metadata_json={},
        source="test",
        is_demo=False,
    )
    db_session.add(t)
    await db_session.commit()

    s = TokenSignal(
        id="sig2",
        token_id="t1",
        signal_type="liquidity_volume_expansion",
        strength=Decimal("1.0"),
        confidence=Decimal("1.0"),
        is_demo=False,
        created_at=utc_now(),
    )
    db_session.add(s)
    await db_session.commit()

    # 1. Roda pipeline de aprendizado
    hypotheses = await process_signals_and_learn(db_session, "t1", [s], is_demo=False)
    assert len(hypotheses) == 1
    assert isinstance(hypotheses[0], TokenHypothesis)

    # O GlobalKnowledge não é mais gerado na inserção, mas na validação
    # Para garantir retrocompatibilidade com o PRD, o learning cria uma hipótese pendente
    # A validação fará o GlobalKnowledge

    hypothesis = hypotheses[0]

    # 2. Vamos mockar MarketSnapshots no passado para forçar a validação
    from ag47_radar.models import TradingPair

    pair = TradingPair(
        id="pair1",
        token_id="t1",
        pair_address="addr",
        quote_token="SOL",
        dex="raydium",
        source="mock",
        is_demo=False,
    )
    db_session.add(pair)
    await db_session.commit()

    # T0 (criação da hipótese)
    t0_time = hypothesis.created_at
    # T24 (validação)
    t24_time = t0_time + timedelta(hours=24)

    # Mas precisamos que now() > t24_time para a validação ocorrer,
    # então vamos jogar a hipótese 25h pro passado.
    hypothesis.created_at = utc_now() - timedelta(hours=25)

    # Preço inicial (T0 = $1.0)
    snap0 = MarketSnapshot(
        price_usd=Decimal("1.0"),
        captured_at=hypothesis.created_at,
        source="mock",
        data_quality="high",
        is_demo=False,
        pair_id="pair1",
    )
    # Preço final (T+24 = $1.10) (+10%)
    snap24 = MarketSnapshot(
        price_usd=Decimal("1.10"),
        captured_at=hypothesis.created_at + timedelta(hours=24),
        source="mock",
        data_quality="high",
        is_demo=False,
        pair_id="pair1",
    )
    db_session.add_all([snap0, snap24])
    await db_session.commit()

    # 3. Roda a Validação
    await validate_historical_hypotheses(db_session)

    # 4. Verifica se a Truth foi criada
    from sqlalchemy import select

    truth = (await db_session.execute(select(TokenTruth))).scalars().first()
    assert truth is not None
    assert truth.status == "success"  # 10% > 5% expected
    assert abs(truth.gain - 10.0) < 0.001

    # 5. Verifica se GlobalKnowledge foi gerado com contexto market_regime=bull, chain=solana
    gk = (await db_session.execute(select(GlobalKnowledge))).scalars().first()
    assert gk is not None
    assert gk.market_regime == "bull"
    assert gk.chain == "solana"
    assert gk.success_count == 1
    assert gk.total_occurrences == 1
