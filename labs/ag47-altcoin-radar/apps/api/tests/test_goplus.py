from unittest.mock import AsyncMock

import pytest

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, DataQuality
from ag47_radar.providers.goplus import GoPlusContractRiskProvider
from ag47_radar.providers.resilience import JsonResponse, ProviderUnavailableError

ADDRESS = "0x" + "a" * 40


def build_provider(payload=None, error=None) -> GoPlusContractRiskProvider:
    provider = GoPlusContractRiskProvider(Settings())
    if error is not None:
        provider.http.get_json = AsyncMock(side_effect=error)
    else:
        provider.http.get_json = AsyncMock(
            return_value=JsonResponse(data=payload, from_cache=False, duration_ms=1.0)
        )
    return provider


def risky_token(**overrides):
    token = {
        "is_honeypot": "0",
        "is_mintable": "1",
        "is_blacklisted": "1",
        "slippage_modifiable": "0",
        "is_proxy": "0",
        "is_open_source": "1",
        "hidden_owner": "0",
        "can_take_back_ownership": "0",
        "selfdestruct": "0",
        "buy_tax": "0.05",
        "sell_tax": "0.12",
        "holder_count": "1,234",
        "creator_percent": "0.031",
        "owner_address": "0x" + "b" * 40,
        "holders": [{"percent": "0.30"}, {"percent": "0.25"}],
        "lp_holders": [
            {"percent": "0.7", "is_locked": 1},
            {"percent": "0.3", "is_locked": 0},
        ],
    }
    token.update(overrides)
    return token


def payload_for(token) -> dict:
    return {"code": 1, "result": {ADDRESS: token}}


@pytest.mark.asyncio
async def test_normalizes_evm_token_security():
    provider = build_provider(payload_for(risky_token()))
    result = await provider.assess(Chain.BSC, ADDRESS)
    data = result.data
    assert data is not None
    assert result.quality == DataQuality.HIGH
    assert data.mintable is True
    assert data.blacklist_capability is True
    assert data.buy_tax == 5.0
    assert data.sell_tax == 12.0
    assert data.holders_count == 1234
    assert data.top_holders_percentage == 55.0
    assert data.deployer_percentage == 3.1
    assert data.liquidity_lock_status == "locked"
    assert data.honeypot_status == "clear"
    # mintable(2.0) + blacklist(2.0) + sell_tax>=10%(2.0) + top_holders>=50%(1.5)
    assert data.risk_score == 7.5
    assert {flag["rule"] for flag in data.flags} == {
        "mintable",
        "blacklist",
        "high_sell_tax",
        "holder_concentration",
    }


@pytest.mark.asyncio
async def test_honeypot_caps_score_at_ten():
    provider = build_provider(payload_for(risky_token(is_honeypot="1", selfdestruct="1")))
    result = await provider.assess(Chain.ETHEREUM, ADDRESS)
    assert result.data is not None
    assert result.data.risk_score == 10.0
    assert result.data.honeypot_status == "honeypot"


@pytest.mark.asyncio
async def test_solana_reports_unsupported():
    provider = build_provider(payload_for(risky_token()))
    result = await provider.assess(Chain.SOLANA, "So11111111111111111111111111111111111111112")
    assert result.data is None
    assert result.partial_errors[0].code == "chain_unsupported"


@pytest.mark.asyncio
async def test_invalid_address_rejected():
    provider = build_provider(payload_for(risky_token()))
    result = await provider.assess(Chain.BSC, "not-an-address")
    assert result.data is None
    assert result.partial_errors[0].code == "invalid_contract_address"


@pytest.mark.asyncio
async def test_unavailable_provider_returns_retryable_error():
    provider = build_provider(error=ProviderUnavailableError("boom"))
    result = await provider.assess(Chain.BSC, ADDRESS)
    assert result.data is None
    assert result.partial_errors[0].code == "risk_provider_unavailable"
    assert result.partial_errors[0].retryable is True


@pytest.mark.asyncio
async def test_token_not_found():
    provider = build_provider({"code": 1, "result": {}})
    result = await provider.assess(Chain.BSC, ADDRESS)
    assert result.data is None
    assert result.partial_errors[0].code == "token_not_found"
