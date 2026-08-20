import pytest
from fastapi import FastAPI
from httpx import AsyncClient

from ag47_radar.api.dependencies import (
    enforce_mutation_rate_limit,
    require_admin,
    require_operator,
)


@pytest.mark.asyncio
async def test_health_ok(api_client: AsyncClient):
    response = await api_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_cors_preflight_allows_authenticated_patch(api_client: AsyncClient):
    response = await api_client.options(
        "/api/v1/alerts/00000000-0000-4000-8000-000000000001",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "PATCH",
            "Access-Control-Request-Headers": "content-type,x-ag47-api-key",
        },
    )

    assert response.status_code == 200
    assert "PATCH" in response.headers["access-control-allow-methods"]
    allowed_headers = response.headers["access-control-allow-headers"].lower()
    assert "content-type" in allowed_headers
    assert "x-ag47-api-key" in allowed_headers
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"


def test_all_mutation_routes_are_authenticated_and_rate_limited(test_app: FastAPI):
    expected_guards = {
        ("POST", "/api/v1/system/providers/{provider_id}/reset-circuit"): require_admin,
        ("PATCH", "/api/v1/alerts/{alert_id}"): require_operator,
        ("POST", "/api/v1/watchlist"): require_operator,
        ("DELETE", "/api/v1/watchlist/{token_id}"): require_operator,
        ("POST", "/api/v1/system/notification-settings"): require_admin,
        ("POST", "/api/v1/system/webhook/test"): require_admin,
        ("POST", "/api/v1/system/optimize-weights"): require_admin,
        ("POST", "/api/v1/system/apply-weights"): require_admin,
    }
    actual: dict[tuple[str, str], set[object]] = {}

    for registered_route in test_app.routes:
        route_contexts = (
            registered_route.effective_route_contexts()
            if hasattr(registered_route, "effective_route_contexts")
            else (registered_route,)
        )
        for route in route_contexts:
            if not hasattr(route, "dependant"):
                continue
            dependency_calls = {dependency.call for dependency in route.dependant.dependencies}
            for method in (route.methods or set()) & {"POST", "PATCH", "DELETE"}:
                actual[(method, route.path)] = dependency_calls

    assert set(actual) == set(expected_guards)
    for route_key, expected_guard in expected_guards.items():
        assert expected_guard in actual[route_key]
        assert enforce_mutation_rate_limit in actual[route_key]


@pytest.mark.asyncio
async def test_system_status(api_client: AsyncClient):
    response = await api_client.get("/api/v1/system/status")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert data["metrics"]["tokens_monitored"] >= 0


@pytest.mark.asyncio
async def test_system_evolution_reports_current_hardening_stage(api_client: AsyncClient):
    response = await api_client.get("/api/v1/system/evolution")

    assert response.status_code == 200
    assert response.json() == {
        "phase": "Hardening 1",
        "phase_title": "Estabilização operacional da beta pública",
        "now": (
            "Verdade operacional, ingestão durável, gates de qualidade e entrega "
            "reprodutível sem ampliar o escopo observacional."
        ),
        "completed_steps": 4,
        "total_steps": 5,
        "goal": "Lóbulo Observacional do Organismo Cognitivo",
    }


@pytest.mark.asyncio
async def test_system_calibration(api_client: AsyncClient):
    response = await api_client.get("/api/v1/system/calibration")
    assert response.status_code == 200
    data = response.json()
    assert "scoring_version" in data
    assert "base_weights" in data
    assert "calibrated_weights" in data
    assert data["base_weights"]["momentum_score"] == 0.25


@pytest.mark.asyncio
async def test_opportunities_empty(api_client: AsyncClient):
    response = await api_client.get("/api/v1/opportunities")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []


@pytest.mark.asyncio
async def test_opportunities_with_data(api_client: AsyncClient, seeded_db):
    response = await api_client.get("/api/v1/opportunities")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0


@pytest.mark.asyncio
async def test_opportunities_pagination(api_client: AsyncClient, seeded_db):
    response1 = await api_client.get("/api/v1/opportunities?page=1&page_size=2")
    assert response1.status_code == 200
    data1 = response1.json()
    assert len(data1["items"]) <= 2

    response2 = await api_client.get("/api/v1/opportunities?page=2&page_size=2")
    assert response2.status_code == 200


@pytest.mark.asyncio
async def test_token_detail_not_found(api_client: AsyncClient):
    # token_id is a UUID length string
    import uuid

    dummy_id = str(uuid.uuid4())
    response = await api_client.get(f"/api/v1/tokens/{dummy_id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_token_detail_found(api_client: AsyncClient, seeded_db):
    opp_response = await api_client.get("/api/v1/opportunities")
    tokens = opp_response.json()["items"]
    token_id = tokens[0]["token"]["id"]

    response = await api_client.get(f"/api/v1/tokens/{token_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["token"]["id"] == token_id


@pytest.mark.asyncio
async def test_watchlist_crud(api_client: AsyncClient, seeded_db):
    opp_response = await api_client.get("/api/v1/opportunities")
    tokens = opp_response.json()["items"]
    token_id = tokens[0]["token"]["id"]

    # POST
    post_resp = await api_client.post(
        "/api/v1/watchlist", json={"token_id": token_id, "notes": "Test Note"}
    )
    assert post_resp.status_code in (200, 201)

    # GET
    get_resp = await api_client.get("/api/v1/watchlist")
    assert get_resp.status_code == 200
    data = get_resp.json()
    assert any(item["token"]["id"] == token_id for item in data["items"])

    # DELETE
    del_resp = await api_client.delete(f"/api/v1/watchlist/{token_id}")
    assert del_resp.status_code == 204

    # GET again
    get2_resp = await api_client.get("/api/v1/watchlist")
    assert get2_resp.status_code == 200
    data2 = get2_resp.json()
    assert not any(item["token"]["id"] == token_id for item in data2["items"])


@pytest.mark.asyncio
async def test_alerts_endpoint(api_client: AsyncClient, seeded_db):
    response = await api_client.get("/api/v1/alerts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["items"], list)


@pytest.mark.asyncio
async def test_validation_error_format(api_client: AsyncClient):
    # Send an invalid UUID length
    response = await api_client.get("/api/v1/tokens/invalid-id")
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "validation_error"
    assert "details" in data["error"]
    assert "fields" in data["error"]["details"]


@pytest.mark.asyncio
async def test_reset_provider_circuit(api_client: AsyncClient, test_app: FastAPI, monkeypatch):
    async def reset_circuit(_provider_id: str) -> bool:
        return True

    monkeypatch.setattr(test_app.state.providers, "reset_circuit", reset_circuit)
    response = await api_client.post("/api/v1/system/providers/geckoterminal/reset-circuit")
    assert response.status_code == 200
    assert response.json() == {"success": True}


@pytest.mark.asyncio
async def test_reset_unknown_provider_does_not_report_http_success(api_client: AsyncClient):
    response = await api_client.post("/api/v1/system/providers/unknown/reset-circuit")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "resource_not_found"


@pytest.mark.asyncio
async def test_notification_settings_crud(api_client: AsyncClient):
    # GET default settings
    response = await api_client.get("/api/v1/system/notification-settings")
    assert response.status_code == 200
    data = response.json()
    assert "min_severity" in data
    assert "min_confidence" in data
    assert "allowed_chains" in data
    assert data["min_severity"] == 0.0

    # POST updates
    update_response = await api_client.post(
        "/api/v1/system/notification-settings",
        json={"min_severity": 0.5, "min_confidence": 0.6, "allowed_chains": ["solana"]},
    )
    assert update_response.status_code == 200
    updated_data = update_response.json()
    assert updated_data["min_severity"] == 0.5
    assert updated_data["min_confidence"] == 0.6
    assert updated_data["allowed_chains"] == ["solana"]

    # GET updated settings
    response2 = await api_client.get("/api/v1/system/notification-settings")
    assert response2.status_code == 200
    data2 = response2.json()
    assert data2["min_severity"] == 0.5
    assert data2["allowed_chains"] == ["solana"]


@pytest.mark.asyncio
async def test_get_notifications_history(api_client: AsyncClient, seeded_db):
    response = await api_client.get("/api/v1/system/notifications")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert isinstance(data["items"], list)


@pytest.mark.asyncio
async def test_removed_fake_webhook_broadcast_is_not_exposed(api_client: AsyncClient):
    response = await api_client.post(
        "/api/v1/webhooks/broadcast",
        json={"data": {"chosen": "message"}, "target_url": "https://example.com"},
    )

    assert response.status_code == 404
