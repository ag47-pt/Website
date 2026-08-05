import datetime

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.config import Settings
from ag47_radar.enums import AlertSeverity, AlertType
from ag47_radar.models import Alert
from ag47_radar.services.alerts import AlertCommand, build_deduplication_key, create_alert_if_new


def test_build_deduplication_key_format():
    command = AlertCommand(
        token_id="123",
        type=AlertType.NEW_PAIR,
        severity=AlertSeverity.INFO,
        title="Test Alert",
        message="This is a test alert",
        deduplication_key="test_reason",
    )
    key = build_deduplication_key(command)
    assert "123" in key
    assert AlertType.NEW_PAIR.value in key
    assert "test_reason" in key


def test_build_deduplication_key_truncation():
    command = AlertCommand(
        token_id="123",
        type=AlertType.NEW_PAIR,
        severity=AlertSeverity.INFO,
        title="Test Alert",
        message="This is a test alert",
        deduplication_key="A" * 300,
    )
    key = build_deduplication_key(command)
    assert len(key) <= 200


@pytest.mark.asyncio
async def test_create_alert_new(db_session: AsyncSession, test_settings: Settings):
    command = AlertCommand(
        token_id="test_token",
        type=AlertType.NEW_PAIR,
        severity=AlertSeverity.INFO,
        title="Test Alert",
        message="This is a test alert",
    )

    alert, created = await create_alert_if_new(
        db_session,
        command,
        deduplication_window_minutes=test_settings.alert_deduplication_window_minutes,
    )
    assert created
    assert alert is not None
    assert alert.token_id == "test_token"
    assert alert.type == AlertType.NEW_PAIR.value


@pytest.mark.asyncio
async def test_duplicate_within_window_not_created(
    db_session: AsyncSession, test_settings: Settings
):
    command = AlertCommand(
        token_id="test_token_dup",
        type=AlertType.SCORE_THRESHOLD,
        severity=AlertSeverity.HIGH,
        title="Pump!",
        message="Price up 20%",
    )

    alert1, created1 = await create_alert_if_new(
        db_session,
        command,
        deduplication_window_minutes=test_settings.alert_deduplication_window_minutes,
    )
    assert created1

    # same data
    alert2, created2 = await create_alert_if_new(
        db_session,
        command,
        deduplication_window_minutes=test_settings.alert_deduplication_window_minutes,
    )
    assert not created2
    assert alert1.id == alert2.id


@pytest.mark.asyncio
async def test_alert_allowed_after_window(db_session: AsyncSession, test_settings: Settings):
    command = AlertCommand(
        token_id="test_token_window",
        type=AlertType.RISK_CHANGE,
        severity=AlertSeverity.CRITICAL,
        title="Risk!",
        message="Risk found",
    )

    alert1, created1 = await create_alert_if_new(
        db_session,
        command,
        deduplication_window_minutes=test_settings.alert_deduplication_window_minutes,
    )
    assert created1

    # modify created_at to simulate time passing
    alert1.created_at = datetime.datetime.now(datetime.UTC) - datetime.timedelta(minutes=test_settings.alert_deduplication_window_minutes + 1)
    db_session.add(alert1)
    await db_session.commit()

    alert2, created2 = await create_alert_if_new(
        db_session,
        command,
        deduplication_window_minutes=test_settings.alert_deduplication_window_minutes,
    )
    assert created2
    assert alert1.id != alert2.id
