import pytest
from httpx import AsyncClient

from ag47_radar.services.webhooks import sign_payload


def test_sign_payload_deterministic():
    payload = b'{"event":"test"}'
    secret = "my-secret-key"
    sig1 = sign_payload(payload, secret)
    sig2 = sign_payload(payload, secret)
    assert sig1 == sig2
    assert len(sig1) == 64  # SHA-256 hex digest


def test_sign_payload_different_secrets():
    payload = b'{"event":"test"}'
    sig1 = sign_payload(payload, "secret-a")
    sig2 = sign_payload(payload, "secret-b")
    assert sig1 != sig2


def test_sign_payload_different_payloads():
    secret = "my-secret"
    sig1 = sign_payload(b'{"a":1}', secret)
    sig2 = sign_payload(b'{"b":2}', secret)
    assert sig1 != sig2


@pytest.mark.asyncio
async def test_webhook_settings_crud(api_client: AsyncClient):
    # POST webhook settings
    response = await api_client.post(
        "/api/v1/system/notification-settings",
        json={
            "webhook_url": "https://example.com/webhook",
            "webhook_secret": "test-secret-123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["webhook_url"] == "https://example.com/webhook"
    assert data["webhook_configured"] is True

    # GET should reflect webhook
    get_resp = await api_client.get("/api/v1/system/notification-settings")
    assert get_resp.status_code == 200
    get_data = get_resp.json()
    assert get_data["webhook_url"] == "https://example.com/webhook"
    assert get_data["webhook_configured"] is True


@pytest.mark.asyncio
async def test_webhook_test_no_config(api_client: AsyncClient):
    # Before any webhook is configured
    response = await api_client.post("/api/v1/system/webhook/test")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False


@pytest.mark.asyncio
async def test_chain_status_endpoint(api_client: AsyncClient):
    response = await api_client.get("/api/v1/system/chains/status")
    assert response.status_code == 200
    data = response.json()
    assert "chains" in data
    assert "generated_at" in data
    assert isinstance(data["chains"], list)


@pytest.mark.asyncio
async def test_chain_status_with_data(api_client: AsyncClient, seeded_db):
    response = await api_client.get("/api/v1/system/chains/status")
    assert response.status_code == 200
    data = response.json()
    assert len(data["chains"]) > 0
    for chain in data["chains"]:
        assert "chain" in chain
        assert "tokens_active" in chain
        assert "liquidity_tracked" in chain
        assert "alerts_24h" in chain
        assert chain["status"] in ("green", "yellow", "red")


@pytest.mark.asyncio
async def test_export_truth_dataset_json(api_client: AsyncClient):
    response = await api_client.get("/api/v1/system/export/truth-dataset?format=json")
    assert response.status_code == 200
    assert response.headers.get("content-type", "").startswith("application/json")
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_export_truth_dataset_csv(api_client: AsyncClient):
    response = await api_client.get("/api/v1/system/export/truth-dataset?format=csv")
    assert response.status_code == 200
    assert "text/csv" in response.headers.get("content-type", "")
