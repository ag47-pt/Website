from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass

from ag47_radar.models import MarketSnapshot, TokenEvent


@dataclass(slots=True)
class EventRule:
    event_type: str
    threshold: float
    window: str
    min_value: float
    version: str


RULES = {
    "liquidity_drop": EventRule(
        event_type="liquidity_drop",
        threshold=-0.2,
        window="current",
        min_value=0.0,
        version="events-v1",
    ),
    "liquidity_spike": EventRule(
        event_type="liquidity_spike",
        threshold=0.5,
        window="current",
        min_value=0.0,
        version="events-v1",
    ),
    "volume_spike": EventRule(
        event_type="volume_spike",
        threshold=2.0,
        window="5m",
        min_value=0.0,
        version="events-v1",
    ),
}


def generate_market_events(
    old_snapshot: MarketSnapshot | None,
    new_snapshot: MarketSnapshot,
    token_id: str,
) -> list[TokenEvent]:
    """
    Analisa deltas entre a Camada de Observação atual e a anterior.
    Gera eventos baseados em regras configuráveis e versionadas.
    """
    events: list[TokenEvent] = []
    if old_snapshot is None:
        return events

    # Liquidity Drop / Spike
    if old_snapshot.liquidity_usd and new_snapshot.liquidity_usd:
        old_liq = float(old_snapshot.liquidity_usd)
        new_liq = float(new_snapshot.liquidity_usd)
        if old_liq > 0:
            diff = (new_liq - old_liq) / old_liq

            rule_drop = RULES["liquidity_drop"]
            if diff <= rule_drop.threshold:
                causes = [old_snapshot.id, new_snapshot.id]
                cb_hash = hashlib.sha256(json.dumps(sorted(causes)).encode("utf-8")).hexdigest()
                events.append(
                    TokenEvent(
                        token_id=token_id,
                        event_type=rule_drop.event_type,
                        rule_version=rule_drop.version,
                        metadata_json={
                            "previous": old_liq,
                            "new": new_liq,
                            "drop_percentage": round(abs(diff) * 100, 2),
                            "rule_threshold": rule_drop.threshold,
                            "rule_window": rule_drop.window,
                        },
                        caused_by=causes,
                        caused_by_hash=cb_hash,
                        is_demo=new_snapshot.is_demo,
                    )
                )

            rule_spike = RULES["liquidity_spike"]
            if diff >= rule_spike.threshold:
                causes = [old_snapshot.id, new_snapshot.id]
                cb_hash = hashlib.sha256(json.dumps(sorted(causes)).encode("utf-8")).hexdigest()
                events.append(
                    TokenEvent(
                        token_id=token_id,
                        event_type=rule_spike.event_type,
                        rule_version=rule_spike.version,
                        metadata_json={
                            "previous": old_liq,
                            "new": new_liq,
                            "spike_percentage": round(diff * 100, 2),
                            "rule_threshold": rule_spike.threshold,
                            "rule_window": rule_spike.window,
                        },
                        caused_by=causes,
                        caused_by_hash=cb_hash,
                        is_demo=new_snapshot.is_demo,
                    )
                )

    # Volume Spike
    if old_snapshot.volume_5m and new_snapshot.volume_5m:
        old_vol = float(old_snapshot.volume_5m)
        new_vol = float(new_snapshot.volume_5m)
        if old_vol > 0:
            diff = (new_vol - old_vol) / old_vol
            rule_vol = RULES["volume_spike"]
            if diff >= rule_vol.threshold:
                causes = [old_snapshot.id, new_snapshot.id]
                cb_hash = hashlib.sha256(json.dumps(sorted(causes)).encode("utf-8")).hexdigest()
                events.append(
                    TokenEvent(
                        token_id=token_id,
                        event_type=rule_vol.event_type,
                        rule_version=rule_vol.version,
                        metadata_json={
                            "previous": old_vol,
                            "new": new_vol,
                            "increase_percentage": round(diff * 100, 2),
                            "rule_threshold": rule_vol.threshold,
                            "rule_window": rule_vol.window,
                        },
                        caused_by=causes,
                        caused_by_hash=cb_hash,
                        is_demo=new_snapshot.is_demo,
                    )
                )

    return events
