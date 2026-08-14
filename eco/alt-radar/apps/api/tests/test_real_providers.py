from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from ag47_radar.config import Settings
from ag47_radar.enums import Chain
from ag47_radar.providers.holders import (
    EtherscanHolderProvider,
    HeliusHolderProvider,
    RoutingHolderProvider,
)
from ag47_radar.providers.registry import ProviderRegistry, RoutingContractRiskProvider
from ag47_radar.providers.solana_risk import RugCheckSolanaRiskProvider
from ag47_radar.providers.telegram import TelegramAlertDeliveryProvider


@pytest.fixture
def settings():
    return Settings(
        demo_mode=False,
        telegram_bot_token="test_bot_token",
        telegram_chat_id="test_chat_id",
        helius_api_key="test_helius_key",
    )


@pytest.mark.asyncio
async def test_rugcheck_solana_risk_provider_success(settings):
    provider = RugCheckSolanaRiskProvider(settings)

    mock_response = MagicMock()
    mock_response.data = {
        "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "score": 150,
        "token": {
            "mintAuthority": "BJE5MMbqXjVwjAF7oxwPYXnTXDyspzZyt4vwenNw5ruG",
            "supply": 1000000,
        },
        "totalHolders": 500,
        "topHolders": [
            {"pct": 12.5},
            {"pct": 8.0},
        ],
        "creatorBalance": 20000,
        "transferFee": {"pct": 1.5},
        "risks": [{"name": "No liquidity locked", "score": 200, "description": "Warning detail"}],
    }
    mock_response.from_cache = False

    with patch.object(provider.http, "get_json", AsyncMock(return_value=mock_response)):
        result = await provider.assess(Chain.SOLANA, "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
        assert result.data is not None
        assert result.data.risk_score == 1.5
        assert result.data.liquidity_lock_status == "unlocked"
        assert result.data.mintable is True
        assert result.data.buy_tax == 1.5
        assert result.data.holders_count == 500
        assert result.data.top_holders_percentage == 20.5
        assert result.data.deployer_percentage == 2.0
        assert len(result.data.flags) == 1
        assert result.data.flags[0]["rule"] == "No liquidity locked"


@pytest.mark.asyncio
async def test_helius_holder_provider_success(settings):
    provider = HeliusHolderProvider(settings)

    mock_supply_res = MagicMock()
    mock_supply_res.status_code = 200
    mock_supply_res.json.return_value = {
        "jsonrpc": "2.0",
        "result": {"value": {"uiAmount": 100000.0}},
    }

    mock_largest_res = MagicMock()
    mock_largest_res.status_code = 200
    mock_largest_res.json.return_value = {
        "jsonrpc": "2.0",
        "result": {
            "value": [
                {"uiAmount": 20000.0},
                {"uiAmount": 15000.0},
                {"uiAmount": 5000.0},
            ]
        },
    }

    with patch.object(provider.http.client, "post") as mock_post:
        mock_post.side_effect = [mock_supply_res, mock_largest_res]
        result = await provider.get_holders(
            Chain.SOLANA, "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        )
        assert result.data is not None
        assert result.data.top_holders_percentage == 40.0
        assert result.data.holders_count is None


@pytest.mark.asyncio
async def test_etherscan_holder_provider_success(settings):
    provider = EtherscanHolderProvider(settings)

    mock_response = MagicMock()
    mock_response.data = {
        "result": {
            "0x1111111111111111111111111111111111111111": {
                "holder_count": "1,250",
                "holders": [
                    {"percent": "0.15"},
                    {"percent": "0.05"},
                ],
                "creator_percent": "0.035",
            }
        }
    }
    mock_response.from_cache = False

    with patch.object(provider.http, "get_json", AsyncMock(return_value=mock_response)):
        result = await provider.get_holders(
            Chain.ETHEREUM, "0x1111111111111111111111111111111111111111"
        )
        assert result.data is not None
        assert result.data.holders_count == 1250
        assert result.data.top_holders_percentage == 20.0
        assert result.data.deployer_percentage == 3.5


@pytest.mark.asyncio
async def test_telegram_alert_delivery_provider_success(settings):
    provider = TelegramAlertDeliveryProvider(settings)

    mock_res = MagicMock()
    mock_res.status_code = 200
    mock_res.json.return_value = {
        "ok": True,
        "result": {"message_id": 9876},
    }

    with patch.object(provider.http.client, "post", AsyncMock(return_value=mock_res)) as mock_post:
        result = await provider.deliver(
            alert_id="a-1",
            title="Warning Title",
            message="Critical event occurred on chain",
            payload={},
        )
        assert result.data.accepted is True
        assert result.data.destination == "telegram:test_chat_id"
        assert result.data.external_id == "9876"


@pytest.mark.asyncio
async def test_telegram_public_social_provider_success(settings):
    from ag47_radar.providers.social import TelegramPublicSocialProvider
    
    provider = TelegramPublicSocialProvider(settings)
    
    # It currently returns unknown gracefully
    result = await provider.collect("solana:test_token")
    assert result.data is None
    assert result.quality.name == "UNKNOWN"
    assert any(e.code == "telegram_chat_id_unknown" for e in result.partial_errors)

@pytest.mark.asyncio
async def test_routing_providers(settings):
    risk_router = RoutingContractRiskProvider(settings)
    holder_router = RoutingHolderProvider(settings)

    # Test that Solana routes to RugCheck/Helius and EVM routes to GoPlus/Etherscan
    with (
        patch.object(risk_router.solana_risk, "assess", AsyncMock(return_value="solana_risk")),
        patch.object(risk_router.evm_risk, "assess", AsyncMock(return_value="evm_risk")),
    ):
        res_sol = await risk_router.assess(Chain.SOLANA, "addr1")
        res_evm = await risk_router.assess(Chain.ETHEREUM, "addr2")
        assert res_sol == "solana_risk"
        assert res_evm == "evm_risk"

    with (
        patch.object(
            holder_router.solana_provider, "get_holders", AsyncMock(return_value="solana_holders")
        ),
        patch.object(
            holder_router.evm_provider, "get_holders", AsyncMock(return_value="evm_holders")
        ),
    ):
        res_sol_h = await holder_router.get_holders(Chain.SOLANA, "addr1")
        res_evm_h = await holder_router.get_holders(Chain.ETHEREUM, "addr2")
        assert res_sol_h == "solana_holders"
        assert res_evm_h == "evm_holders"
        
    from ag47_radar.providers.social import RoutingSocialProvider
    social_router = RoutingSocialProvider(settings)
    
    with patch.object(social_router.telegram, "collect", AsyncMock(return_value="telegram_social")):
        res_social = await social_router.collect("solana:test_token")
        assert res_social == "telegram_social"


@pytest.mark.asyncio
async def test_registry_integration(settings):
    # Test registry instantiation under real mode
    registry = ProviderRegistry(settings)
    from ag47_radar.providers.social import RoutingSocialProvider
    
    assert isinstance(registry.holders, RoutingHolderProvider)
    assert isinstance(registry.risk, RoutingContractRiskProvider)
    assert isinstance(registry.alert_delivery, TelegramAlertDeliveryProvider)
    assert isinstance(registry.social, RoutingSocialProvider)

    # Clean up registry
    await registry.close()
