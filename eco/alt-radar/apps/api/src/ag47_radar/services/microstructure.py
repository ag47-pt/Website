"""Microstructure & Market Reaction Analysis Engine.

Measures immediate price/volume reactions (1m, 5m, 15m, 30m), detects market intent
(continuation vs fake_move, accumulation vs manipulation), and assigns operational
priority tiers (Tier 1: Sniper / Tier 2: Normal / Tier 3: Low).
"""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from ag47_radar.models import MarketSnapshot


@dataclass(frozen=True)
class ReactionMetrics:
    return_1m: float | None
    return_5m: float | None
    return_15m: float | None
    return_30m: float | None


@dataclass(frozen=True)
class StructureMetrics:
    held_above_entry: bool
    pullback_strength: str  # "low", "moderate", "high"
    continuation: bool
    fake_move: bool
    intent_type: str  # "accumulation", "breakout", "fakeout", "manipulation", "neutral"
    strength_score: float  # [0.0 - 10.0]


@dataclass(frozen=True)
class MicrostructureResult:
    token_id: str
    priority_tier: str  # "Tier 1", "Tier 2", "Tier 3"
    tracking_frequency_minutes: int  # 1 for Tier 1, 5 for Tier 2, 60 for Tier 3
    reaction: ReactionMetrics
    structure: StructureMetrics
    evaluated_at: datetime


def classify_prioritization_tier(final_score: float, confidence: float) -> str:
    """Classify token into operational tracking tiers.

    Tier 1 (Sniper): Score >= 8.0 AND Confidence >= 0.65
    Tier 2 (Normal): Score >= 5.0 OR Confidence >= 0.50
    Tier 3 (Low/Discard): All others
    """
    if final_score >= 8.0 and confidence >= 0.65:
        return "Tier 1"
    if final_score >= 5.0 or confidence >= 0.50:
        return "Tier 2"
    return "Tier 3"


def compute_reaction(
    snapshots: Sequence[MarketSnapshot], reference_time: datetime | None = None
) -> ReactionMetrics:
    """Computes immediate price returns at 1m, 5m, 15m, and 30m horizons relative to reference snapshot."""

    if not snapshots:
        return ReactionMetrics(return_1m=None, return_5m=None, return_15m=None, return_30m=None)

    sorted_snaps = sorted(snapshots, key=lambda s: s.captured_at)
    ref_time = reference_time or sorted_snaps[0].captured_at

    ref_snap = next((s for s in sorted_snaps if s.captured_at >= ref_time), sorted_snaps[0])
    entry_price = float(ref_snap.price_usd or 0.0)
    if entry_price <= 0:
        return ReactionMetrics(return_1m=None, return_5m=None, return_15m=None, return_30m=None)

    def _get_return_at_window(minutes: float) -> float | None:
        target = ref_snap.captured_at + timedelta(minutes=minutes)
        tolerance = timedelta(minutes=max(1.0, minutes * 0.5))
        cand = [
            s
            for s in sorted_snaps
            if s.captured_at >= ref_snap.captured_at
            and abs((s.captured_at - target).total_seconds()) <= tolerance.total_seconds()
        ]
        if not cand:
            return None
        closest = min(cand, key=lambda s: abs((s.captured_at - target).total_seconds()))
        curr_price = float(closest.price_usd or 0.0)
        if curr_price <= 0:
            return None
        return round((curr_price - entry_price) / entry_price * 100, 2)

    return ReactionMetrics(
        return_1m=_get_return_at_window(1),
        return_5m=_get_return_at_window(5),
        return_15m=_get_return_at_window(15),
        return_30m=_get_return_at_window(30),
    )


def detect_structure(
    snapshots: Sequence[MarketSnapshot], reaction: ReactionMetrics
) -> StructureMetrics:
    """Detects market intent, continuation, fake moves, and pullback strength from price/volume structure."""

    ret_5m = reaction.return_5m
    ret_15m = reaction.return_15m
    ret_30m = reaction.return_30m

    valid_returns = [r for r in [ret_5m, ret_15m, ret_30m] if r is not None]

    held_above_entry = all(r >= 0 for r in valid_returns) if valid_returns else False

    fake_move = False
    if ret_5m is not None and ret_15m is not None:
        if ret_5m > 3.0 and ret_15m < 0.0:
            fake_move = True
        elif ret_5m < -3.0 and ret_15m > 0.0:
            fake_move = True

    continuation = False
    if ret_5m is not None and ret_15m is not None:
        if ret_15m >= ret_5m > 0:
            continuation = True
        elif ret_30m is not None and ret_30m >= ret_15m > 0:
            continuation = True

    if not valid_returns:
        pullback_strength = "low"
    else:
        min_ret = min(valid_returns)
        if min_ret < -5.0:
            pullback_strength = "high"
        elif min_ret < -1.5:
            pullback_strength = "moderate"
        else:
            pullback_strength = "low"

    intent_type = "neutral"
    if fake_move:
        intent_type = "fakeout"
    elif continuation and held_above_entry:
        intent_type = "breakout"
    elif not held_above_entry and pullback_strength == "high":
        intent_type = "manipulation"
    elif held_above_entry and pullback_strength == "low":
        intent_type = "accumulation"

    base_score = 5.0
    if continuation:
        base_score += 2.5
    if held_above_entry:
        base_score += 1.5
    if fake_move:
        base_score -= 4.0
    if pullback_strength == "high":
        base_score -= 2.0
    strength_score = round(min(10.0, max(0.0, base_score)), 2)

    return StructureMetrics(
        held_above_entry=held_above_entry,
        pullback_strength=pullback_strength,
        continuation=continuation,
        fake_move=fake_move,
        intent_type=intent_type,
        strength_score=strength_score,
    )


def evaluate_microstructure(
    token_id: str,
    final_score: float,
    confidence: float,
    snapshots: Sequence[MarketSnapshot],
    reference_time: datetime | None = None,
) -> MicrostructureResult:
    """Aggregates reaction, structure, and tier classification into a complete MicrostructureResult."""

    tier = classify_prioritization_tier(final_score, confidence)
    freq = 1 if tier == "Tier 1" else (5 if tier == "Tier 2" else 60)

    reaction = compute_reaction(snapshots, reference_time=reference_time)
    structure = detect_structure(snapshots, reaction)

    eval_time = reference_time or (
        sorted(snapshots, key=lambda s: s.captured_at)[-1].captured_at
        if snapshots
        else datetime.now(UTC)
    )

    return MicrostructureResult(
        token_id=token_id,
        priority_tier=tier,
        tracking_frequency_minutes=freq,
        reaction=reaction,
        structure=structure,
        evaluated_at=eval_time,
    )
