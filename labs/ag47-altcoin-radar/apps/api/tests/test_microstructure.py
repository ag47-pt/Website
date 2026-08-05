from datetime import UTC, datetime, timedelta

import pytest
from httpx import AsyncClient

from ag47_radar.models import MarketSnapshot
from ag47_radar.services.microstructure import (
    classify_prioritization_tier,
    compute_reaction,
    detect_structure,
    evaluate_microstructure,
)

T0 = datetime(2026, 8, 1, 12, 0, tzinfo=UTC)


def test_classify_prioritization_tier():
    assert classify_prioritization_tier(8.5, 0.70) == "Tier 1"
    assert classify_prioritization_tier(7.5, 0.60) == "Tier 2"
    assert classify_prioritization_tier(4.0, 0.40) == "Tier 3"


def test_compute_reaction():
    snapshots = [
        MarketSnapshot(captured_at=T0, price_usd=100.0),
        MarketSnapshot(captured_at=T0 + timedelta(minutes=1), price_usd=101.0),
        MarketSnapshot(captured_at=T0 + timedelta(minutes=5), price_usd=105.0),
        MarketSnapshot(captured_at=T0 + timedelta(minutes=15), price_usd=110.0),
        MarketSnapshot(captured_at=T0 + timedelta(minutes=30), price_usd=120.0),
    ]

    reaction = compute_reaction(snapshots, reference_time=T0)
    assert reaction.return_1m == 1.0
    assert reaction.return_5m == 5.0
    assert reaction.return_15m == 10.0
    assert reaction.return_30m == 20.0


def test_detect_structure_continuation():
    snapshots = [
        MarketSnapshot(captured_at=T0, price_usd=100.0),
        MarketSnapshot(captured_at=T0 + timedelta(minutes=5), price_usd=103.0),
        MarketSnapshot(captured_at=T0 + timedelta(minutes=15), price_usd=108.0),
    ]
    reaction = compute_reaction(snapshots, reference_time=T0)
    structure = detect_structure(snapshots, reaction)

    assert structure.continuation is True
    assert structure.fake_move is False
    assert structure.intent_type == "breakout"
    assert structure.strength_score >= 7.5


def test_detect_structure_fakeout():
    snapshots = [
        MarketSnapshot(captured_at=T0, price_usd=100.0),
        MarketSnapshot(captured_at=T0 + timedelta(minutes=5), price_usd=105.0),
        MarketSnapshot(captured_at=T0 + timedelta(minutes=15), price_usd=98.0),
    ]
    reaction = compute_reaction(snapshots, reference_time=T0)
    structure = detect_structure(snapshots, reaction)

    assert structure.fake_move is True
    assert structure.intent_type == "fakeout"


def test_evaluate_microstructure():
    snapshots = [
        MarketSnapshot(captured_at=T0, price_usd=100.0),
        MarketSnapshot(captured_at=T0 + timedelta(minutes=5), price_usd=102.0),
    ]
    result = evaluate_microstructure("tok-1", 8.5, 0.75, snapshots, reference_time=T0)
    assert result.priority_tier == "Tier 1"
    assert result.tracking_frequency_minutes == 1
    assert result.reaction.return_5m == 2.0


@pytest.mark.asyncio
async def test_microstructure_api_endpoint(api_client: AsyncClient, seeded_db):
    opp_response = await api_client.get("/api/v1/opportunities")
    tokens = opp_response.json()["items"]
    token_id = tokens[0]["token"]["id"]

    response = await api_client.get(f"/api/v1/tokens/{token_id}/microstructure")
    assert response.status_code == 200
    data = response.json()
    assert "priority_tier" in data
    assert "tracking_frequency_minutes" in data
    assert "reaction" in data
    assert "structure" in data
