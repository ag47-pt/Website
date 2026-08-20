from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock
from uuid import uuid4

import httpx
import pytest
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

import ag47_radar.db as db
from ag47_radar.config import Settings
from ag47_radar.enums import DataQuality, SourceMode
from ag47_radar.models import (
    AlertRule,
    NotificationDelivery,
    Token,
    TokenAlert,
    UserNotificationSettings,
)
from ag47_radar.providers.contracts import (
    DeliveryReceipt,
    ProviderError,
    ProviderResult,
)
from ag47_radar.providers.demo import LogOnlyAlertDeliveryProvider
from ag47_radar.services.alerts import dispatch_telegram_alert_bg
from ag47_radar.services.ingestion import ConfirmedAlert, _dispatch_confirmed_alerts
from ag47_radar.services.outbox import NotificationDispatchResult
from ag47_radar.services.webhooks import dispatch_webhook_alert_bg


async def _create_confirmed_alert(session: AsyncSession) -> str:
    suffix = uuid4().hex
    token = Token(
        chain="base",
        contract_address=f"0x{suffix}",
        symbol="TEST",
        name="Test Token",
        source="test",
        is_demo=False,
    )
    rule = AlertRule(
        name="Test Rule",
        source_kind="signal",
        source_type="momentum",
        rule_version="test-v1",
    )
    session.add_all([token, rule])
    await session.flush()
    alert = TokenAlert(
        rule_id=rule.id,
        token_id=token.id,
        source_kind="signal",
        source_id=suffix,
        severity=0.8,
        confidence=0.9,
        status="unread",
        confidence_level="confirmado",
        deduplication_key=suffix,
        is_demo=False,
    )
    session.add(alert)
    await session.commit()
    return alert.id


@pytest.mark.asyncio
async def test_telegram_without_credentials_is_explicitly_skipped(
    test_settings: Settings,
    db_engine,
) -> None:
    settings = test_settings.model_copy(
        update={
            "demo_mode": False,
            "telegram_bot_token": None,
            "telegram_chat_id": None,
        }
    )

    result = await dispatch_telegram_alert_bg(
        db.get_session_factory(),
        settings,
        "not-enqueued",
        "TEST",
        "momentum",
        0.8,
        0.9,
    )

    assert result.status == "skipped"
    assert result.reason == "not_configured"
    async with db.get_session_factory()() as session:
        delivery = await session.scalar(
            select(NotificationDelivery).where(NotificationDelivery.alert_id == "not-enqueued")
        )
        assert delivery is None


@pytest.mark.asyncio
async def test_log_only_provider_never_reports_external_delivery_success() -> None:
    result = await LogOnlyAlertDeliveryProvider().deliver(
        alert_id="alert-1",
        title="Test",
        message="Test",
        payload={},
    )

    assert result.data.accepted is False
    assert result.mode == SourceMode.DEMO
    assert result.partial_errors[0].code == "not_configured"


@pytest.mark.asyncio
async def test_telegram_provider_rejection_is_failed_and_retryable(
    monkeypatch: pytest.MonkeyPatch,
    test_settings: Settings,
    db_session: AsyncSession,
) -> None:
    alert_id = await _create_confirmed_alert(db_session)
    settings = test_settings.model_copy(
        update={
            "demo_mode": False,
            "telegram_bot_token": "test-token",
            "telegram_chat_id": "test-chat",
        }
    )
    provider = type("RejectedProvider", (), {})()
    provider.deliver = AsyncMock(
        return_value=ProviderResult(
            data=DeliveryReceipt(
                accepted=False,
                destination="telegram:test-chat",
            ),
            source="telegram.test",
            collected_at=datetime.now(UTC),
            quality=DataQuality.UNKNOWN,
            partial_errors=[ProviderError(code="rejected", message="rejected", retryable=True)],
            duration_ms=1,
            mode=SourceMode.REAL,
        )
    )
    closed = False

    class FakeRegistry:
        def __init__(self, _settings: Settings) -> None:
            self.alert_delivery = provider

        async def close(self) -> None:
            nonlocal closed
            closed = True

    monkeypatch.setattr("ag47_radar.providers.registry.ProviderRegistry", FakeRegistry)
    result = await dispatch_telegram_alert_bg(
        db.get_session_factory(),
        settings,
        alert_id,
        "TEST",
        "momentum",
        0.8,
        0.9,
    )

    assert result.status == "failed"
    assert result.reason == "rejected"
    assert provider.deliver.await_count == 1
    assert closed
    async with db.get_session_factory()() as session:
        delivery = await session.scalar(
            select(NotificationDelivery).where(
                NotificationDelivery.alert_id == alert_id,
                NotificationDelivery.channel == "telegram",
            )
        )
        assert delivery is not None
        assert delivery.status == "pending"
        assert delivery.attempts == 1
        assert delivery.next_attempt_at > datetime.now(UTC).replace(tzinfo=None)


@pytest.mark.asyncio
async def test_webhook_timeout_is_failed_and_retryable(
    monkeypatch: pytest.MonkeyPatch,
    test_settings: Settings,
    db_session: AsyncSession,
) -> None:
    alert_id = await _create_confirmed_alert(db_session)
    db_session.add(
        UserNotificationSettings(
            webhook_url="https://example.com/webhook",
            webhook_secret="test-secret",
        )
    )
    await db_session.commit()
    post = AsyncMock(side_effect=httpx.ReadTimeout("timeout"))

    class TimeoutClient:
        def __init__(self, *args: object, **kwargs: object) -> None:
            pass

        async def __aenter__(self) -> TimeoutClient:
            return self

        async def __aexit__(self, *args: object) -> None:
            pass

        async def post(self, *args: object, **kwargs: Any) -> httpx.Response:
            return await post(*args, **kwargs)

    monkeypatch.setattr(
        "ag47_radar.services.webhooks.validate_webhook_destination",
        AsyncMock(),
    )
    monkeypatch.setattr("ag47_radar.services.webhooks.httpx.AsyncClient", TimeoutClient)
    result = await dispatch_webhook_alert_bg(
        db.get_session_factory(),
        test_settings,
        alert_id,
        "TEST",
        "momentum",
        0.8,
        0.9,
    )

    assert result.status == "failed"
    assert result.reason == "timeout"
    assert post.await_count == 1
    async with db.get_session_factory()() as session:
        delivery = await session.scalar(
            select(NotificationDelivery).where(
                NotificationDelivery.alert_id == alert_id,
                NotificationDelivery.channel == "webhook_custom",
            )
        )
        assert delivery is not None
        assert delivery.status == "pending"
        assert delivery.attempts == 1


@pytest.mark.asyncio
async def test_permanent_webhook_failure_is_due_bounded_and_reuses_one_delivery(
    monkeypatch: pytest.MonkeyPatch,
    test_settings: Settings,
    db_session: AsyncSession,
) -> None:
    alert_id = await _create_confirmed_alert(db_session)
    db_session.add(
        UserNotificationSettings(
            webhook_url="https://invalid.example/webhook",
            webhook_secret="test-secret",
        )
    )
    await db_session.commit()
    validate = AsyncMock(side_effect=ValueError("destination permanently invalid"))
    monkeypatch.setattr(
        "ag47_radar.services.webhooks.validate_webhook_destination",
        validate,
    )

    first = await dispatch_webhook_alert_bg(
        db.get_session_factory(),
        test_settings,
        alert_id,
        "TEST",
        "momentum",
        0.8,
        0.9,
    )
    deferred = await dispatch_webhook_alert_bg(
        db.get_session_factory(),
        test_settings,
        alert_id,
        "TEST",
        "momentum",
        0.8,
        0.9,
    )

    assert first.status == "failed"
    assert deferred.status == "deferred"
    assert validate.await_count == 1

    for expected_attempt, expected_status in ((2, "failed"), (3, "dead")):
        async with db.get_session_factory()() as session:
            delivery = await session.scalar(
                select(NotificationDelivery).where(
                    NotificationDelivery.alert_id == alert_id,
                    NotificationDelivery.channel == "webhook_custom",
                )
            )
            assert delivery is not None
            delivery.next_attempt_at = datetime.now(UTC) - timedelta(seconds=1)
            await session.commit()

        result = await dispatch_webhook_alert_bg(
            db.get_session_factory(),
            test_settings,
            alert_id,
            "TEST",
            "momentum",
            0.8,
            0.9,
        )
        assert result.status == expected_status
        assert validate.await_count == expected_attempt

    terminal = await dispatch_webhook_alert_bg(
        db.get_session_factory(),
        test_settings,
        alert_id,
        "TEST",
        "momentum",
        0.8,
        0.9,
    )
    assert terminal.status == "dead"
    assert validate.await_count == 3
    async with db.get_session_factory()() as session:
        delivery_count = await session.scalar(
            select(func.count(NotificationDelivery.id)).where(
                NotificationDelivery.alert_id == alert_id,
                NotificationDelivery.channel == "webhook_custom",
            )
        )
        delivery = await session.scalar(
            select(NotificationDelivery).where(
                NotificationDelivery.alert_id == alert_id,
                NotificationDelivery.channel == "webhook_custom",
            )
        )
        assert delivery_count == 1
        assert delivery is not None
        assert delivery.status == "dead"
        assert delivery.attempts == 3


@pytest.mark.asyncio
async def test_dispatch_batch_skips_success_and_retains_only_failed_channel(
    monkeypatch: pytest.MonkeyPatch,
    test_settings: Settings,
    db_session: AsyncSession,
) -> None:
    alert_id = await _create_confirmed_alert(db_session)
    db_session.add(
        NotificationDelivery(
            alert_id=alert_id,
            channel="telegram",
            status="success",
        )
    )
    await db_session.commit()
    telegram = AsyncMock(
        return_value=NotificationDispatchResult(channel="telegram", status="success")
    )
    webhook = AsyncMock(
        return_value=NotificationDispatchResult(
            channel="webhook_custom",
            status="failed",
            reason="timeout",
        )
    )
    monkeypatch.setattr(
        "ag47_radar.services.alerts.dispatch_telegram_alert_bg",
        telegram,
    )
    monkeypatch.setattr(
        "ag47_radar.services.webhooks.dispatch_webhook_alert_bg",
        webhook,
    )
    alert = ConfirmedAlert(alert_id, "TEST", "momentum", 0.8, 0.9)

    result = await _dispatch_confirmed_alerts(test_settings, [alert])

    telegram.assert_not_awaited()
    webhook.assert_awaited_once()
    assert result.partial_failures == 1
    assert result.pending_alerts == [
        ConfirmedAlert(
            alert_id,
            "TEST",
            "momentum",
            0.8,
            0.9,
            pending_channels=("webhook_custom",),
        )
    ]


@pytest.mark.asyncio
async def test_dispatch_batch_removes_dead_channel_from_pending_queue(
    monkeypatch: pytest.MonkeyPatch,
    test_settings: Settings,
    db_engine,
) -> None:
    webhook = AsyncMock(
        return_value=NotificationDispatchResult(
            channel="webhook_custom",
            status="dead",
            reason="attempts_exhausted",
        )
    )
    monkeypatch.setattr(
        "ag47_radar.services.webhooks.dispatch_webhook_alert_bg",
        webhook,
    )

    result = await _dispatch_confirmed_alerts(
        test_settings,
        [
            ConfirmedAlert(
                "dead-alert",
                "TEST",
                "momentum",
                0.8,
                0.9,
                pending_channels=("webhook_custom",),
            )
        ],
    )

    webhook.assert_awaited_once()
    assert result.partial_failures == 1
    assert result.pending_alerts == []
    assert result.next_attempt_at is None
