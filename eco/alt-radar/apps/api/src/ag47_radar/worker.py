from __future__ import annotations

import asyncio
import hashlib
import os
import re
import threading
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Literal
from uuid import uuid4

from sqlalchemy import or_, select, text
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.exc import StaleDataError

import ag47_radar.db as db
from ag47_radar.config import Settings
from ag47_radar.errors import ProviderModeError, SecurityConfigurationError
from ag47_radar.logging import get_logger
from ag47_radar.models import JobRun
from ag47_radar.providers.registry import ProviderRegistry
from ag47_radar.services.ingestion import (
    ConfirmedAlert,
    IngestionSummary,
    PreparedIngestion,
    _dispatch_confirmed_alerts,
    prepare_ingestion_cycle,
)
from ag47_radar.services.outbox import NotificationChannel

INGESTION_JOB_NAME = "market-ingestion"
CALIBRATION_JOB_NAME = "scoring-calibration"
_RUN_KEY_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:/-]{0,159}$")
_PENDING_CONFIRMED_ALERTS_KEY = "pending_confirmed_alerts"
NOTIFICATION_BACKLOG_BATCH_SIZE = 25
_LOCAL_ACTIVE_JOBS: set[str] = set()
_LOCAL_ACTIVE_JOBS_GUARD = threading.Lock()

log = get_logger(component="durable-worker")


@dataclass(frozen=True, slots=True)
class WorkerResult:
    status: Literal["succeeded", "skipped"]
    run_key: str
    reason: Literal["duplicate", "singleton_busy"] | None = None
    discovered: int | None = None
    persisted: int | None = None
    partial_failures: int | None = None


@dataclass(frozen=True, slots=True)
class CalibrationSummary:
    evaluated: int
    weights_persisted: bool
    correlation: float | None


@dataclass(frozen=True, slots=True)
class CalibrationWorkerResult:
    status: Literal["succeeded", "skipped"]
    run_key: str
    reason: Literal["duplicate", "singleton_busy"] | None = None
    evaluated: int | None = None
    weights_persisted: bool | None = None
    correlation: float | None = None


def resolve_run_key(explicit_run_key: str | None) -> str:
    """Return a retry-stable idempotency key for a one-shot worker execution."""

    cloud_task_count = os.getenv("CLOUD_RUN_TASK_COUNT")
    if cloud_task_count is not None and cloud_task_count != "1":
        raise SecurityConfigurationError(
            "The ingestion worker requires exactly one task per Cloud Run Job execution"
        )
    cloud_task_index = os.getenv("CLOUD_RUN_TASK_INDEX")
    if cloud_task_index is not None and cloud_task_index != "0":
        raise SecurityConfigurationError("The ingestion worker only permits task index zero")

    raw_key = explicit_run_key
    if raw_key is None:
        cloud_execution = os.getenv("CLOUD_RUN_EXECUTION")
        raw_key = f"cloud-run:{cloud_execution}" if cloud_execution else f"manual:{uuid4()}"
    normalized = raw_key.strip()
    if not _RUN_KEY_PATTERN.fullmatch(normalized):
        raise ValueError(
            "Run key must contain 1-160 letters, numbers, dots, underscores, colons, or dashes"
        )
    return normalized


def _advisory_lock_id(job_name: str) -> int:
    digest = hashlib.blake2b(job_name.encode("utf-8"), digest_size=8).digest()
    return int.from_bytes(digest, byteorder="big", signed=True)


@asynccontextmanager
async def _singleton_job_lock(job_name: str) -> AsyncIterator[bool]:
    dialect = db.engine.dialect.name
    if dialect == "postgresql":
        lock_id = _advisory_lock_id(job_name)
        async with db.engine.connect() as connection:
            acquired = bool(
                await connection.scalar(
                    text("SELECT pg_try_advisory_lock(:lock_id)"),
                    {"lock_id": lock_id},
                )
            )
            try:
                yield acquired
            finally:
                if acquired:
                    await connection.execute(
                        text("SELECT pg_advisory_unlock(:lock_id)"),
                        {"lock_id": lock_id},
                    )
        return

    if dialect != "sqlite":
        raise SecurityConfigurationError(
            f"No singleton worker lock is implemented for database dialect {dialect}"
        )

    with _LOCAL_ACTIVE_JOBS_GUARD:
        acquired = job_name not in _LOCAL_ACTIVE_JOBS
        if acquired:
            _LOCAL_ACTIVE_JOBS.add(job_name)
    try:
        yield acquired
    finally:
        if acquired:
            with _LOCAL_ACTIVE_JOBS_GUARD:
                _LOCAL_ACTIVE_JOBS.discard(job_name)


async def _claim_run(job_name: str, run_key: str) -> bool:
    now = datetime.now(UTC)
    async with db.get_session_factory()() as session:
        run = await session.scalar(
            select(JobRun).where(
                JobRun.job_name == job_name,
                JobRun.run_key == run_key,
            )
        )
        if run is not None and run.status == "succeeded":
            return False
        if run is None:
            run = JobRun(
                job_name=job_name,
                run_key=run_key,
                status="running",
                attempts=1,
                started_at=now,
            )
            session.add(run)
        else:
            run.status = "running"
            run.attempts += 1
            run.started_at = now
            run.completed_at = None
            run.summary_json = None
            run.error_type = None
            run.notification_pending = False
            run.notification_next_attempt_at = None
        await session.commit()
        return True


async def _mark_run_succeeded(
    session: AsyncSession,
    job_name: str,
    run_key: str,
    summary: dict[str, object],
    *,
    notification_pending: bool = False,
    notification_next_attempt_at: datetime | None = None,
) -> None:
    run = await _get_run(session, job_name, run_key)
    run.status = "succeeded"
    run.completed_at = datetime.now(UTC)
    run.summary_json = summary
    run.error_type = None
    run.notification_pending = notification_pending
    run.notification_next_attempt_at = notification_next_attempt_at


async def _fail_run(job_name: str, run_key: str, exc: BaseException) -> bool:
    async with db.get_session_factory()() as session:
        run = await _get_run(session, job_name, run_key)
        if run.status == "succeeded":
            return False
        run.status = "failed"
        run.completed_at = datetime.now(UTC)
        run.error_type = type(exc).__name__
        await session.commit()
        return True


async def _get_run(session: AsyncSession, job_name: str, run_key: str) -> JobRun:
    run = await session.scalar(
        select(JobRun).where(
            JobRun.job_name == job_name,
            JobRun.run_key == run_key,
        )
    )
    if run is None:
        raise RuntimeError("Worker run record disappeared during execution")
    return run


def _ingestion_summary_json(
    summary: IngestionSummary,
    *,
    pending_alerts: list[ConfirmedAlert] | None = None,
) -> dict[str, object]:
    payload: dict[str, object] = {
        "discovered": summary.discovered,
        "persisted": summary.persisted,
        "partial_failures": summary.partial_failures,
    }
    if pending_alerts:
        payload[_PENDING_CONFIRMED_ALERTS_KEY] = [
            {
                "alert_id": alert.alert_id,
                "symbol": alert.symbol,
                "signal_type": alert.signal_type,
                "severity": alert.severity,
                "confidence": alert.confidence,
                "pending_channels": list(alert.pending_channels),
            }
            for alert in pending_alerts
        ]
    return payload


def _pending_confirmed_alerts(summary: dict[str, object] | None) -> list[ConfirmedAlert]:
    if summary is None:
        return []
    raw_alerts = summary.get(_PENDING_CONFIRMED_ALERTS_KEY)
    if not isinstance(raw_alerts, list):
        return []
    alerts: list[ConfirmedAlert] = []
    for raw_alert in raw_alerts:
        if not isinstance(raw_alert, dict):
            return []
        alert_id = raw_alert.get("alert_id")
        symbol = raw_alert.get("symbol")
        signal_type = raw_alert.get("signal_type")
        severity = raw_alert.get("severity")
        confidence = raw_alert.get("confidence")
        raw_channels = raw_alert.get(
            "pending_channels",
            ["telegram", "webhook_custom"],
        )
        if (
            not isinstance(alert_id, str)
            or not isinstance(symbol, str)
            or not isinstance(signal_type, str)
        ):
            return []
        if (
            isinstance(severity, bool)
            or not isinstance(severity, (int, float))
            or isinstance(confidence, bool)
            or not isinstance(confidence, (int, float))
        ):
            return []
        if not isinstance(raw_channels, list):
            return []
        pending_channels: list[NotificationChannel] = []
        for channel in raw_channels:
            if channel not in ("telegram", "webhook_custom"):
                return []
            if channel not in pending_channels:
                pending_channels.append(channel)
        if not pending_channels:
            continue
        alerts.append(
            ConfirmedAlert(
                alert_id=alert_id,
                symbol=symbol,
                signal_type=signal_type,
                severity=float(severity),
                confidence=float(confidence),
                pending_channels=tuple(pending_channels),
            )
        )
    return alerts


def _ingestion_summary_from_json(summary: dict[str, object] | None) -> IngestionSummary:
    def integer_value(key: str) -> int:
        if summary is None:
            return 0
        value = summary.get(key)
        return value if isinstance(value, int) and not isinstance(value, bool) else 0

    return IngestionSummary(
        discovered=integer_value("discovered"),
        persisted=integer_value("persisted"),
        partial_failures=integer_value("partial_failures"),
    )


def _calibration_summary_json(summary: CalibrationSummary) -> dict[str, object]:
    return {
        "evaluated": summary.evaluated,
        "weights_persisted": summary.weights_persisted,
        "correlation": summary.correlation,
    }


def _is_retryable_transaction_error(exc: BaseException) -> bool:
    if isinstance(exc, StaleDataError):
        return True
    if not isinstance(exc, DBAPIError):
        return False
    sqlstate = getattr(exc.orig, "sqlstate", None)
    if sqlstate in ("40001", "40P01", "23505"):
        return True
    message = str(exc).lower()
    return "locked" in message or "busy" in message or "unique constraint failed" in message


async def _run_atomic_worker_transaction[TransactionResult](
    operation: Callable[[AsyncSession], Awaitable[TransactionResult]],
    *,
    max_retries: int = 3,
    initial_backoff: float = 0.05,
) -> TransactionResult:
    """Commit domain effects and the succeeded JobRun in one database transaction."""

    for attempt in range(max_retries):
        async with db.engine.connect() as connection:
            transaction = await connection.begin()
            try:
                async with AsyncSession(
                    bind=connection,
                    expire_on_commit=False,
                    join_transaction_mode="rollback_only",
                ) as session:
                    result = await operation(session)
                    await session.flush()
                await transaction.commit()
                return result
            except BaseException as exc:
                if transaction.is_active:
                    await transaction.rollback()
                if _is_retryable_transaction_error(exc) and attempt < max_retries - 1:
                    await asyncio.sleep(initial_backoff * (2**attempt))
                    continue
                raise
    raise RuntimeError("Atomic worker transaction exhausted without a result")


async def _update_succeeded_summary(
    job_name: str,
    run_key: str,
    summary: dict[str, object],
    *,
    notification_pending: bool,
    notification_next_attempt_at: datetime | None,
) -> None:
    async with db.get_session_factory()() as session:
        run = await _get_run(session, job_name, run_key)
        if run.status != "succeeded":
            raise RuntimeError("Cannot update summary for an incomplete worker run")
        run.summary_json = summary
        run.notification_pending = notification_pending
        run.notification_next_attempt_at = notification_next_attempt_at
        await session.commit()


async def _resume_pending_ingestion_notifications(
    settings: Settings,
    run_key: str,
) -> bool:
    async with db.get_session_factory()() as session:
        run = await _get_run(session, INGESTION_JOB_NAME, run_key)
        pending_alerts = _pending_confirmed_alerts(run.summary_json)
        summary = _ingestion_summary_from_json(run.summary_json)
        run_summary = run.summary_json
        notification_pending = run.notification_pending
    if not pending_alerts:
        if notification_pending:
            await _update_succeeded_summary(
                INGESTION_JOB_NAME,
                run_key,
                run_summary or {},
                notification_pending=False,
                notification_next_attempt_at=None,
            )
        return False

    notification_result = await _dispatch_confirmed_alerts(settings, pending_alerts)
    summary.partial_failures += notification_result.partial_failures
    try:
        await _update_succeeded_summary(
            INGESTION_JOB_NAME,
            run_key,
            _ingestion_summary_json(
                summary,
                pending_alerts=notification_result.pending_alerts,
            ),
            notification_pending=bool(notification_result.pending_alerts),
            notification_next_attempt_at=notification_result.next_attempt_at,
        )
    except Exception as exc:
        log.warning(
            "ingestion_summary_refresh_failed",
            error_type=type(exc).__name__,
        )
    return True


async def _drain_pending_ingestion_backlog(settings: Settings) -> int:
    now = datetime.now(UTC)
    async with db.get_session_factory()() as session:
        pending_run_keys = list(
            (
                await session.scalars(
                    select(JobRun.run_key)
                    .where(
                        JobRun.job_name == INGESTION_JOB_NAME,
                        JobRun.status == "succeeded",
                        JobRun.notification_pending.is_(True),
                        or_(
                            JobRun.notification_next_attempt_at.is_(None),
                            JobRun.notification_next_attempt_at <= now,
                        ),
                    )
                    .order_by(
                        JobRun.notification_next_attempt_at.asc(),
                        JobRun.completed_at.asc(),
                    )
                    .limit(NOTIFICATION_BACKLOG_BATCH_SIZE)
                )
            ).all()
        )

    drained = 0
    for pending_run_key in pending_run_keys:
        if await _resume_pending_ingestion_notifications(settings, pending_run_key):
            drained += 1
    return drained


async def _execute_ingestion(
    settings: Settings,
    providers: ProviderRegistry,
    *,
    limit: int,
    run_key: str,
) -> IngestionSummary:
    async def operation(session: AsyncSession) -> PreparedIngestion:
        prepared = await prepare_ingestion_cycle(
            session,
            settings,
            providers,
            limit=limit,
        )
        await _mark_run_succeeded(
            session,
            INGESTION_JOB_NAME,
            run_key,
            _ingestion_summary_json(
                prepared.summary,
                pending_alerts=prepared.confirmed_alerts,
            ),
            notification_pending=bool(prepared.confirmed_alerts),
            notification_next_attempt_at=(datetime.now(UTC) if prepared.confirmed_alerts else None),
        )
        return prepared

    prepared = await _run_atomic_worker_transaction(operation)
    notification_result = await _dispatch_confirmed_alerts(
        settings,
        prepared.confirmed_alerts,
    )
    prepared.summary.partial_failures += notification_result.partial_failures
    if prepared.confirmed_alerts:
        try:
            await _update_succeeded_summary(
                INGESTION_JOB_NAME,
                run_key,
                _ingestion_summary_json(
                    prepared.summary,
                    pending_alerts=notification_result.pending_alerts,
                ),
                notification_pending=bool(notification_result.pending_alerts),
                notification_next_attempt_at=notification_result.next_attempt_at,
            )
        except Exception as exc:
            log.warning(
                "ingestion_summary_refresh_failed",
                error_type=type(exc).__name__,
            )
    return prepared.summary


async def _execute_calibration(settings: Settings, *, run_key: str) -> CalibrationSummary:
    from ag47_radar.models import ScoringWeights
    from ag47_radar.services.backtest import run_backtest

    async def operation(session: AsyncSession) -> CalibrationSummary:
        report = await run_backtest(session, include_demo=False)
        weights_persisted = report.calibrated_weights is not None
        if report.calibrated_weights is not None:
            session.add(
                ScoringWeights(
                    weights_json=report.calibrated_weights,
                    sample_count=report.evaluated,
                    correlation=report.score_return_correlation,
                )
            )
        summary = CalibrationSummary(
            evaluated=report.evaluated,
            weights_persisted=weights_persisted,
            correlation=report.score_return_correlation,
        )
        await _mark_run_succeeded(
            session,
            CALIBRATION_JOB_NAME,
            run_key,
            _calibration_summary_json(summary),
        )
        return summary

    return await _run_atomic_worker_transaction(operation)


def _validate_worker_environment(settings: Settings) -> None:
    if settings.demo_mode:
        raise ProviderModeError("Durable workers are disabled while demo mode is active")
    if settings.is_production and not settings.database_url.startswith("postgresql+asyncpg://"):
        raise SecurityConfigurationError("Production workers require PostgreSQL")


async def run_ingestion_job(
    settings: Settings,
    providers: ProviderRegistry,
    *,
    limit: int,
    run_key: str,
) -> WorkerResult:
    _validate_worker_environment(settings)

    normalized_run_key = resolve_run_key(run_key)
    async with _singleton_job_lock(INGESTION_JOB_NAME) as acquired:
        if not acquired:
            log.info("ingestion_job_skipped", reason="singleton_busy")
            return WorkerResult(
                status="skipped",
                run_key=normalized_run_key,
                reason="singleton_busy",
            )
        drained_backlog = await _drain_pending_ingestion_backlog(settings)
        if drained_backlog:
            log.info(
                "ingestion_notification_backlog_drained",
                runs=drained_backlog,
            )
        if not await _claim_run(INGESTION_JOB_NAME, normalized_run_key):
            log.info("ingestion_job_skipped", reason="duplicate", run_key=normalized_run_key)
            return WorkerResult(
                status="skipped",
                run_key=normalized_run_key,
                reason="duplicate",
            )

        try:
            summary = await _execute_ingestion(
                settings,
                providers,
                limit=limit,
                run_key=normalized_run_key,
            )
        except BaseException as exc:
            marked_failed = await _fail_run(INGESTION_JOB_NAME, normalized_run_key, exc)
            log.warning(
                "ingestion_job_failed"
                if marked_failed
                else "ingestion_job_interrupted_after_commit",
                error_type=type(exc).__name__,
            )
            raise

    log.info(
        "ingestion_job_completed",
        run_key=normalized_run_key,
        discovered=summary.discovered,
        persisted=summary.persisted,
        partial_failures=summary.partial_failures,
    )
    return WorkerResult(
        status="succeeded",
        run_key=normalized_run_key,
        discovered=summary.discovered,
        persisted=summary.persisted,
        partial_failures=summary.partial_failures,
    )


async def run_calibration_job(
    settings: Settings,
    *,
    run_key: str,
) -> CalibrationWorkerResult:
    _validate_worker_environment(settings)
    normalized_run_key = resolve_run_key(run_key)
    async with _singleton_job_lock(CALIBRATION_JOB_NAME) as acquired:
        if not acquired:
            log.info("calibration_job_skipped", reason="singleton_busy")
            return CalibrationWorkerResult(
                status="skipped",
                run_key=normalized_run_key,
                reason="singleton_busy",
            )
        if not await _claim_run(CALIBRATION_JOB_NAME, normalized_run_key):
            log.info("calibration_job_skipped", reason="duplicate", run_key=normalized_run_key)
            return CalibrationWorkerResult(
                status="skipped",
                run_key=normalized_run_key,
                reason="duplicate",
            )

        try:
            summary = await _execute_calibration(settings, run_key=normalized_run_key)
        except BaseException as exc:
            marked_failed = await _fail_run(CALIBRATION_JOB_NAME, normalized_run_key, exc)
            log.warning(
                "calibration_job_failed"
                if marked_failed
                else "calibration_job_interrupted_after_commit",
                error_type=type(exc).__name__,
            )
            raise

    log.info(
        "calibration_job_completed",
        run_key=normalized_run_key,
        evaluated=summary.evaluated,
        weights_persisted=summary.weights_persisted,
        correlation=summary.correlation,
    )
    return CalibrationWorkerResult(
        status="succeeded",
        run_key=normalized_run_key,
        evaluated=summary.evaluated,
        weights_persisted=summary.weights_persisted,
        correlation=summary.correlation,
    )


async def latest_successful_ingestion_at(session: AsyncSession) -> datetime | None:
    return await session.scalar(
        select(JobRun.completed_at)
        .where(
            JobRun.job_name == INGESTION_JOB_NAME,
            JobRun.status == "succeeded",
        )
        .order_by(JobRun.completed_at.desc())
        .limit(1)
    )


def worker_monitoring_is_active(
    settings: Settings,
    last_success_at: datetime | None,
    *,
    now: datetime | None = None,
) -> bool:
    if settings.demo_mode or settings.ingestion_mode != "external" or last_success_at is None:
        return False
    resolved_now = now or datetime.now(UTC)
    if last_success_at.tzinfo is None:
        last_success_at = last_success_at.replace(tzinfo=UTC)
    return last_success_at >= resolved_now - timedelta(
        seconds=settings.ingestion_stale_after_seconds
    )
