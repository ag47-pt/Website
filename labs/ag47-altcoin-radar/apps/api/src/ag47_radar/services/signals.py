from __future__ import annotations

import hashlib
import json
from decimal import Decimal

from ag47_radar.models import TokenEvent, TokenSignal


def generate_signals(
    recent_events: list[TokenEvent],
    token_id: str,
) -> list[TokenSignal]:
    """
    Agrega TokenEvents recentes e produz interpretações semânticas defensivas.
    """
    signals: list[TokenSignal] = []
    if not recent_events:
        return signals

    event_map = {e.event_type: e for e in recent_events}
    is_demo = any(e.is_demo for e in recent_events)
    rule_version = "signals-v1"

    if "liquidity_spike" in event_map and "volume_spike" in event_map:
        e_liq = event_map["liquidity_spike"]
        e_vol = event_map["volume_spike"]
        causes = [e_liq.id, e_vol.id]

        liq_increase = float(e_liq.metadata_json.get("spike_percentage", 50)) / 100.0
        vol_increase = float(e_vol.metadata_json.get("increase_percentage", 200)) / 100.0

        # Strength (0-1): Based on how much above the threshold they are
        # Let's say cap liq at 500% (5.0) and vol at 1000% (10.0)
        liq_strength = min(liq_increase / 5.0, 1.0)
        vol_strength = min(vol_increase / 10.0, 1.0)
        strength = Decimal(str(round((liq_strength + vol_strength) / 2.0, 2)))

        # Confidence: High for basic observation
        confidence = Decimal("0.90")

        cb_hash = hashlib.sha256(json.dumps(sorted(causes)).encode("utf-8")).hexdigest()

        signals.append(
            TokenSignal(
                token_id=token_id,
                signal_type="liquidity_volume_expansion",
                strength=strength,
                confidence=confidence,
                rule_version=rule_version,
                metadata_json={"description": "High volume spike accompanied by liquidity addition"},
                caused_by=causes,
                caused_by_hash=cb_hash,
                is_demo=is_demo,
            )
        )

    if "liquidity_drop" in event_map and "volume_spike" in event_map:
        e_liq = event_map["liquidity_drop"]
        e_vol = event_map["volume_spike"]
        causes = [e_liq.id, e_vol.id]

        liq_drop = float(e_liq.metadata_json.get("drop_percentage", 20)) / 100.0
        vol_increase = float(e_vol.metadata_json.get("increase_percentage", 200)) / 100.0

        # Strength: 0 to 1
        liq_strength = min(liq_drop / 1.0, 1.0) # max 100% drop
        vol_strength = min(vol_increase / 10.0, 1.0)
        strength = Decimal(str(round((liq_strength + vol_strength) / 2.0, 2)))

        confidence = Decimal("0.85")

        cb_hash = hashlib.sha256(json.dumps(sorted(causes)).encode("utf-8")).hexdigest()

        signals.append(
            TokenSignal(
                token_id=token_id,
                signal_type="high_volume_liquidity_contraction",
                strength=strength,
                confidence=confidence,
                rule_version=rule_version,
                metadata_json={"description": "High volume spike accompanied by liquidity drop"},
                caused_by=causes,
                caused_by_hash=cb_hash,
                is_demo=is_demo,
            )
        )

    return signals
