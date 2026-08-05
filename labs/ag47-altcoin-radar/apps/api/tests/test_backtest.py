from datetime import UTC, datetime, timedelta

from ag47_radar.services.backtest import (
    PricePoint,
    ScoreObservation,
    evaluate_scores,
)

T0 = datetime(2026, 8, 1, 12, 0, tzinfo=UTC)


def observation(score: float, classification: str, at: datetime, token: str = "tok-1"):
    return ScoreObservation(
        token_id=token,
        token_symbol="NOVA",
        final_score=score,
        classification=classification,
        calculated_at=at,
        scoring_version="v1.0.0",
        is_demo=False,
    )


def series(token: str, points: list[tuple[float, float]]) -> dict:
    return {
        token: [
            PricePoint(captured_at=T0 + timedelta(hours=offset), price_usd=price)
            for offset, price in points
        ]
    }


def test_forward_return_computed_per_classification():
    scores = [observation(8.5, "oportunidade_forte", T0)]
    prices = series("tok-1", [(0, 1.0), (24, 1.25)])
    report = evaluate_scores(scores, prices, horizon_hours=24)
    assert report.evaluated == 1
    sample = report.samples[0]
    assert sample.forward_return_pct == 25.0
    summary = report.by_classification["oportunidade_forte"]
    assert summary.samples == 1
    assert summary.hit_rate == 1.0
    assert summary.mean_return_pct == 25.0


def test_missing_exit_snapshot_is_skipped_not_interpolated():
    scores = [observation(7.0, "observar", T0)]
    prices = series("tok-1", [(0, 1.0), (5, 1.1)])  # nothing near T0+24h
    report = evaluate_scores(scores, prices, horizon_hours=24, tolerance_hours=6)
    assert report.evaluated == 0
    assert report.skipped_no_exit == 1


def test_missing_entry_snapshot_is_skipped():
    scores = [observation(7.0, "observar", T0)]
    prices = series("tok-1", [(-48, 1.0), (24, 1.1)])  # entry too old for tolerance
    report = evaluate_scores(scores, prices, horizon_hours=24, tolerance_hours=6)
    assert report.evaluated == 0
    assert report.skipped_no_entry == 1


def test_correlation_positive_when_higher_scores_precede_higher_returns():
    scores = [
        observation(9.0, "oportunidade_forte", T0, token="a"),
        observation(6.0, "observar", T0, token="b"),
        observation(3.0, "risco_elevado", T0, token="c"),
    ]
    prices = {
        **series("a", [(0, 1.0), (24, 1.3)]),
        **series("b", [(0, 1.0), (24, 1.05)]),
        **series("c", [(0, 1.0), (24, 0.7)]),
    }
    report = evaluate_scores(scores, prices, horizon_hours=24)
    assert report.evaluated == 3
    assert report.score_return_correlation is not None
    assert report.score_return_correlation > 0.9


def test_correlation_requires_minimum_samples():
    scores = [observation(8.0, "observar", T0)]
    prices = series("tok-1", [(0, 1.0), (24, 1.1)])
    report = evaluate_scores(scores, prices, horizon_hours=24)
    assert report.score_return_correlation is None


def test_dynamic_weight_calibration():
    scores = [
        ScoreObservation(
            "a",
            "AAA",
            8.0,
            "oportunidade_forte",
            T0,
            "v1.0.0",
            False,
            momentum_score=9.0,
            liquidity_score=3.0,
        ),
        ScoreObservation(
            "b",
            "BBB",
            6.0,
            "observar",
            T0,
            "v1.0.0",
            False,
            momentum_score=6.0,
            liquidity_score=4.0,
        ),
        ScoreObservation(
            "c",
            "CCC",
            4.0,
            "especulativa",
            T0,
            "v1.0.0",
            False,
            momentum_score=3.0,
            liquidity_score=7.0,
        ),
    ]
    prices = {
        **series("a", [(0, 1.0), (24, 1.5)]),
        **series("b", [(0, 1.0), (24, 1.2)]),
        **series("c", [(0, 1.0), (24, 0.8)]),
    }
    report = evaluate_scores(scores, prices, horizon_hours=24)
    assert report.evaluated == 3
    assert report.calibrated_weights is not None
    assert (
        report.calibrated_weights["momentum_score"] > report.calibrated_weights["liquidity_score"]
    )
    assert round(sum(report.calibrated_weights.values()), 4) == 1.0
