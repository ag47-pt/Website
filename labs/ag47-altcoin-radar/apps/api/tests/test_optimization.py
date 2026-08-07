from datetime import UTC, datetime, timedelta
import pytest

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
