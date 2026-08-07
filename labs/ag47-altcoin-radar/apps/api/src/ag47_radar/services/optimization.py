"""Grid Search Parameter Optimization Engine for AG47 Altcoin Radar.

Performs offline parameter sweeps across historical score observations and market snapshots
to identify optimal heuristic weight matrices maximizing Profit Factor and Win Rate.
Strictly read-only; does not mutate persisted historical database rows.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from statistics import fmean

from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.schemas import GridSearchCandidate, GridSearchResponse
from ag47_radar.services.backtest import (
    BacktestSample,
    PricePoint,
    ScoreObservation,
    _first_at_or_after,
    _nearest_at_or_before,
    load_backtest_inputs,
)
from ag47_radar.services.scoring import WEIGHTS


@dataclass
class CombinationEval:
    weights: dict[str, float]
    profit_factor: float
    win_rate: float
    mean_return_pct: float
    total_return_pct: float
    samples_evaluated: int


def generate_weight_combinations() -> list[dict[str, float]]:
    """Generate a bounded set of valid weight matrices summing to 1.0."""
    combinations: list[dict[str, float]] = []
    
    for mom in [0.15, 0.20, 0.25, 0.30, 0.35, 0.40]:
        for liq in [0.10, 0.15, 0.20, 0.25, 0.30]:
            remaining = 1.0 - mom - liq
            if remaining < 0.20:
                continue
            
            comm = round(remaining * (0.15 / 0.55), 4)
            dist = round(remaining * (0.15 / 0.55), 4)
            safe = round(remaining * (0.20 / 0.55), 4)
            qual = round(1.0 - mom - liq - comm - dist - safe, 4)
            
            w = {
                "momentum_score": round(mom, 4),
                "liquidity_score": round(liq, 4),
                "community_score": comm,
                "distribution_score": dist,
                "safety_score": safe,
                "data_quality_score": qual,
            }
            combinations.append(w)
            
    if WEIGHTS not in combinations:
        combinations.insert(0, WEIGHTS.copy())
        
    return combinations


def evaluate_weight_matrix(
    scores: list[ScoreObservation],
    prices: dict[str, list[PricePoint]],
    weights: dict[str, float],
    horizon_hours: float = 24.0,
    tolerance_hours: float = 6.0,
) -> CombinationEval:
    """Simulate returns for a given weight matrix without mutating DB state."""
    from datetime import timedelta
    horizon = timedelta(hours=horizon_hours)
    tolerance = timedelta(hours=tolerance_hours)
    
    samples: list[float] = []
    
    for score in scores:
        points = prices.get(score.token_id, ())
        entry = _nearest_at_or_before(points, score.calculated_at, tolerance)
        if entry is None or entry.price_usd <= 0:
            continue
            
        exit_point = _first_at_or_after(points, score.calculated_at + horizon, tolerance)
        if exit_point is None:
            continue
            
        forward = round((exit_point.price_usd - entry.price_usd) / entry.price_usd * 100, 4)
        
        if score.momentum_score is not None and score.liquidity_score is not None:
            recalculated = (
                score.momentum_score * weights["momentum_score"] +
                score.liquidity_score * weights["liquidity_score"] +
                5.0 * (weights.get("community_score", 0.15) + weights.get("distribution_score", 0.15) + weights.get("safety_score", 0.20) + weights.get("data_quality_score", 0.05))
            )
            if recalculated >= 6.0:
                samples.append(forward)
        else:
            samples.append(forward)

    if not samples:
        return CombinationEval(
            weights=weights,
            profit_factor=1.0,
            win_rate=0.0,
            mean_return_pct=0.0,
            total_return_pct=0.0,
            samples_evaluated=0,
        )

    pos_returns = [r for r in samples if r > 0]
    neg_returns = [abs(r) for r in samples if r < 0]
    
    win_rate = round(len(pos_returns) / len(samples), 4)
    total_pos = sum(pos_returns)
    total_neg = sum(neg_returns)
    
    profit_factor = round(total_pos / total_neg, 4) if total_neg > 0 else round(total_pos if total_pos > 0 else 1.0, 4)
    mean_return = round(fmean(samples), 4)
    total_return = round(sum(samples), 4)

    return CombinationEval(
        weights=weights,
        profit_factor=profit_factor,
        win_rate=win_rate,
        mean_return_pct=mean_return,
        total_return_pct=total_return,
        samples_evaluated=len(samples),
    )


async def run_grid_search_optimization(
    session: AsyncSession,
    *,
    horizon_hours: float = 24.0,
    include_demo: bool = False,
) -> GridSearchResponse:
    """Execute grid search across historical observations and return top 3 recommendations."""
    scores, prices = await load_backtest_inputs(session, include_demo=include_demo)
    combinations = generate_weight_combinations()
    
    evaluations: list[CombinationEval] = []
    baseline_eval: CombinationEval | None = None

    for w in combinations:
        result = evaluate_weight_matrix(scores, prices, w, horizon_hours=horizon_hours)
        evaluations.append(result)
        if w == WEIGHTS:
            baseline_eval = result

    if baseline_eval is None:
        baseline_eval = evaluate_weight_matrix(scores, prices, WEIGHTS, horizon_hours=horizon_hours)

    sorted_evals = sorted(evaluations, key=lambda x: (x.profit_factor, x.win_rate, x.total_return_pct), reverse=True)
    top_3 = sorted_evals[:3]
    
    candidates: list[GridSearchCandidate] = []
    base_pf = baseline_eval.profit_factor if baseline_eval.profit_factor > 0 else 1.0
    
    for item in top_3:
        improvement = round(((item.profit_factor - base_pf) / base_pf) * 100, 2)
        candidates.append(
            GridSearchCandidate(
                weights=item.weights,
                profit_factor=item.profit_factor,
                win_rate=item.win_rate,
                mean_return_pct=item.mean_return_pct,
                total_return_pct=item.total_return_pct,
                samples_evaluated=item.samples_evaluated,
                improvement_vs_base_pct=improvement,
            )
        )

    return GridSearchResponse(
        evaluated_at=datetime.now(timezone.utc),
        total_combinations_tested=len(combinations),
        baseline_weights=WEIGHTS.copy(),
        baseline_profit_factor=baseline_eval.profit_factor,
        baseline_win_rate=baseline_eval.win_rate,
        top_candidates=candidates,
        demo_mode=include_demo,
    )
