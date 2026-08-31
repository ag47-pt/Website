import os
import tempfile

os.environ["RADAR_DB_PATH"] = os.path.join(tempfile.gettempdir(), "radar_test.db")

from app import app, assess_property


def test_assess_property_returns_scoring():
    payload = {
        "market_value": 520000,
        "auction_price": 285000,
        "iptu": 1800,
        "condo": 2400,
        "legal_cost": 6000,
        "renovation": 12000,
        "court_risk": 0.3,
        "occupancy": 0.2,
        "expected_rent": 1800,
    }

    result = assess_property(payload)

    assert result["score"] >= 60
    assert "recommendation" in result
    assert result["total_cost"] > 0


def test_api_lead_capture_and_assessment():
    with app.test_client() as client:
        lead = client.post(
            "/api/lead",
            json={
                "name": "Ana",
                "email": "ana@example.com",
                "phone": "351912345678",
                "city": "Lisboa",
            },
        )
        assert lead.status_code == 200
        assert lead.get_json()["status"] == "created"

        assessment = client.post(
            "/api/assess",
            json={
                "market_value": 520000,
                "auction_price": 285000,
                "iptu": 1800,
                "condo": 2400,
                "legal_cost": 6000,
                "renovation": 12000,
                "court_risk": 0.3,
                "occupancy": 0.2,
                "expected_rent": 1800,
            },
        )

        assert assessment.status_code == 200
        payload = assessment.get_json()
        assert payload["score"] >= 60
        assert payload["recommendation"]
