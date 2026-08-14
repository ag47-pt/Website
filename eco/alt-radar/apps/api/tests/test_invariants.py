import asyncio
from datetime import UTC, datetime
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, DataQuality, SourceMode
from ag47_radar.models import Base, TokenEvent, TokenSignal
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
def mock_providers():
    discovery = AsyncMock(spec=PairDiscoveryProvider)
    discovery.provider_id = "test_discovery"
    discovery.discover.return_value = ProviderResult(
        data=[
            DiscoveredPair(
                chain=Chain.SOLANA,
                contract_address="token123",
                token_name="Test Token",
                token_symbol="TEST",
                pair_address="pair123",
                quote_token="SOL",
                dex="raydium",
                decimals=9,
            )
        ],
        source="test",
        collected_at=datetime.now(UTC),
        quality=DataQuality.HIGH,
        mode=SourceMode.REAL,
        duration_ms=10.0,
        partial_errors=[],
    )

    market = AsyncMock(spec=MarketDataProvider)
    market.provider_id = "test_market"
    market.get_pair.return_value = ProviderResult(
        data=MarketPairData(
            chain=Chain.SOLANA,
            contract_address="token123",
            pair_address="pair123",
            token_symbol="TEST",
            token_name="Test Token",
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

    registry = ProviderRegistry(Settings())
    registry.discovery = discovery
    registry.market = market
    registry.social = AsyncMock()
    registry.risk = AsyncMock()
    return registry


@pytest.mark.asyncio
async def test_idempotency_sequential(
    db_session: AsyncSession, mock_providers, test_settings: Settings
):
    test_settings.demo_mode = False

    # Run first time
    summary1 = await run_ingestion_cycle(db_session, test_settings, mock_providers, limit=1)
    assert summary1.persisted == 1

    events_count1 = len((await db_session.scalars(select(TokenEvent))).all())
    signals_count1 = len((await db_session.scalars(select(TokenSignal))).all())

    # To generate an event on the first run, the previous snapshot must exist or it might just create a baseline event.
    # In this case, delta calculation might not generate events on the very first snapshot (or it might).
    # We alter the mocked provider's output significantly to force a new event in a subsequent run,
    # OR we just rely on idempotency of the exact same data to not generate anything.

    # Run second time with exact same data
    summary2 = await run_ingestion_cycle(db_session, test_settings, mock_providers, limit=1)
    assert summary2.persisted == 1

    events_count2 = len((await db_session.scalars(select(TokenEvent))).all())
    signals_count2 = len((await db_session.scalars(select(TokenSignal))).all())

    assert events_count1 == events_count2
    assert signals_count1 == signals_count2


@pytest.mark.asyncio
async def test_concurrency_race_condition(mock_providers, test_settings: Settings):
    test_settings.demo_mode = False

    # Create an in-memory SQLite engine isolated for this test
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    # We will simulate a situation where the exact same token gets delta events simultaneously.
    # First we establish a baseline snapshot so the next ingestion will trigger a delta event.
    async with async_session() as session:
        await run_ingestion_cycle(session, test_settings, mock_providers, limit=1)

    # Now alter the market provider to have a huge volume spike to trigger an event
    mock_providers.market.get_pair.return_value.data.volume_1h = 99999999.0

    # Run two ingestions concurrently using two DIFFERENT sessions
    async def run_worker():
        async with async_session() as session:
            try:
                await run_ingestion_cycle(session, test_settings, mock_providers, limit=1)
                return "success"
            except IntegrityError:
                return "integrity_error"
            except Exception as e:
                return str(e)

    results = await asyncio.gather(run_worker(), run_worker())

    # Because of SQLite, concurrent writes might throw database is locked or IntegrityError.
    # SQLite doesn't handle concurrency well, but the point is we should not get duplicate records.
    async with async_session() as session:
        events = (await session.scalars(select(TokenEvent))).all()
        # Ensure we only got one event of the particular type, no duplicates
        hashes = [e.caused_by_hash for e in events]
        assert len(hashes) == len(set(hashes)), "Duplicate caused_by_hash detected!"

    await engine.dispose()
