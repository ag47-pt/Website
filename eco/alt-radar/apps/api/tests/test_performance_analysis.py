import pytest
from httpx import AsyncClient

from ag47_radar.db import utc_now
from ag47_radar.models import (
    Token,
    TokenHypothesis,
    TokenTruth,
)
from ag47_radar.services.performance_analysis import (
    analyze_confidence_buckets,
    analyze_drawdown_profile,
    analyze_score_buckets,
    generate_edge_analysis_report,
)


@pytest.mark.asyncio
async def test_performance_analysis_empty(db_session):
    report = await generate_edge_analysis_report(db_session, is_demo=True)
    assert report.total_hypotheses_evaluated == 0
    assert len(report.score_buckets) == 6
    assert len(report.confidence_buckets) == 4
    assert report.drawdown_profile.max_drawdown_overall_pct == 0.0
    assert report.optimal_edge_zone.edge_verdict == "INSUFFICIENT_DATA"


@pytest.mark.asyncio
async def test_performance_analysis_with_truths(db_session):
    token = Token(
        id="t-perf-1",
        chain="ethereum",
        contract_address="0xperf111111111111111111111111111111111111",
        symbol="PERF1",
        name="Performance Token 1",
        metadata_json={},
        source="test",
        is_demo=False,
    )
    db_session.add(token)

    now = utc_now()
    h1 = TokenHypothesis(
        id="hypo-perf-1",
        token_id="t-perf-1",
        hypothesis_type="momentum_surge",
        rule_version="v1",
        confidence=0.85,
        metadata_json={"score": 8.5},
        is_demo=False,
    )
    h2 = TokenHypothesis(
        id="hypo-perf-2",
        token_id="t-perf-1",
        hypothesis_type="liquidity_loss",
        rule_version="v1",
        confidence=0.50,
        metadata_json={"score": 5.0},
        is_demo=False,
    )
    db_session.add_all([h1, h2])

    t1 = TokenTruth(
        id="truth-perf-1",
        token_id="t-perf-1",
        hypothesis_id="hypo-perf-1",
        expected_outcome={"target_value": 10.0, "timeframe_hours": 24},
        observed_outcome={"price_change_pct": 18.5, "max_drawdown_pct": -4.2},
        gain=18.5,
        loss=0.0,
        accuracy_score=0.85,
        status="success",
        is_demo=False,
    )
    t2 = TokenTruth(
        id="truth-perf-2",
        token_id="t-perf-1",
        hypothesis_id="hypo-perf-2",
        expected_outcome={"target_value": 10.0, "timeframe_hours": 24},
        observed_outcome={"price_change_pct": -8.0, "max_drawdown_pct": -12.0},
        gain=0.0,
        loss=-8.0,
        accuracy_score=0.2,
        status="failure",
        is_demo=False,
    )
    db_session.add_all([t1, t2])
    await db_session.commit()

    records = [
        (t1, 8.5, 0.85),
        (t2, 5.0, 0.50),
    ]

    score_buckets = analyze_score_buckets(records)
    strong_bucket = next(b for b in score_buckets if "8.0 - 9.0" in b.bucket_label)
    assert strong_bucket.total_samples == 1
    assert strong_bucket.win_rate_pct == 100.0
    assert strong_bucket.avg_return_pct == 18.5

    conf_buckets = analyze_confidence_buckets(records)
    high_conf_bucket = next(b for b in conf_buckets if "0.8 - 1.0" in b.bucket_label)
    assert high_conf_bucket.total_samples == 1
    assert high_conf_bucket.win_rate_pct == 100.0

    dd_profile = analyze_drawdown_profile(records)
    assert dd_profile.max_drawdown_overall_pct == -12.0

    report = await generate_edge_analysis_report(db_session, is_demo=False)
    assert report.total_hypotheses_evaluated == 2


@pytest.mark.asyncio
async def test_performance_edge_api_endpoint(api_client: AsyncClient):
    response = await api_client.get("/api/v1/performance/edge")
    assert response.status_code == 200
    data = response.json()
    assert "score_buckets" in data
    assert "confidence_buckets" in data
    assert "drawdown_profile" in data
    assert "optimal_edge_zone" in data
