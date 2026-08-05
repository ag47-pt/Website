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
            )
        )
    report.evaluated = len(report.samples)
    returns = [sample.forward_return_pct for sample in report.samples]
    report.score_return_correlation = _pearson(
        [sample.final_score for sample in report.samples], returns
    )
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
        select(OpportunityScore, Token.symbol)
        .join(Token, Token.id == OpportunityScore.token_id)
        .order_by(OpportunityScore.calculated_at)
    )
    if not include_demo:
        score_query = score_query.where(OpportunityScore.is_demo.is_(False))
    score_rows = (await session.execute(score_query)).all()
    scores = [
        ScoreObservation(
            token_id=row.OpportunityScore.token_id,
            token_symbol=row.symbol,
            final_score=float(row.OpportunityScore.final_score),
            classification=row.OpportunityScore.classification,
            calculated_at=row.OpportunityScore.calculated_at,
            scoring_version=row.OpportunityScore.scoring_version,
            is_demo=row.OpportunityScore.is_demo,
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
