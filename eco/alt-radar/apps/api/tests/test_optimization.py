from datetime import UTC, datetime, timedelta

import pytest
from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.models import ScoringWeights
from ag47_radar.schemas import ScoringWeightsInput
from ag47_radar.services.backtest import PricePoint, ScoreObservation
from ag47_radar.services.optimization import (
    evaluate_weight_matrix,
    generate_weight_combinations,
)
from ag47_radar.services.scoring import WEIGHTS

T0 = datetime(2026, 8, 1, 12, 0, tzinfo=UTC)


def test_generate_weight_combinations():
    combinations = generate_weight_combinations()
    assert len(combinations) > 0
    for w in combinations:
        assert "momentum_score" in w
        assert "liquidity_score" in w
        # Sum of weights should be 1.0 (with floating precision tolerance)
        total = sum(w.values())
        assert abs(total - 1.0) < 1e-3


def test_evaluate_weight_matrix():
    scores = [
        ScoreObservation(
            "tok-1",
            "TOK",
            8.0,
            "oportunidade_forte",
            T0,
            "v1.0.0",
            False,
            momentum_score=9.0,
            liquidity_score=8.0,
        )
    ]
    prices = {
        "tok-1": [
            PricePoint(captured_at=T0, price_usd=1.0),
            PricePoint(captured_at=T0 + timedelta(hours=24), price_usd=1.5),
        ]
    }
    eval_res = evaluate_weight_matrix(scores, prices, WEIGHTS, horizon_hours=24)
    assert eval_res.samples_evaluated == 1
    assert eval_res.win_rate == 1.0
    assert eval_res.profit_factor >= 1.0
    assert eval_res.mean_return_pct == 50.0


VALID_WEIGHT_INPUT = {
    "momentum_score": 3.0,
    "liquidity_score": 2.0,
    "community_score": 1.0,
    "distribution_score": 1.0,
    "safety_score": 2.0,
    "data_quality_score": 1.0,
}


def test_apply_weights_schema_matches_scoring_engine_keys():
    assert set(ScoringWeightsInput.model_fields) == set(WEIGHTS)


@pytest.mark.asyncio
async def test_apply_weights_normalizes_and_persists(
    api_client: AsyncClient,
    db_session: AsyncSession,
):
    baseline_weights = WEIGHTS.copy()

    response = await api_client.post(
        "/api/v1/system/apply-weights",
        json={"weights": VALID_WEIGHT_INPUT},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert sum(data["active_weights"].values()) == pytest.approx(1.0)
    assert data["active_weights"]["momentum_score"] == pytest.approx(0.3)
    assert WEIGHTS == baseline_weights

    persisted = await db_session.scalar(
        select(ScoringWeights).order_by(ScoringWeights.calibrated_at.desc()).limit(1)
    )
    assert persisted is not None
    assert persisted.weights_json == pytest.approx(data["active_weights"])
    assert persisted.sample_count == 0
    assert persisted.correlation is None


@pytest.mark.asyncio
async def test_apply_weights_normalizes_large_finite_values(api_client: AsyncClient):
    response = await api_client.post(
        "/api/v1/system/apply-weights",
        json={"weights": {name: 1e308 for name in VALID_WEIGHT_INPUT}},
    )

    assert response.status_code == 200
    assert sum(response.json()["active_weights"].values()) == pytest.approx(1.0)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "weights",
    [
        {name: 0.0 for name in VALID_WEIGHT_INPUT},
        {**VALID_WEIGHT_INPUT, "momentum_score": -1.0},
        {**VALID_WEIGHT_INPUT, "unknown_score": 1.0},
        {name: value for name, value in VALID_WEIGHT_INPUT.items() if name != "safety_score"},
        {**VALID_WEIGHT_INPUT, "momentum_score": "NaN"},
    ],
    ids=["zero-total", "negative", "unknown", "missing", "non-finite"],
)
async def test_apply_weights_rejects_invalid_payload_without_persisting(
    api_client: AsyncClient,
    db_session: AsyncSession,
    weights: dict[str, object],
):
    response = await api_client.post(
        "/api/v1/system/apply-weights",
        json={"weights": weights},
    )

    assert response.status_code == 422
    persisted_count = await db_session.scalar(select(func.count(ScoringWeights.id)))
    assert persisted_count == 0
