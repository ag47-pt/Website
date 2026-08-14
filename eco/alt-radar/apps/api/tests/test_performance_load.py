import time
import tracemalloc
from datetime import UTC, datetime
from unittest.mock import AsyncMock

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, DataQuality, SourceMode
from ag47_radar.providers.contracts import (
    DiscoveredPair,
    MarketDataProvider,
    MarketPairData,
    PairDiscoveryProvider,
    ProviderResult,
)
from ag47_radar.providers.registry import ProviderRegistry
from ag47_radar.services.ingestion import run_ingestion_cycle


@pytest.fixture
def mock_load_providers():
    discovery = AsyncMock(spec=PairDiscoveryProvider)
    discovery.provider_id = "test_discovery"

    # Generate 100 tokens
    tokens = []
    for i in range(100):
        tokens.append(
            DiscoveredPair(
                chain=Chain.SOLANA,
                contract_address=f"token_{i}",
                token_name=f"Token {i}",
                token_symbol=f"TKN{i}",
                pair_address=f"pair_{i}",
                quote_token="SOL",
                dex="raydium",
                decimals=9,
            )
        )

    discovery.discover.return_value = ProviderResult(
        data=tokens,
        source="test",
        collected_at=datetime.now(UTC),
        quality=DataQuality.HIGH,
        mode=SourceMode.REAL,
        duration_ms=10.0,
        partial_errors=[],
    )

    market = AsyncMock(spec=MarketDataProvider)
    market.provider_id = "test_market"

    async def get_pair_mock(chain, pair_address):
        idx = pair_address.split("_")[1]
        return ProviderResult(
            data=MarketPairData(
                chain=Chain.SOLANA,
                contract_address=f"token_{idx}",
                pair_address=pair_address,
                token_symbol=f"TKN{idx}",
                token_name=f"Token {idx}",
                quote_token="SOL",
                dex="raydium",
                price_usd=1.50,
                liquidity_usd=150000.0,
                volume_5m=5000.0,
                volume_1h=60000.0,
                volume_24h=1000000.0,
                price_change_5m=0.05,
                price_change_1h=0.10,
                price_change_24h=-0.05,
                market_cap=1500000.0,
                fdv=1500000.0,
                buyers=150,
                sellers=120,
                source_url="http://test.com",
                pair_created_at=None,
            ),
            source="test",
            collected_at=datetime.now(UTC),
            quality=DataQuality.HIGH,
            mode=SourceMode.REAL,
            duration_ms=10.0,
            partial_errors=[],
        )

    market.get_pair.side_effect = get_pair_mock

    registry = ProviderRegistry(Settings())
    registry.discovery = discovery
    registry.market = market
    registry.social = AsyncMock()
    registry.risk = AsyncMock()
    return registry


@pytest.mark.asyncio
async def test_ingestion_load_performance(
    db_session: AsyncSession, mock_load_providers, test_settings: Settings
):
    test_settings.demo_mode = False

    tracemalloc.start()
    start_time = time.monotonic()

    # Run ingestion for 100 tokens
    summary = await run_ingestion_cycle(db_session, test_settings, mock_load_providers, limit=100)

    end_time = time.monotonic()
    current_mem, peak_mem = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    duration = end_time - start_time

    print("\n[Load Test] Ingestion of 100 tokens:")
    print(f"Time taken: {duration:.2f} seconds")
    print(f"Peak memory: {peak_mem / 1024 / 1024:.2f} MB")

    assert summary.persisted == 100
    # Let's say we expect 100 tokens to process under 5 seconds (just an arbitrary baseline for testing)
    assert duration < 10.0, f"Ingestion is too slow: {duration:.2f} seconds"
