from datetime import timedelta
from decimal import Decimal

import pytest
from httpx import AsyncClient

from ag47_radar.db import utc_now
from ag47_radar.models import (
    MarketSnapshot,
    OpportunityScore,
    Token,
    TokenHypothesis,
    TradingPair,
)
from ag47_radar.services.truth_engine import (
    get_truth_summary,
    run_truth_engine,
)


@pytest.mark.asyncio
async def test_truth_engine_success_validation(db_session):
    # Setup token & pair
    token = Token(
        id="t-truth-1",
        chain="solana",
        contract_address="0x1111111111111111111111111111111111111111",
        symbol="TRUTH1",
        name="Truth Token 1",
        metadata_json={},
        source="test",
        is_demo=False,
    )
    db_session.add(token)

    pair = TradingPair(
        id="pair-truth-1",
        token_id="t-truth-1",
        pair_address="pair-addr-1",
        quote_token="SOL",
        dex="raydium",
        source="test",
        is_demo=False,
    )
    db_session.add(pair)
    await db_session.commit()

    now = utc_now()
    created_at = now - timedelta(hours=25)  # 25h ago -> expired window

    # Initial price = $1.00 at T-25h
    snap_start = MarketSnapshot(
        id="snap-start-1",
        pair_id="pair-truth-1",
        price_usd=Decimal("1.00"),
        captured_at=created_at,
        source="test",
        data_quality="HIGH",
        is_demo=False,
    )
    # Intermediate low price = $0.90 at T-10h -> drawdown -10%
    snap_mid = MarketSnapshot(
        id="snap-mid-1",
        pair_id="pair-truth-1",
        price_usd=Decimal("0.90"),
        captured_at=created_at + timedelta(hours=10),
        source="test",
        data_quality="HIGH",
        is_demo=False,
    )
    # Target price = $1.50 at T-1h (after 24h window) -> +50% gain
    snap_end = MarketSnapshot(
        id="snap-end-1",
        pair_id="pair-truth-1",
        price_usd=Decimal("1.50"),
        captured_at=created_at + timedelta(hours=24),
        source="test",
        data_quality="HIGH",
        is_demo=False,
    )
    db_session.add_all([snap_start, snap_mid, snap_end])

    # Create unvalidated hypothesis
    hypo = TokenHypothesis(
        id="hypo-1",
        token_id="t-truth-1",
        hypothesis_type="accumulation_suspected",
        confidence=Decimal("0.8"),
        rule_version="hypotheses-v1",
        metadata_json={
            "expected_outcome": {
                "type": "price_change",
                "target_value": 5.0,
                "target_operator": ">",
                "timeframe_hours": 24,
            }
        },
        caused_by=[],
        caused_by_hash="hash1",
        created_at=created_at,
        is_demo=False,
    )
    db_session.add(hypo)
    await db_session.commit()

    # Execute Truth Engine
    truths = await run_truth_engine(db_session)

    assert len(truths) == 1
    t = truths[0]
    assert t.token_id == "t-truth-1"
    assert t.hypothesis_id == "hypo-1"
    assert t.status == "success"
    assert pytest.approx(t.observed_outcome["price_change_pct"], 0.1) == 50.0
    assert pytest.approx(t.observed_outcome["max_drawdown_pct"], 0.1) == -10.0
    assert t.observed_outcome["strength"] == "strong"

    # Verify GlobalKnowledge update
    summary = await get_truth_summary(db_session)
    assert summary.total_validated == 1
    assert summary.success_count == 1
    assert summary.hit_rate_pct == 100.0
    assert pytest.approx(summary.avg_gain_pct, 0.1) == 50.0


@pytest.mark.asyncio
async def test_truth_engine_failure_validation(db_session):
    token = Token(
        id="t-truth-2",
        chain="solana",
        contract_address="0x2222222222222222222222222222222222222222",
        symbol="FAIL1",
        name="Fail Token 1",
        metadata_json={},
        source="test",
        is_demo=False,
    )
    db_session.add(token)

    pair = TradingPair(
        id="pair-truth-2",
        token_id="t-truth-2",
        pair_address="pair-addr-2",
        quote_token="SOL",
        dex="raydium",
        source="test",
        is_demo=False,
    )
    db_session.add(pair)

    now = utc_now()
    created_at = now - timedelta(hours=25)

    snap_start = MarketSnapshot(
        id="snap-start-2",
        pair_id="pair-truth-2",
        price_usd=Decimal("2.00"),
        captured_at=created_at,
        source="test",
        data_quality="HIGH",
        is_demo=False,
    )
    snap_end = MarketSnapshot(
        id="snap-end-2",
        pair_id="pair-truth-2",
        price_usd=Decimal("1.00"),  # -50% loss
        captured_at=created_at + timedelta(hours=24),
        source="test",
        data_quality="HIGH",
        is_demo=False,
    )
    db_session.add_all([snap_start, snap_end])

    hypo = TokenHypothesis(
        id="hypo-2",
        token_id="t-truth-2",
        hypothesis_type="breakout_imminent",
        confidence=Decimal("0.7"),
        rule_version="hypotheses-v1",
        metadata_json={
            "expected_outcome": {
                "type": "price_change",
                "target_value": 10.0,
                "target_operator": ">",
                "timeframe_hours": 24,
            }
        },
        caused_by=[],
        caused_by_hash="hash2",
        created_at=created_at,
        is_demo=False,
    )
    db_session.add(hypo)
    await db_session.commit()

    truths = await run_truth_engine(db_session)
    assert len(truths) == 1
    assert truths[0].status == "failure"
    assert pytest.approx(truths[0].loss, 0.1) == -50.0


@pytest.mark.asyncio
async def test_truth_endpoints(api_client: AsyncClient, db_session):
    # Test /api/v1/truths/summary
    res = await api_client.get("/api/v1/truths/summary")
    assert res.status_code == 200
    data = res.json()
    assert "total_validated" in data
    assert "hit_rate_pct" in data

    # Test /api/v1/tokens/{id}/truths and /api/v1/tokens/{id}/insight
    token = Token(
        id="33333333-3333-3333-3333-333333333333",
        chain="solana",
        contract_address="0x3333333333333333333333333333333333333333",
        symbol="INSIGHT1",
        name="Insight Token 1",
        metadata_json={},
        source="test",
        is_demo=True,
    )
    score = OpportunityScore(
        id="score-33333333-3333-3333-3333-333333333333",
        token_id="33333333-3333-3333-3333-333333333333",
        momentum_score=Decimal("8.0"),
        liquidity_score=Decimal("8.0"),
        community_score=Decimal("5.0"),
        distribution_score=Decimal("5.0"),
        safety_score=Decimal("9.0"),
        data_quality_score=Decimal("8.0"),
        final_score=Decimal("8.1"),
        classification="oportunidade_forte",
        confidence=Decimal("0.85"),
        signals_available=3,
        explanation="High score",
        positive_factors=["Strong liquidity"],
        negative_factors=[],
        critical_gate_applied=False,
        scoring_version="score-v1",
        is_demo=True,
    )
    db_session.add_all([token, score])
    await db_session.commit()

    t_res = await api_client.get(f"/api/v1/tokens/{token.id}/truths")
    assert t_res.status_code == 200
    assert isinstance(t_res.json(), list)

    i_res = await api_client.get(f"/api/v1/tokens/{token.id}/insight")
    assert i_res.status_code == 200
    insight = i_res.json()
    assert "action" in insight
    assert "reason" in insight
    assert "empirical_confidence" in insight
