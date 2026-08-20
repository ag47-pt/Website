from __future__ import annotations

import asyncio
import json
from datetime import UTC, datetime, timedelta
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

import ag47_radar.db as db
import ag47_radar.worker as worker_module
from ag47_radar.cli import _worker_ingest, main
from ag47_radar.config import Settings
from ag47_radar.errors import SecurityConfigurationError
from ag47_radar.main import create_app
from ag47_radar.models import (
    JobRun,
    MarketSnapshot,
    OpportunityScore,
    ScoringWeights,
    Token,
    TradingPair,
)
from ag47_radar.services.backtest import BacktestReport
from ag47_radar.services.ingestion import (
    ConfirmedAlert,
    IngestionSummary,
    NotificationBatchResult,
    PreparedIngestion,
    _dispatch_confirmed_alerts,
)
from ag47_radar.services.outbox import NotificationDispatchResult
from ag47_radar.worker import (
    NOTIFICATION_BACKLOG_BATCH_SIZE,
    WorkerResult,
    _drain_pending_ingestion_backlog,
    resolve_run_key,
    run_calibration_job,
    run_ingestion_job,
    worker_monitoring_is_active,
)


@pytest.fixture
def live_settings(test_settings: Settings) -> Settings:
    return test_settings.model_copy(
        update={
            "demo_mode": False,
            "ingestion_mode": "external",
            "ingestion_stale_after_seconds": 900,
        }
    )


@pytest.mark.asyncio
async def test_same_run_key_is_persistently_idempotent(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_session,
) -> None:
    prepare = AsyncMock(
        return_value=PreparedIngestion(
            summary=IngestionSummary(discovered=4, persisted=3),
            confirmed_alerts=[],
        )
    )
    monkeypatch.setattr("ag47_radar.worker.prepare_ingestion_cycle", prepare)

    first = await run_ingestion_job(live_settings, object(), limit=10, run_key="execution-1")
    second = await run_ingestion_job(live_settings, object(), limit=10, run_key="execution-1")

    assert first.status == "succeeded"
    assert second.status == "skipped"
    assert second.reason == "duplicate"
    prepare.assert_awaited_once()
    run = await db_session.scalar(select(JobRun).where(JobRun.run_key == "execution-1"))
    assert run is not None
    assert run.status == "succeeded"
    assert run.attempts == 1


@pytest.mark.asyncio
async def test_concurrent_execution_is_skipped_while_singleton_lock_is_held(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_engine,
) -> None:
    started = asyncio.Event()
    release = asyncio.Event()

    async def prepare(*args: object, **kwargs: object) -> PreparedIngestion:
        started.set()
        await release.wait()
        return PreparedIngestion(
            summary=IngestionSummary(discovered=1, persisted=1),
            confirmed_alerts=[],
        )

    monkeypatch.setattr("ag47_radar.worker.prepare_ingestion_cycle", prepare)
    first_task = asyncio.create_task(
        run_ingestion_job(live_settings, object(), limit=10, run_key="execution-1")
    )
    await started.wait()

    overlapping = await run_ingestion_job(
        live_settings,
        object(),
        limit=10,
        run_key="execution-2",
    )
    release.set()
    first = await first_task

    assert first.status == "succeeded"
    assert overlapping.status == "skipped"
    assert overlapping.reason == "singleton_busy"


@pytest.mark.asyncio
async def test_failed_run_can_retry_with_same_key(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_session,
) -> None:
    prepare = AsyncMock(
        side_effect=[
            RuntimeError("provider failed"),
            PreparedIngestion(
                summary=IngestionSummary(discovered=2, persisted=2),
                confirmed_alerts=[],
            ),
        ]
    )
    monkeypatch.setattr("ag47_radar.worker.prepare_ingestion_cycle", prepare)

    with pytest.raises(RuntimeError, match="provider failed"):
        await run_ingestion_job(live_settings, object(), limit=10, run_key="execution-retry")
    retry = await run_ingestion_job(
        live_settings,
        object(),
        limit=10,
        run_key="execution-retry",
    )

    assert retry.status == "succeeded"
    run = await db_session.scalar(select(JobRun).where(JobRun.run_key == "execution-retry"))
    assert run is not None
    assert run.status == "succeeded"
    assert run.attempts == 2


@pytest.mark.asyncio
async def test_ingestion_effects_and_success_roll_back_together_before_retry(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_session,
) -> None:
    token = Token(
        chain="base",
        contract_address="0xatomic",
        symbol="ATOM",
        name="Atomic",
        source="test",
        is_demo=False,
    )
    db_session.add(token)
    await db_session.flush()
    pair = TradingPair(
        token_id=token.id,
        pair_address="0xatomic-pair",
        quote_token="USDC",
        dex="test-dex",
        source="test",
        is_demo=False,
    )
    db_session.add(pair)
    await db_session.commit()

    async def prepare(
        session: AsyncSession,
        settings: Settings,
        providers: object,
        *,
        limit: int,
    ) -> PreparedIngestion:
        session.add(
            MarketSnapshot(
                pair_id=pair.id,
                price_usd=1,
                source="test",
                data_quality="high",
                is_demo=False,
            )
        )
        session.add(
            OpportunityScore(
                token_id=token.id,
                momentum_score=5,
                liquidity_score=5,
                community_score=5,
                distribution_score=5,
                safety_score=5,
                data_quality_score=5,
                final_score=5,
                classification="monitorar",
                confidence=0.5,
                signals_available=2,
                explanation="atomicity test",
                positive_factors=[],
                negative_factors=[],
                critical_gate_applied=False,
                scoring_version="test",
                is_demo=False,
            )
        )
        return PreparedIngestion(
            summary=IngestionSummary(discovered=1, persisted=1),
            confirmed_alerts=[],
        )

    original_mark_succeeded = worker_module._mark_run_succeeded
    mark_attempts = 0

    async def fail_once_after_mark(*args: object, **kwargs: object) -> None:
        nonlocal mark_attempts
        await original_mark_succeeded(*args, **kwargs)
        mark_attempts += 1
        if mark_attempts == 1:
            raise RuntimeError("crash before atomic commit")

    monkeypatch.setattr("ag47_radar.worker.prepare_ingestion_cycle", prepare)
    monkeypatch.setattr("ag47_radar.worker._mark_run_succeeded", fail_once_after_mark)

    with pytest.raises(RuntimeError, match="crash before atomic commit"):
        await run_ingestion_job(live_settings, object(), limit=1, run_key="atomic-ingestion")

    async with db.get_session_factory()() as verify:
        assert await verify.scalar(select(func.count(MarketSnapshot.id))) == 0
        assert await verify.scalar(select(func.count(OpportunityScore.id))) == 0

    retry = await run_ingestion_job(
        live_settings,
        object(),
        limit=1,
        run_key="atomic-ingestion",
    )

    assert retry.status == "succeeded"
    async with db.get_session_factory()() as verify:
        assert await verify.scalar(select(func.count(MarketSnapshot.id))) == 1
        assert await verify.scalar(select(func.count(OpportunityScore.id))) == 1
        run = await verify.scalar(select(JobRun).where(JobRun.run_key == "atomic-ingestion"))
        assert run is not None
        assert run.status == "succeeded"
        assert run.attempts == 2


@pytest.mark.asyncio
async def test_ingestion_job_retries_only_the_failed_notification_channel(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_session,
) -> None:
    alert = ConfirmedAlert("alert-1", "TOKEN", "momentum", 0.8, 0.9)
    failed_telegram = ConfirmedAlert(
        "alert-1",
        "TOKEN",
        "momentum",
        0.8,
        0.9,
        pending_channels=("telegram",),
    )
    prepare = AsyncMock(
        return_value=PreparedIngestion(
            summary=IngestionSummary(discovered=2, persisted=2),
            confirmed_alerts=[alert],
        )
    )
    dispatch = AsyncMock(
        side_effect=[
            NotificationBatchResult(
                partial_failures=1,
                pending_alerts=[failed_telegram],
            ),
            NotificationBatchResult(),
        ]
    )
    monkeypatch.setattr("ag47_radar.worker.prepare_ingestion_cycle", prepare)
    monkeypatch.setattr("ag47_radar.worker._dispatch_confirmed_alerts", dispatch)

    result = await run_ingestion_job(
        live_settings,
        object(),
        limit=10,
        run_key="execution-notification-failure",
    )

    assert result.status == "succeeded"
    assert result.persisted == 2
    assert result.partial_failures == 1
    run = await db_session.scalar(
        select(JobRun).where(JobRun.run_key == "execution-notification-failure")
    )
    assert run is not None
    assert run.status == "succeeded"
    assert run.summary_json == {
        "discovered": 2,
        "persisted": 2,
        "partial_failures": 1,
        "pending_confirmed_alerts": [
            {
                "alert_id": "alert-1",
                "symbol": "TOKEN",
                "signal_type": "momentum",
                "severity": 0.8,
                "confidence": 0.9,
                "pending_channels": ["telegram"],
            }
        ],
    }

    retry = await run_ingestion_job(
        live_settings,
        object(),
        limit=10,
        run_key="execution-notification-failure",
    )

    assert retry.status == "skipped"
    assert dispatch.await_count == 2
    assert dispatch.await_args_list[1].args[1] == [failed_telegram]
    await db_session.refresh(run)
    assert run.summary_json == {
        "discovered": 2,
        "persisted": 2,
        "partial_failures": 1,
    }


@pytest.mark.asyncio
async def test_retry_drains_notifications_after_post_commit_cancellation(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_engine,
) -> None:
    alert = ConfirmedAlert("alert-1", "TOKEN", "momentum", 0.8, 0.9)
    prepare = AsyncMock(
        return_value=PreparedIngestion(
            summary=IngestionSummary(discovered=1, persisted=1),
            confirmed_alerts=[alert],
        )
    )
    dispatch = AsyncMock(side_effect=[asyncio.CancelledError(), NotificationBatchResult()])
    monkeypatch.setattr("ag47_radar.worker.prepare_ingestion_cycle", prepare)
    monkeypatch.setattr("ag47_radar.worker._dispatch_confirmed_alerts", dispatch)

    with pytest.raises(asyncio.CancelledError):
        await run_ingestion_job(
            live_settings,
            object(),
            limit=1,
            run_key="post-commit-cancel",
        )

    async with db.get_session_factory()() as verify:
        committed = await verify.scalar(
            select(JobRun).where(JobRun.run_key == "post-commit-cancel")
        )
        assert committed is not None
        assert committed.status == "succeeded"
        assert committed.attempts == 1
        assert committed.summary_json is not None
        assert committed.summary_json["pending_confirmed_alerts"] == [
            {
                "alert_id": "alert-1",
                "symbol": "TOKEN",
                "signal_type": "momentum",
                "severity": 0.8,
                "confidence": 0.9,
                "pending_channels": ["telegram", "webhook_custom"],
            }
        ]

    retry = await run_ingestion_job(
        live_settings,
        object(),
        limit=1,
        run_key="post-commit-cancel",
    )

    assert retry.status == "skipped"
    assert retry.reason == "duplicate"
    prepare.assert_awaited_once()
    assert dispatch.await_count == 2
    async with db.get_session_factory()() as verify:
        completed = await verify.scalar(
            select(JobRun).where(JobRun.run_key == "post-commit-cancel")
        )
        assert completed is not None
        assert completed.status == "succeeded"
        assert completed.attempts == 1
        assert completed.summary_json == {
            "discovered": 1,
            "persisted": 1,
            "partial_failures": 0,
        }


@pytest.mark.asyncio
async def test_new_run_key_drains_previous_notification_backlog_without_reingestion(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_session,
) -> None:
    old_alert = ConfirmedAlert(
        "old-alert",
        "OLD",
        "momentum",
        0.8,
        0.9,
        pending_channels=("telegram",),
    )
    db_session.add(
        JobRun(
            job_name="market-ingestion",
            run_key="old-execution",
            status="succeeded",
            attempts=1,
            completed_at=datetime.now(UTC) - timedelta(minutes=10),
            notification_pending=True,
            notification_next_attempt_at=datetime.now(UTC) - timedelta(minutes=1),
            summary_json={
                "discovered": 1,
                "persisted": 1,
                "partial_failures": 1,
                "pending_confirmed_alerts": [
                    {
                        "alert_id": old_alert.alert_id,
                        "symbol": old_alert.symbol,
                        "signal_type": old_alert.signal_type,
                        "severity": old_alert.severity,
                        "confidence": old_alert.confidence,
                        "pending_channels": ["telegram"],
                    }
                ],
            },
        )
    )
    await db_session.commit()
    prepare = AsyncMock(
        return_value=PreparedIngestion(
            summary=IngestionSummary(discovered=2, persisted=2),
            confirmed_alerts=[],
        )
    )
    dispatch = AsyncMock(side_effect=[NotificationBatchResult(), NotificationBatchResult()])
    monkeypatch.setattr("ag47_radar.worker.prepare_ingestion_cycle", prepare)
    monkeypatch.setattr("ag47_radar.worker._dispatch_confirmed_alerts", dispatch)

    result = await run_ingestion_job(
        live_settings,
        object(),
        limit=10,
        run_key="new-execution",
    )

    assert result.status == "succeeded"
    prepare.assert_awaited_once()
    assert dispatch.await_args_list[0].args[1] == [old_alert]
    async with db.get_session_factory()() as verify:
        old_run = await verify.scalar(select(JobRun).where(JobRun.run_key == "old-execution"))
        new_run = await verify.scalar(select(JobRun).where(JobRun.run_key == "new-execution"))
        assert old_run is not None
        assert old_run.attempts == 1
        assert old_run.summary_json == {
            "discovered": 1,
            "persisted": 1,
            "partial_failures": 1,
        }
        assert new_run is not None
        assert new_run.status == "succeeded"
        assert new_run.attempts == 1


@pytest.mark.asyncio
async def test_notification_backlog_drain_is_due_and_batch_limited(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_session: AsyncSession,
) -> None:
    now = datetime.now(UTC)
    due_keys = [f"due-backlog-{index}" for index in range(NOTIFICATION_BACKLOG_BATCH_SIZE + 2)]
    for index, run_key in enumerate(due_keys):
        db_session.add(
            JobRun(
                job_name="market-ingestion",
                run_key=run_key,
                status="succeeded",
                attempts=1,
                completed_at=now - timedelta(minutes=len(due_keys) - index),
                notification_pending=True,
                notification_next_attempt_at=now - timedelta(seconds=1),
                summary_json={"pending_confirmed_alerts": []},
            )
        )
    db_session.add(
        JobRun(
            job_name="market-ingestion",
            run_key="future-backlog",
            status="succeeded",
            attempts=1,
            completed_at=now - timedelta(days=1),
            notification_pending=True,
            notification_next_attempt_at=now + timedelta(hours=1),
            summary_json={"pending_confirmed_alerts": []},
        )
    )
    await db_session.commit()
    resume = AsyncMock(return_value=True)
    monkeypatch.setattr(
        "ag47_radar.worker._resume_pending_ingestion_notifications",
        resume,
    )

    drained = await _drain_pending_ingestion_backlog(live_settings)

    assert drained == NOTIFICATION_BACKLOG_BATCH_SIZE
    attempted_keys = [call.args[1] for call in resume.await_args_list]
    assert attempted_keys == due_keys[:NOTIFICATION_BACKLOG_BATCH_SIZE]
    assert "future-backlog" not in attempted_keys


@pytest.mark.asyncio
async def test_confirmed_alert_dispatches_are_awaited_and_isolate_failures(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_engine,
) -> None:
    release_telegram = asyncio.Event()
    telegram_finished = asyncio.Event()

    async def dispatch_telegram(*args: object, **kwargs: object) -> NotificationDispatchResult:
        await release_telegram.wait()
        telegram_finished.set()
        return NotificationDispatchResult(channel="telegram", status="success")

    async def dispatch_webhook(*args: object, **kwargs: object) -> NotificationDispatchResult:
        raise RuntimeError("notification failed")

    monkeypatch.setattr(
        "ag47_radar.services.alerts.dispatch_telegram_alert_bg",
        dispatch_telegram,
    )
    monkeypatch.setattr(
        "ag47_radar.services.webhooks.dispatch_webhook_alert_bg",
        dispatch_webhook,
    )

    dispatch = asyncio.create_task(
        _dispatch_confirmed_alerts(
            live_settings,
            [ConfirmedAlert("alert-1", "TOKEN", "momentum", 0.8, 0.9)],
        )
    )
    await asyncio.sleep(0)

    assert not dispatch.done()
    release_telegram.set()
    result = await dispatch
    assert result.partial_failures == 1
    assert result.pending_alerts == [
        ConfirmedAlert(
            "alert-1",
            "TOKEN",
            "momentum",
            0.8,
            0.9,
            pending_channels=("webhook_custom",),
        )
    ]
    assert telegram_finished.is_set()


@pytest.mark.asyncio
async def test_calibration_worker_is_idempotent(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_session,
) -> None:
    report = BacktestReport(
        version="test",
        horizon_hours=24,
        tolerance_hours=6,
        total_scores=120,
        evaluated=120,
        score_return_correlation=0.41,
        calibrated_weights={"momentum_score": 0.6, "liquidity_score": 0.4},
    )
    run_backtest = AsyncMock(return_value=report)
    monkeypatch.setattr("ag47_radar.services.backtest.run_backtest", run_backtest)

    first = await run_calibration_job(live_settings, run_key="calibration-1")
    second = await run_calibration_job(live_settings, run_key="calibration-1")

    assert first.status == "succeeded"
    assert first.evaluated == 120
    assert second.status == "skipped"
    assert second.reason == "duplicate"
    run_backtest.assert_awaited_once()
    run = await db_session.scalar(
        select(JobRun).where(
            JobRun.job_name == "scoring-calibration",
            JobRun.run_key == "calibration-1",
        )
    )
    assert run is not None
    assert run.status == "succeeded"
    weights_count = await db_session.scalar(select(func.count(ScoringWeights.id)))
    assert weights_count == 1


@pytest.mark.asyncio
async def test_calibration_weights_and_success_roll_back_together_before_retry(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    db_engine,
) -> None:
    report = BacktestReport(
        version="test",
        horizon_hours=24,
        tolerance_hours=6,
        total_scores=120,
        evaluated=120,
        score_return_correlation=0.41,
        calibrated_weights={"momentum_score": 0.6, "liquidity_score": 0.4},
    )
    monkeypatch.setattr(
        "ag47_radar.services.backtest.run_backtest",
        AsyncMock(return_value=report),
    )
    original_mark_succeeded = worker_module._mark_run_succeeded
    mark_attempts = 0

    async def fail_once_after_mark(*args: object, **kwargs: object) -> None:
        nonlocal mark_attempts
        await original_mark_succeeded(*args, **kwargs)
        mark_attempts += 1
        if mark_attempts == 1:
            raise RuntimeError("crash before atomic commit")

    monkeypatch.setattr("ag47_radar.worker._mark_run_succeeded", fail_once_after_mark)

    with pytest.raises(RuntimeError, match="crash before atomic commit"):
        await run_calibration_job(live_settings, run_key="atomic-calibration")

    async with db.get_session_factory()() as verify:
        assert await verify.scalar(select(func.count(ScoringWeights.id))) == 0

    retry = await run_calibration_job(live_settings, run_key="atomic-calibration")

    assert retry.status == "succeeded"
    async with db.get_session_factory()() as verify:
        assert await verify.scalar(select(func.count(ScoringWeights.id))) == 1
        run = await verify.scalar(
            select(JobRun).where(
                JobRun.job_name == "scoring-calibration",
                JobRun.run_key == "atomic-calibration",
            )
        )
        assert run is not None
        assert run.status == "succeeded"
        assert run.attempts == 2


@pytest.mark.asyncio
async def test_production_worker_fails_closed_without_postgresql(live_settings: Settings) -> None:
    settings = live_settings.model_copy(update={"environment": "production"})

    with pytest.raises(SecurityConfigurationError, match="PostgreSQL"):
        await run_ingestion_job(settings, object(), limit=10, run_key="execution-prod")


def test_cloud_run_worker_requires_exactly_one_task(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("CLOUD_RUN_EXECUTION", "radar-ingest-abc")
    monkeypatch.setenv("CLOUD_RUN_TASK_COUNT", "2")

    with pytest.raises(SecurityConfigurationError, match="exactly one task"):
        resolve_run_key(None)


def test_cloud_run_execution_is_the_default_idempotency_key(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("CLOUD_RUN_EXECUTION", "radar-ingest-abc")
    monkeypatch.setenv("CLOUD_RUN_TASK_COUNT", "1")

    assert resolve_run_key(None) == "cloud-run:radar-ingest-abc"


def test_monitoring_requires_external_mode_and_fresh_success(live_settings: Settings) -> None:
    now = datetime(2026, 8, 20, 12, 0, tzinfo=UTC)

    assert worker_monitoring_is_active(live_settings, now - timedelta(minutes=5), now=now)
    assert not worker_monitoring_is_active(live_settings, now - timedelta(minutes=20), now=now)
    assert not worker_monitoring_is_active(
        live_settings.model_copy(update={"ingestion_mode": "manual"}),
        now - timedelta(minutes=5),
        now=now,
    )
    assert not worker_monitoring_is_active(live_settings, None, now=now)


@pytest.mark.asyncio
async def test_system_status_requires_a_fresh_external_worker_run() -> None:
    settings = Settings(
        environment="test",
        database_url=(
            f"sqlite+aiosqlite:///file:worker-status-{uuid4()}?mode=memory&cache=shared&uri=true"
        ),
        demo_mode=False,
        auto_create_schema=True,
        auto_seed_demo=False,
        ingestion_mode="external",
        ingestion_stale_after_seconds=900,
    )
    app = create_app(settings)

    async with app.router.lifespan_context(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            before = await client.get("/api/v1/system/status")
            assert before.status_code == 200
            assert before.json()["monitoring_active"] is False

            async with db.get_session_factory()() as session:
                session.add(
                    JobRun(
                        job_name="market-ingestion",
                        run_key="status-run",
                        status="succeeded",
                        attempts=1,
                        completed_at=datetime.now(UTC),
                    )
                )
                await session.commit()

            after = await client.get("/api/v1/system/status")
            assert after.status_code == 200
            assert after.json()["monitoring_active"] is True


@pytest.mark.asyncio
async def test_worker_cli_serializes_result_and_closes_resources(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
    capsys: pytest.CaptureFixture[str],
) -> None:
    providers = type("Providers", (), {})()
    close_providers = AsyncMock()
    providers.close = close_providers
    close_database = AsyncMock()
    run_job = AsyncMock(
        return_value=WorkerResult(
            status="succeeded",
            run_key="cli-run",
            discovered=3,
            persisted=2,
            partial_failures=1,
        )
    )
    monkeypatch.setattr("ag47_radar.cli.get_settings", lambda: live_settings)
    monkeypatch.setattr("ag47_radar.cli.ProviderRegistry", lambda settings: providers)
    monkeypatch.setattr("ag47_radar.cli.run_ingestion_job", run_job)
    monkeypatch.setattr("ag47_radar.cli.close_database", close_database)

    await _worker_ingest(10, "cli-run")

    output = json.loads(capsys.readouterr().out.strip().splitlines()[-1])
    assert output == {
        "discovered": 3,
        "partial_failures": 1,
        "persisted": 2,
        "reason": None,
        "run_key": "cli-run",
        "status": "succeeded",
    }
    close_providers.assert_awaited_once()
    close_database.assert_awaited_once()


@pytest.mark.asyncio
async def test_worker_cli_closes_resources_when_job_fails(
    monkeypatch: pytest.MonkeyPatch,
    live_settings: Settings,
) -> None:
    providers = type("Providers", (), {})()
    close_providers = AsyncMock()
    providers.close = close_providers
    close_database = AsyncMock()
    monkeypatch.setattr("ag47_radar.cli.get_settings", lambda: live_settings)
    monkeypatch.setattr("ag47_radar.cli.ProviderRegistry", lambda settings: providers)
    monkeypatch.setattr(
        "ag47_radar.cli.run_ingestion_job",
        AsyncMock(side_effect=RuntimeError("worker failed")),
    )
    monkeypatch.setattr("ag47_radar.cli.close_database", close_database)

    with pytest.raises(RuntimeError, match="worker failed"):
        await _worker_ingest(10, "cli-failure")

    close_providers.assert_awaited_once()
    close_database.assert_awaited_once()


def test_worker_cli_returns_nonzero_without_exposing_error_message(
    monkeypatch: pytest.MonkeyPatch,
    capsys: pytest.CaptureFixture[str],
) -> None:
    async def fail_worker(limit: int, run_key: str | None) -> None:
        raise RuntimeError("sensitive provider detail")

    monkeypatch.setattr("ag47_radar.cli._worker_ingest", fail_worker)

    exit_code = main(["worker", "ingest", "--run-key", "cli-failure"])

    assert exit_code == 1
    assert json.loads(capsys.readouterr().err) == {
        "status": "failed",
        "error_type": "RuntimeError",
    }
