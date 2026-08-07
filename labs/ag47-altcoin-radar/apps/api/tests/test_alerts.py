import datetime

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.config import Settings
from ag47_radar.enums import AlertSeverity, AlertType
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
    alert1.created_at = datetime.datetime.now(datetime.UTC) - datetime.timedelta(
        minutes=test_settings.alert_deduplication_window_minutes + 1
    )
    db_session.add(alert1)
    await db_session.commit()

    alert2, created2 = await create_alert_if_new(
        db_session,
        command,
        deduplication_window_minutes=test_settings.alert_deduplication_window_minutes,
    )
    assert created2
    assert alert1.id != alert2.id


@pytest.mark.asyncio
async def test_process_alert_rules_confidence_levels(
    db_session: AsyncSession, test_settings: Settings
):
    from decimal import Decimal

    from ag47_radar.models import (
        AlertRule,
        GlobalKnowledge,
        OpportunityScore,
        Token,
        TokenHypothesis,
        TokenTruth,
    )
    from ag47_radar.services.alerts import process_alert_rules

    # 1. Create a dummy token and alert rule in the DB
    token = Token(
        id="test_token_edge_123",
        symbol="TKNEDGE",
        name="Token Edge",
        chain="ethereum",
        contract_address="0x123",
        source="test",
        created_at=datetime.datetime.now(datetime.UTC),
        is_demo=True,
    )
    db_session.add(token)
    await db_session.commit()

    rule = AlertRule(
        id="rule:volume_spike",
        name="Volume Spike Rule",
        source_kind="event",
        source_type="volume_spike",
        conditions={},
        cooldown_minutes=0,
        enabled=True,
        rule_version="rules-v1",
    )
    db_session.add(rule)
    await db_session.commit()

    # Case A: Cold start (occurrences = 10 < 30)
    # Expected: Alert generated with confidence_level = "indeterminada"
    gk = GlobalKnowledge(
        pattern_name="score_bucket_7.0_8.0",
        description="Bucket stats",
        validation_window="24h",
        total_occurrences=10,
        success_count=8,
        failure_count=2,
        neutral_count=0,
        historical_confidence=Decimal("80.0"),
    )
    db_session.add(gk)

    score = OpportunityScore(
        token_id="test_token_edge_123",
        momentum_score=Decimal("5.00"),
        liquidity_score=Decimal("5.00"),
        community_score=Decimal("5.00"),
        distribution_score=Decimal("5.00"),
        safety_score=Decimal("8.00"),
        data_quality_score=Decimal("5.00"),
        final_score=Decimal("7.50"),
        classification="promising",
        confidence=Decimal("0.8000"),
        signals_available=3,
        explanation="Test explanation",
        scoring_version="score-v1",
        calculated_at=datetime.datetime.now(datetime.UTC),
        is_demo=True,
    )
    db_session.add(score)
    await db_session.commit()

    alerts = await process_alert_rules(
        db_session,
        test_settings,
        token_id="test_token_edge_123",
        source_kind="event",
        source_type="volume_spike",
        source_id="event1",
        strength=85.0,
        confidence=90.0,
    )
    assert len(alerts) == 1
    assert alerts[0].confidence_level == "indeterminada"

    # Clean up alerts and stats for the next case
    for a in alerts:
        await db_session.delete(a)
    await db_session.delete(gk)
    await db_session.commit()

    # Case B: Low win rate (occurrences = 40 >= 30, win rate = 40% < 65%)
    # Expected: No alert generated (returns empty list)
    gk = GlobalKnowledge(
        pattern_name="score_bucket_7.0_8.0",
        description="Bucket stats",
        validation_window="24h",
        total_occurrences=40,
        success_count=16,
        failure_count=24,
        neutral_count=0,
        historical_confidence=Decimal("40.0"),
    )
    db_session.add(gk)
    await db_session.commit()

    alerts = await process_alert_rules(
        db_session,
        test_settings,
        token_id="test_token_edge_123",
        source_kind="event",
        source_type="volume_spike",
        source_id="event2",
        strength=85.0,
        confidence=90.0,
    )
    assert len(alerts) == 0

    # Clean up stats
    await db_session.delete(gk)
    await db_session.commit()

    # Case C: Drawdown suspension (occurrences = 40, win rate = 80% >= 65%,
    # but last 3 truths in the bucket are failure)
    # Expected: Alert generated with confidence_level = "suspenso"
    gk = GlobalKnowledge(
        pattern_name="score_bucket_7.0_8.0",
        description="Bucket stats",
        validation_window="24h",
        total_occurrences=40,
        success_count=32,
        failure_count=8,
        neutral_count=0,
        historical_confidence=Decimal("80.0"),
    )
    db_session.add(gk)

    # Let's insert 3 failures for score bucket 7.0 - 8.0
    for i in range(3):
        hyp = TokenHypothesis(
            id=f"hyp_{i}",
            token_id="test_token_edge_123",
            hypothesis_type="test",
            confidence=Decimal("80.0"),
            caused_by_hash=f"hash_{i}",
            metadata_json={"score": 7.5},
            created_at=datetime.datetime.now(datetime.UTC) - datetime.timedelta(minutes=i),
        )
        truth = TokenTruth(
            id=f"truth_{i}",
            token_id="test_token_edge_123",
            hypothesis_id=f"hyp_{i}",
            status="failure",
            created_at=datetime.datetime.now(datetime.UTC) - datetime.timedelta(minutes=i),
        )
        db_session.add(hyp)
        db_session.add(truth)

    await db_session.commit()

    alerts = await process_alert_rules(
        db_session,
        test_settings,
        token_id="test_token_edge_123",
        source_kind="event",
        source_type="volume_spike",
        source_id="event3",
        strength=85.0,
        confidence=90.0,
    )
    assert len(alerts) == 1
    assert alerts[0].confidence_level == "suspenso"

    # Clean up alerts and truths
    for a in alerts:
        await db_session.delete(a)
    for i in range(3):
        await db_session.delete(await db_session.get(TokenTruth, f"truth_{i}"))
        await db_session.delete(await db_session.get(TokenHypothesis, f"hyp_{i}"))
    await db_session.delete(gk)
    await db_session.commit()

    # Case D: Confirmed Edge (occurrences = 40, win rate = 80% >= 65%, no drawdown suspension)
    # Expected: Alert generated with confidence_level = "confirmado"
    gk = GlobalKnowledge(
        pattern_name="score_bucket_7.0_8.0",
        description="Bucket stats",
        validation_window="24h",
        total_occurrences=40,
        success_count=32,
        failure_count=8,
        neutral_count=0,
        historical_confidence=Decimal("80.0"),
    )
    db_session.add(gk)
    await db_session.commit()

    alerts = await process_alert_rules(
        db_session,
        test_settings,
        token_id="test_token_edge_123",
        source_kind="event",
        source_type="volume_spike",
        source_id="event4",
        strength=85.0,
        confidence=90.0,
    )
    assert len(alerts) == 1
    assert alerts[0].confidence_level == "confirmado"
