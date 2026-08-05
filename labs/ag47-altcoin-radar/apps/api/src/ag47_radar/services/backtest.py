"""Deterministic backtesting of the versioned score against observed forward returns.

Replays persisted OpportunityScore rows and measures the forward price return of the
token's most liquid pair after a configurable horizon. No data is fabricated: a score
without a usable entry or exit snapshot is reported as skipped, never interpolated.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from statistics import fmean, median

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.models import MarketSnapshot, OpportunityScore, Token, TradingPair
from ag47_radar.services.scoring import WEIGHTS

BACKTEST_VERSION = "backtest-v1"


@dataclass(frozen=True)
class PricePoint:
    captured_at: datetime
    price_usd: float


@dataclass(frozen=True)
class ScoreObservation:
    token_id: str
    token_symbol: str
    final_score: float
    classification: str
    calculated_at: datetime
    scoring_version: str
    is_demo: bool
    momentum_score: float | None = None
    liquidity_score: float | None = None


@dataclass(frozen=True)
class BacktestSample:
    token_id: str
    token_symbol: str
    final_score: float
    classification: str
    calculated_at: datetime
    entry_price: float
    exit_price: float
    forward_return_pct: float
    is_demo: bool
    momentum_score: float | None = None
    liquidity_score: float | None = None


@dataclass
class ClassificationSummary:
    samples: int = 0
    hit_rate: float | None = None
    mean_return_pct: float | None = None
    median_return_pct: float | None = None


@dataclass
class BacktestReport:
    version: str
    horizon_hours: float
    tolerance_hours: float
    total_scores: int
    evaluated: int
    skipped_no_entry: int = 0
    skipped_no_exit: int = 0
    score_return_correlation: float | None = None
    by_classification: dict[str, ClassificationSummary] = field(default_factory=dict)
    samples: list[BacktestSample] = field(default_factory=list)
    calibrated_weights: dict[str, float] | None = None


def calibrate_dynamic_weights(
    samples: Sequence[BacktestSample],
    base_weights: Mapping[str, float] | None = None,
) -> dict[str, float]:
    """Statistically calibrate weights of momentum_score vs liquidity_score based on 24h forward returns.

    Preserves total weight sum = 1.0. If sample size is insufficient (< 3 evaluated samples),
    returns base_weights without modification.
    """

    weights = dict(base_weights or WEIGHTS)
    valid_samples = [
        s for s in samples if s.momentum_score is not None and s.liquidity_score is not None
    ]
    if len(valid_samples) < 3:
        return weights

    mom_scores = [s.momentum_score for s in valid_samples if s.momentum_score is not None]
    liq_scores = [s.liquidity_score for s in valid_samples if s.liquidity_score is not None]
    returns = [s.forward_return_pct for s in valid_samples]

    mom_corr = _pearson(mom_scores, returns) or 0.0
    liq_corr = _pearson(liq_scores, returns) or 0.0

    total_combined = round(
        weights.get("momentum_score", 0.25) + weights.get("liquidity_score", 0.20), 4
    )

    if mom_corr <= 0 and liq_corr <= 0:
        return weights

    mom_power = max(0.01, mom_corr)
    liq_power = max(0.01, liq_corr)
    ratio = mom_power / (mom_power + liq_power)

    new_mom = round(total_combined * ratio, 4)
    new_liq = round(total_combined - new_mom, 4)

    # Clamp to prevent extreme skew
    new_mom = max(0.10, min(0.35, new_mom))
    new_liq = max(0.10, min(0.30, new_liq))

    sub_total = new_mom + new_liq
    new_mom = round(total_combined * (new_mom / sub_total), 4)
    new_liq = round(total_combined - new_mom, 4)

    weights["momentum_score"] = new_mom
    weights["liquidity_score"] = new_liq
    return weights


def _nearest_at_or_before(
    points: Sequence[PricePoint], moment: datetime, tolerance: timedelta
) -> PricePoint | None:
    best: PricePoint | None = None
    for point in points:
        if point.captured_at <= moment and (best is None or point.captured_at > best.captured_at):
            best = point
    if best is not None and moment - best.captured_at <= tolerance:
        return best
    return None


def _first_at_or_after(
    points: Sequence[PricePoint], moment: datetime, tolerance: timedelta
) -> PricePoint | None:
    best: PricePoint | None = None
    for point in points:
        if point.captured_at >= moment and (best is None or point.captured_at < best.captured_at):
            best = point
    if best is not None and best.captured_at - moment <= tolerance:
        return best
    return None


def _pearson(xs: Sequence[float], ys: Sequence[float]) -> float | None:
    if len(xs) < 3:
        return None
    mx, my = fmean(xs), fmean(ys)
    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys, strict=True))
    vx = sum((x - mx) ** 2 for x in xs)
    vy = sum((y - my) ** 2 for y in ys)
    if vx == 0 or vy == 0:
        return None
    correlation: float = float(cov) / (float(vx) ** 0.5 * float(vy) ** 0.5)
    return round(correlation, 4)


def evaluate_scores(
    scores: Sequence[ScoreObservation],
    prices_by_token: Mapping[str, Sequence[PricePoint]],
    *,
    horizon_hours: float,
    tolerance_hours: float = 6.0,
) -> BacktestReport:
    """Pure evaluation: pairs each score with entry/exit prices from real observations."""

    horizon = timedelta(hours=horizon_hours)
    tolerance = timedelta(hours=tolerance_hours)
    report = BacktestReport(
        version=BACKTEST_VERSION,
        horizon_hours=horizon_hours,
        tolerance_hours=tolerance_hours,
        total_scores=len(scores),
        evaluated=0,
    )
    for score in scores:
        points = prices_by_token.get(score.token_id, ())
        entry = _nearest_at_or_before(points, score.calculated_at, tolerance)
        if entry is None or entry.price_usd <= 0:
            report.skipped_no_entry += 1
            continue
        exit_point = _first_at_or_after(points, score.calculated_at + horizon, tolerance)
        if exit_point is None:
            report.skipped_no_exit += 1
            continue
        forward = round((exit_point.price_usd - entry.price_usd) / entry.price_usd * 100, 4)
        report.samples.append(
            BacktestSample(
                token_id=score.token_id,
                token_symbol=score.token_symbol,
                final_score=score.final_score,
                classification=score.classification,
                calculated_at=score.calculated_at,
                entry_price=entry.price_usd,
                exit_price=exit_point.price_usd,
                forward_return_pct=forward,
                is_demo=score.is_demo,
                momentum_score=score.momentum_score,
                liquidity_score=score.liquidity_score,
            )
        )
    report.evaluated = len(report.samples)
    returns = [sample.forward_return_pct for sample in report.samples]
    report.score_return_correlation = _pearson(
        [sample.final_score for sample in report.samples], returns
    )
    report.calibrated_weights = calibrate_dynamic_weights(report.samples)
    buckets: dict[str, list[float]] = {}
    for sample in report.samples:
        buckets.setdefault(sample.classification, []).append(sample.forward_return_pct)
    for classification, values in sorted(buckets.items()):
        report.by_classification[classification] = ClassificationSummary(
            samples=len(values),
            hit_rate=round(sum(1 for value in values if value > 0) / len(values), 4),
            mean_return_pct=round(fmean(values), 4),
            median_return_pct=round(median(values), 4),
        )
    return report


async def load_backtest_inputs(
    session: AsyncSession, *, include_demo: bool = False
) -> tuple[list[ScoreObservation], dict[str, list[PricePoint]]]:
    score_query = (
        select(
            OpportunityScore.token_id,
            Token.symbol,
            OpportunityScore.final_score,
            OpportunityScore.classification,
            OpportunityScore.calculated_at,
            OpportunityScore.scoring_version,
            OpportunityScore.is_demo,
            OpportunityScore.momentum_score,
            OpportunityScore.liquidity_score,
        )
        .join(Token, Token.id == OpportunityScore.token_id)
        .order_by(OpportunityScore.calculated_at)
    )
    if not include_demo:
        score_query = score_query.where(OpportunityScore.is_demo.is_(False))
    score_rows = (await session.execute(score_query)).all()
    scores = [
        ScoreObservation(
            token_id=row.token_id,
            token_symbol=row.symbol,
            final_score=float(row.final_score),
            classification=row.classification,
            calculated_at=row.calculated_at,
            scoring_version=row.scoring_version,
            is_demo=row.is_demo,
            momentum_score=float(row.momentum_score) if row.momentum_score is not None else None,
            liquidity_score=float(row.liquidity_score) if row.liquidity_score is not None else None,
        )
        for row in score_rows
    ]
    snapshot_query = (
        select(TradingPair.token_id, MarketSnapshot.captured_at, MarketSnapshot.price_usd)
        .join(MarketSnapshot, MarketSnapshot.pair_id == TradingPair.id)
        .where(MarketSnapshot.price_usd.is_not(None))
        .order_by(MarketSnapshot.captured_at)
    )
    if not include_demo:
        snapshot_query = snapshot_query.where(MarketSnapshot.is_demo.is_(False))
    snapshot_rows = (await session.execute(snapshot_query)).all()
    prices: dict[str, list[PricePoint]] = {}
    for token_id, captured_at, price_usd in snapshot_rows:
        prices.setdefault(token_id, []).append(
            PricePoint(captured_at=captured_at, price_usd=float(price_usd))
        )
    return scores, prices


async def run_backtest(
    session: AsyncSession,
    *,
    horizon_hours: float = 24.0,
    tolerance_hours: float = 6.0,
    include_demo: bool = False,
) -> BacktestReport:
    scores, prices = await load_backtest_inputs(session, include_demo=include_demo)
    return evaluate_scores(
        scores, prices, horizon_hours=horizon_hours, tolerance_hours=tolerance_hours
    )
