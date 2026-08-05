"""Performance & Edge Analysis Service.

Calculates empirical statistical edge metrics:
- Score Buckets Analysis (0-4, 4-6, 6-7, 7-8, 8-9, 9-10)
- Confidence Calibration Buckets (0-0.3, 0.3-0.6, 0.6-0.8, 0.8-1.0)
- Max Drawdown Distribution & Risk Profile
- Optimal Edge Zone Identification with Out-of-Sample (Train/Test) Validation
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.models import OpportunityScore, TokenHypothesis, TokenTruth
from ag47_radar.schemas import (
    BucketPerformanceRead,
    ConfidenceBucketRead,
    DrawdownDistributionRead,
    EdgeAnalysisRead,
    EdgeZoneRead,
)

logger = logging.getLogger(__name__)

SCORE_BUCKET_DEFINITIONS = [
    ("0.0 - 4.0 (Baixo)", 0.0, 4.0),
    ("4.0 - 6.0 (Neutro)", 4.0, 6.0),
    ("6.0 - 7.0 (Moderado)", 6.0, 7.0),
    ("7.0 - 8.0 (Promissor)", 7.0, 8.0),
    ("8.0 - 9.0 (Forte)", 8.0, 9.0),
    ("9.0 - 10.0 (Excepcional)", 9.0, 10.0),
]

CONFIDENCE_BUCKET_DEFINITIONS = [
    ("0.0 - 0.3 (Baixa)", 0.0, 0.3),
    ("0.3 - 0.6 (Média)", 0.3, 0.6),
    ("0.6 - 0.8 (Alta)", 0.6, 0.8),
    ("0.8 - 1.0 (Extrema)", 0.8, 1.0),
]


async def fetch_truths_with_score_context(
    db: AsyncSession, is_demo: bool | None = None
) -> list[tuple[TokenTruth, float, float]]:
    """Retrieves TokenTruth instances alongside score & confidence at hypothesis creation time."""
    stmt = select(TokenTruth, TokenHypothesis).join(
        TokenHypothesis, TokenTruth.hypothesis_id == TokenHypothesis.id
    )
    if is_demo is not None:
        stmt = stmt.where(TokenTruth.is_demo == is_demo)

    rows = (await db.execute(stmt)).all()
    results: list[tuple[TokenTruth, float, float]] = []

    for truth, hypothesis in rows:
        meta = hypothesis.metadata_json or {}
        score_val = meta.get("score")
        conf_val = hypothesis.confidence

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
            conf_val = (
                float(score_obj.confidence)
                if (score_obj and conf_val is None)
                else (conf_val or 0.5)
            )

        results.append((truth, float(score_val), float(conf_val or 0.5)))

    return results


def analyze_score_buckets(
    truth_records: list[tuple[TokenTruth, float, float]],
) -> list[BucketPerformanceRead]:
    buckets: list[BucketPerformanceRead] = []

    for label, min_s, max_s in SCORE_BUCKET_DEFINITIONS:
        matching = [
            (t, score, conf)
            for t, score, conf in truth_records
            if (min_s <= score < max_s if max_s < 10.0 else min_s <= score <= max_s)
        ]

        total = len(matching)
        if total == 0:
            buckets.append(
                BucketPerformanceRead(
                    bucket_label=label,
                    min_score=min_s,
                    max_score=max_s,
                    total_samples=0,
                    success_count=0,
                    win_rate_pct=0.0,
                    avg_return_pct=0.0,
                    avg_drawdown_pct=0.0,
                    profit_factor=0.0,
                    is_statistically_profitable=False,
                )
            )
            continue

        successes = sum(1 for t, _, _ in matching if t.status == "success")
        returns = [
            float(t.observed_outcome.get("price_change_pct", 0.0))
            if isinstance(t.observed_outcome, dict)
            else 0.0
            for t, _, _ in matching
        ]
        drawdowns = [
            float(t.observed_outcome.get("max_drawdown_pct", 0.0))
            if isinstance(t.observed_outcome, dict)
            else 0.0
            for t, _, _ in matching
        ]

        gains = [r for r in returns if r > 0]
        losses = [r for r in returns if r < 0]

        win_rate = (successes / total) * 100.0
        avg_ret = sum(returns) / total
        avg_dd = sum(drawdowns) / total

        total_gain_val = sum(gains)
        total_loss_val = abs(sum(losses))
        profit_factor = (
            (total_gain_val / total_loss_val)
            if total_loss_val > 0
            else (1.0 if total_gain_val > 0 else 0.0)
        )

        is_profitable = win_rate >= 60.0 and avg_dd >= -15.0 and total >= 3

        buckets.append(
            BucketPerformanceRead(
                bucket_label=label,
                min_score=min_s,
                max_score=max_s,
                total_samples=total,
                success_count=successes,
                win_rate_pct=round(win_rate, 2),
                avg_return_pct=round(avg_ret, 2),
                avg_drawdown_pct=round(avg_dd, 2),
                profit_factor=round(profit_factor, 2),
                is_statistically_profitable=is_profitable,
            )
        )

    return buckets


def analyze_confidence_buckets(
    truth_records: list[tuple[TokenTruth, float, float]],
) -> list[ConfidenceBucketRead]:
    buckets: list[ConfidenceBucketRead] = []

    for label, min_c, max_c in CONFIDENCE_BUCKET_DEFINITIONS:
        matching = [
            (t, score, conf)
            for t, score, conf in truth_records
            if (min_c <= conf < max_c if max_c < 1.0 else min_c <= conf <= max_c)
        ]

        total = len(matching)
        if total == 0:
            buckets.append(
                ConfidenceBucketRead(
                    bucket_label=label,
                    min_confidence=min_c,
                    max_confidence=max_c,
                    total_samples=0,
                    win_rate_pct=0.0,
                    avg_return_pct=0.0,
                    avg_drawdown_pct=0.0,
                    calibration_delta=0.0,
                )
            )
            continue

        successes = sum(1 for t, _, _ in matching if t.status == "success")
        returns = [
            float(t.observed_outcome.get("price_change_pct", 0.0))
            if isinstance(t.observed_outcome, dict)
            else 0.0
            for t, _, _ in matching
        ]
        drawdowns = [
            float(t.observed_outcome.get("max_drawdown_pct", 0.0))
            if isinstance(t.observed_outcome, dict)
            else 0.0
            for t, _, _ in matching
        ]

        win_rate = (successes / total) * 100.0
        avg_ret = sum(returns) / total
        avg_dd = sum(drawdowns) / total

        conf_midpoint_pct = ((min_c + max_c) / 2.0) * 100.0
        calibration_delta = conf_midpoint_pct - win_rate

        buckets.append(
            ConfidenceBucketRead(
                bucket_label=label,
                min_confidence=min_c,
                max_confidence=max_c,
                total_samples=total,
                win_rate_pct=round(win_rate, 2),
                avg_return_pct=round(avg_ret, 2),
                avg_drawdown_pct=round(avg_dd, 2),
                calibration_delta=round(calibration_delta, 2),
            )
        )

    return buckets


def analyze_drawdown_profile(
    truth_records: list[tuple[TokenTruth, float, float]],
) -> DrawdownDistributionRead:
    if not truth_records:
        return DrawdownDistributionRead(
            max_drawdown_overall_pct=0.0,
            drawdown_p50_pct=0.0,
            drawdown_p90_pct=0.0,
            win_to_drawdown_ratio=0.0,
        )

    drawdowns = sorted(
        [
            float(t.observed_outcome.get("max_drawdown_pct", 0.0))
            if isinstance(t.observed_outcome, dict)
            else 0.0
            for t, _, _ in truth_records
        ]
    )

    returns = [
        float(t.observed_outcome.get("price_change_pct", 0.0))
        if isinstance(t.observed_outcome, dict)
        else 0.0
        for t, _, _ in truth_records
    ]

    total = len(drawdowns)
    max_dd = min(drawdowns) if drawdowns else 0.0
    p50_idx = int(total * 0.5)
    p90_idx = int(total * 0.9)

    p50_dd = drawdowns[p50_idx] if total > 0 else 0.0
    p90_dd = drawdowns[min(p90_idx, total - 1)] if total > 0 else 0.0

    avg_ret = sum(returns) / total if total > 0 else 0.0
    avg_dd = abs(sum(drawdowns) / total) if total > 0 else 0.0

    win_to_dd_ratio = (avg_ret / avg_dd) if avg_dd > 0 else (1.0 if avg_ret > 0 else 0.0)

    return DrawdownDistributionRead(
        max_drawdown_overall_pct=round(max_dd, 2),
        drawdown_p50_pct=round(p50_dd, 2),
        drawdown_p90_pct=round(p90_dd, 2),
        win_to_drawdown_ratio=round(win_to_dd_ratio, 2),
    )


def identify_optimal_edge_zone(
    truth_records: list[tuple[TokenTruth, float, float]],
) -> EdgeZoneRead:
    if len(truth_records) < 4:
        return EdgeZoneRead(
            optimal_score_min=7.0,
            optimal_confidence_min=0.6,
            in_sample_win_rate_pct=0.0,
            out_of_sample_win_rate_pct=0.0,
            avg_expected_return_pct=0.0,
            avg_max_drawdown_pct=0.0,
            is_edge_verified=False,
            edge_verdict="INSUFFICIENT_DATA",
        )

    sorted_records = sorted(truth_records, key=lambda r: r[0].created_at)

    split_idx = int(len(sorted_records) * 0.7)
    train_records = sorted_records[:split_idx]
    test_records = sorted_records[split_idx:]

    optimal_score = 7.0
    optimal_conf = 0.6

    train_filtered = [r for r in train_records if r[1] >= optimal_score and r[2] >= optimal_conf]
    test_filtered = [r for r in test_records if r[1] >= optimal_score and r[2] >= optimal_conf]

    train_total = len(train_filtered)
    test_total = len(test_filtered)

    train_win_rate = (
        (sum(1 for t, _, _ in train_filtered if t.status == "success") / train_total) * 100.0
        if train_total > 0
        else 0.0
    )

    test_win_rate = (
        (sum(1 for t, _, _ in test_filtered if t.status == "success") / test_total) * 100.0
        if test_total > 0
        else 0.0
    )

    all_filtered = train_filtered + test_filtered
    all_returns = [
        float(t.observed_outcome.get("price_change_pct", 0.0))
        if isinstance(t.observed_outcome, dict)
        else 0.0
        for t, _, _ in all_filtered
    ]
    all_drawdowns = [
        float(t.observed_outcome.get("max_drawdown_pct", 0.0))
        if isinstance(t.observed_outcome, dict)
        else 0.0
        for t, _, _ in all_filtered
    ]

    avg_exp_ret = sum(all_returns) / len(all_returns) if all_returns else 0.0
    avg_max_dd = sum(all_drawdowns) / len(all_drawdowns) if all_drawdowns else 0.0

    is_verified = train_win_rate >= 60.0 and test_win_rate >= 55.0 and test_total >= 1
    verdict = (
        "PROVEN_EDGE"
        if is_verified
        else ("UNVERIFIED_SAMPLE" if (train_total == 0 or test_total == 0) else "NEUTRAL_REGIME")
    )

    return EdgeZoneRead(
        optimal_score_min=optimal_score,
        optimal_confidence_min=optimal_conf,
        in_sample_win_rate_pct=round(train_win_rate, 2),
        out_of_sample_win_rate_pct=round(test_win_rate, 2),
        avg_expected_return_pct=round(avg_exp_ret, 2),
        avg_max_drawdown_pct=round(avg_max_dd, 2),
        is_edge_verified=is_verified,
        edge_verdict=verdict,
    )


async def generate_edge_analysis_report(
    db: AsyncSession, is_demo: bool | None = None
) -> EdgeAnalysisRead:
    records = await fetch_truths_with_score_context(db, is_demo=is_demo)

    score_buckets = analyze_score_buckets(records)
    conf_buckets = analyze_confidence_buckets(records)
    drawdown_profile = analyze_drawdown_profile(records)
    edge_zone = identify_optimal_edge_zone(records)

    return EdgeAnalysisRead(
        evaluated_at=datetime.now(UTC),
        total_hypotheses_evaluated=len(records),
        score_buckets=score_buckets,
        confidence_buckets=conf_buckets,
        drawdown_profile=drawdown_profile,
        optimal_edge_zone=edge_zone,
        demo_mode=is_demo if is_demo is not None else True,
    )
