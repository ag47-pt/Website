from __future__ import annotations

import pytest
from sqlalchemy import select

from ag47_radar.models import AlertRule, Token, TokenAlert
from ag47_radar.services.outbox import enqueue_delivery, schedule_delivery_retry


@pytest.mark.asyncio
async def test_enqueue_delivery_is_idempotent_for_pending_channel(db_session, seeded_db):
    token_id = await db_session.scalar(select(Token.id).limit(1))
    assert token_id is not None
    rule = AlertRule(name="test", source_kind="test", source_type="test", rule_version="test")
    db_session.add(rule)
    await db_session.flush()
    alert = TokenAlert(
        rule_id=rule.id,
        token_id=token_id,
        source_kind="test",
        source_id="test",
        deduplication_key="outbox-test",
    )
    db_session.add(alert)
    await db_session.flush()

    first = await enqueue_delivery(db_session, alert_id=alert.id, channel="telegram")
    second = await enqueue_delivery(db_session, alert_id=alert.id, channel="telegram")

    assert first.id == second.id
    assert first.status == "pending"


def test_delivery_retry_becomes_dead_after_max_attempts():
    from ag47_radar.models import NotificationDelivery

    delivery = NotificationDelivery(alert_id="alert", channel="telegram", attempts=3)
    schedule_delivery_retry(delivery, max_attempts=3)
    assert delivery.status == "dead"
