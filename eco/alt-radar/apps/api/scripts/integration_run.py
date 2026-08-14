import asyncio
import os
from datetime import timedelta
from decimal import Decimal

from sqlalchemy import select

from ag47_radar.config import get_settings
from ag47_radar.db import get_session_factory
from ag47_radar.models import (
    GlobalKnowledge,
    MarketSnapshot,
    TokenEvent,
    TokenHypothesis,
    TokenSignal,
    TokenTruth,
)
from ag47_radar.providers.registry import ProviderRegistry
from ag47_radar.services.ingestion import run_ingestion_cycle


async def run_integration():
    settings = get_settings()
    # Force real mode
    os.environ["AG47_DEMO_MODE"] = "false"
    settings.demo_mode = False
    settings.provider_cache_ttl_seconds = 0

    providers = ProviderRegistry(settings)

    async with get_session_factory()() as session:
        try:
            print("Running initial ingestion...")
            await run_ingestion_cycle(session, settings, providers, limit=3)

            # Ingestion 1 is at T-26h
            snapshots = (await session.execute(select(MarketSnapshot))).scalars().all()
            for snap in snapshots:
                snap.price_usd = (
                    Decimal(str(float(snap.price_usd) * 0.5)) if snap.price_usd else Decimal("1.0")
                )
                snap.volume_5m = Decimal(str(float(snap.volume_5m or 1000) / 10))
                snap.liquidity_usd = Decimal(str(float(snap.liquidity_usd or 1000) / 10))
                snap.captured_at = snap.captured_at - timedelta(hours=26)
            await session.commit()

            print("Running second ingestion...")
            providers2 = ProviderRegistry(settings)
            await run_ingestion_cycle(session, settings, providers2, limit=3)

            # Second ingestion creates snapshots at T.
            # But we want these to be at T-25h, so hypotheses are at T-25h
            snapshots2 = (await session.execute(select(MarketSnapshot))).scalars().all()
            for snap in snapshots2:
                if snap not in snapshots:  # Only modify new snapshots
                    snap.captured_at = snap.captured_at - timedelta(hours=25)

            events = (await session.execute(select(TokenEvent))).scalars().all()
            for ev in events:
                ev.created_at = ev.created_at - timedelta(hours=25)

            signals = (await session.execute(select(TokenSignal))).scalars().all()
            for sig in signals:
                sig.created_at = sig.created_at - timedelta(hours=25)

            hypotheses = (await session.execute(select(TokenHypothesis))).scalars().all()
            for hyp in hypotheses:
                hyp.created_at = hyp.created_at - timedelta(hours=25)

            await session.commit()
            print(f"Generated {len(signals)} signals and {len(hypotheses)} hypotheses.")

            print("Running third ingestion to trigger validation...")
            providers3 = ProviderRegistry(settings)
            await run_ingestion_cycle(session, settings, providers3, limit=3)

            truths = (await session.execute(select(TokenTruth))).scalars().all()
            gk = (await session.execute(select(GlobalKnowledge))).scalars().all()
            print(f"Generated {len(truths)} truths and {len(gk)} GlobalKnowledge entries.")

        finally:
            await providers.close()


if __name__ == "__main__":
    asyncio.run(run_integration())
