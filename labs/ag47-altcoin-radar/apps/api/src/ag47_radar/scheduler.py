from __future__ import annotations

from typing import Any

from ag47_radar.config import Settings
from ag47_radar.db import get_session_factory, run_transaction_with_retry
from ag47_radar.logging import get_logger
from ag47_radar.providers.registry import ProviderRegistry
from ag47_radar.services.ingestion import run_ingestion_cycle

log = get_logger(component="scheduler")


async def _scheduled_ingestion(settings: Settings, providers: ProviderRegistry) -> None:
    try:
        summary = await run_transaction_with_retry(
            get_session_factory(),
            run_ingestion_cycle,
            settings,
            providers,
        )
        log.info(
            "ingestion_cycle_completed",
            discovered=summary.discovered,
            persisted=summary.persisted,
            partial_failures=summary.partial_failures,
        )
    except Exception as exc:
        log.warning("ingestion_cycle_failed", error_type=type(exc).__name__)


def start_scheduler(settings: Settings, providers: ProviderRegistry) -> Any | None:
    if not settings.scheduler_enabled:
        return None
    if settings.demo_mode:
        log.warning("scheduler_not_started", reason="demo_mode_prevents_real_ingestion")
        return None
    try:
        from apscheduler.schedulers.asyncio import AsyncIOScheduler  # type: ignore[import-untyped]
    except ImportError:
        log.warning("scheduler_not_started", reason="apscheduler_not_installed")
        return None
    scheduler = AsyncIOScheduler(timezone="UTC")
    scheduler.add_job(
        _scheduled_ingestion,
        trigger="interval",
        seconds=settings.scheduler_interval_seconds,
        args=[settings, providers],
        id="market-ingestion",
        coalesce=True,
        max_instances=1,
        replace_existing=True,
    )
    scheduler.start()
    log.info("scheduler_started", interval_seconds=settings.scheduler_interval_seconds)
    return scheduler


def stop_scheduler(scheduler: Any | None) -> None:
    if scheduler is not None and scheduler.running:
        scheduler.shutdown(wait=False)
