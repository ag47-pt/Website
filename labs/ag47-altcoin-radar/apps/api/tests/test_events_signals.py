from decimal import Decimal

from ag47_radar.models import MarketSnapshot, TokenEvent
from ag47_radar.services.events import generate_market_events
from ag47_radar.services.signals import generate_signals


def test_generate_market_events_liquidity_drop():
    old = MarketSnapshot(
        id="old-id",
        liquidity_usd=Decimal("100000"),
        volume_5m=Decimal("5000"),
        is_demo=False,
    )
    new = MarketSnapshot(
        id="new-id",
        liquidity_usd=Decimal("70000"),  # -30%
        volume_5m=Decimal("5000"),
        is_demo=False,
    )
    events = generate_market_events(old, new, "test-token-id")
    assert len(events) == 1
    assert events[0].event_type == "liquidity_drop"
    assert events[0].token_id == "test-token-id"
    assert events[0].caused_by == ["old-id", "new-id"]
    assert events[0].rule_version == "events-v1"


def test_generate_market_events_liquidity_spike():
    old = MarketSnapshot(
        id="old-id",
        liquidity_usd=Decimal("100000"),
        volume_5m=Decimal("5000"),
        is_demo=False,
    )
    new = MarketSnapshot(
        id="new-id",
        liquidity_usd=Decimal("160000"),  # +60%
        volume_5m=Decimal("5000"),
        is_demo=False,
    )
    events = generate_market_events(old, new, "test-token-id")
    assert len(events) == 1
    assert events[0].event_type == "liquidity_spike"
    assert events[0].token_id == "test-token-id"
    assert events[0].caused_by == ["old-id", "new-id"]


def test_generate_market_events_volume_spike():
    old = MarketSnapshot(
        id="old-id",
        liquidity_usd=Decimal("100000"),
        volume_5m=Decimal("5000"),
        is_demo=False,
    )
    new = MarketSnapshot(
        id="new-id",
        liquidity_usd=Decimal("100000"),
        volume_5m=Decimal("16000"),  # +220%
        is_demo=False,
    )
    events = generate_market_events(old, new, "test-token-id")
    assert len(events) == 1
    assert events[0].event_type == "volume_spike"
    assert events[0].token_id == "test-token-id"
    assert events[0].caused_by == ["old-id", "new-id"]


def test_generate_signals_contraction():
    events = [
        TokenEvent(id="e1", event_type="liquidity_drop", is_demo=False, metadata_json={"drop_percentage": 30.0}),
        TokenEvent(id="e2", event_type="volume_spike", is_demo=False, metadata_json={"increase_percentage": 300.0}),
    ]
    signals = generate_signals(events, "test-token-id")
    assert len(signals) == 1
    assert signals[0].signal_type == "high_volume_liquidity_contraction"
    assert signals[0].token_id == "test-token-id"
    assert set(signals[0].caused_by) == {"e1", "e2"}
    assert signals[0].rule_version == "signals-v1"
    assert signals[0].confidence == Decimal("0.85")
    assert signals[0].strength > Decimal("0.0")


def test_generate_signals_expansion():
    events = [
        TokenEvent(id="e1", event_type="liquidity_spike", is_demo=False, metadata_json={"spike_percentage": 50.0}),
        TokenEvent(id="e2", event_type="volume_spike", is_demo=False, metadata_json={"increase_percentage": 200.0}),
    ]
    signals = generate_signals(events, "test-token-id")
    assert len(signals) == 1
    assert signals[0].signal_type == "liquidity_volume_expansion"
    assert signals[0].token_id == "test-token-id"
    assert set(signals[0].caused_by) == {"e1", "e2"}
    assert signals[0].rule_version == "signals-v1"
    assert signals[0].confidence == Decimal("0.90")
    assert signals[0].strength > Decimal("0.0")


def test_events_idempotency():
    # If the situation remains the same (prices stay identically high), 
    # the delta between T_0 and T_1 is zero, thus no additional events generated.
    t_minus_1 = MarketSnapshot(
        id="t-minus-1",
        liquidity_usd=Decimal("100000"),
        volume_5m=Decimal("5000"),
        is_demo=False,
    )
    t_0 = MarketSnapshot(
        id="t-0",
        liquidity_usd=Decimal("160000"),  # spike occurred
        volume_5m=Decimal("16000"),       # spike occurred
        is_demo=False,
    )
    events_t0 = generate_market_events(t_minus_1, t_0, "test")
    assert len(events_t0) == 2 # both spikes
    
    t_1 = MarketSnapshot(
        id="t-1",
        liquidity_usd=Decimal("160000"),  # same as t_0
        volume_5m=Decimal("16000"),       # same as t_0
        is_demo=False,
    )
    events_t1 = generate_market_events(t_0, t_1, "test")
    assert len(events_t1) == 0 # Idempotent!
