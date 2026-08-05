import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_ok(api_client: AsyncClient):
    response = await api_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_system_status(api_client: AsyncClient):
    response = await api_client.get("/api/v1/system/status")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert data["metrics"]["tokens_monitored"] >= 0


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
