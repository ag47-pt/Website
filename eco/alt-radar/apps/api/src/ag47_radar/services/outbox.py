from __future__ import annotations

from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.db import utc_now
from ag47_radar.models import NotificationDelivery


async def enqueue_delivery(
    session: AsyncSession, *, alert_id: str, channel: str
) -> NotificationDelivery:
    existing = await session.scalar(
        select(NotificationDelivery)
        .where(
            NotificationDelivery.alert_id == alert_id,
            NotificationDelivery.channel == channel,
            NotificationDelivery.status.in_(["pending", "sending"]),
        )
        .order_by(NotificationDelivery.created_at.desc())
    )
    if existing is not None:
        return existing

    delivery = NotificationDelivery(alert_id=alert_id, channel=channel, status="pending")
    session.add(delivery)
    await session.flush()
    return delivery


async def claim_due_deliveries(
    session: AsyncSession, *, limit: int = 25
) -> list[NotificationDelivery]:
    now = utc_now()
    deliveries = (
        await session.scalars(
            select(NotificationDelivery)
            .where(
                NotificationDelivery.status == "pending",
                NotificationDelivery.next_attempt_at <= now,
            )
            .order_by(NotificationDelivery.next_attempt_at)
            .limit(limit)
            .with_for_update(skip_locked=True)
        )
    ).all()
    for delivery in deliveries:
        delivery.status = "sending"
        delivery.locked_at = now
        delivery.attempts += 1
    await session.flush()
    return list(deliveries)


def schedule_delivery_retry(delivery: NotificationDelivery, *, max_attempts: int = 3) -> None:
    if delivery.attempts >= max_attempts:
        delivery.status = "dead"
        delivery.locked_at = None
        return
    delivery.status = "pending"
    delivery.locked_at = None
    delivery.next_attempt_at = utc_now() + timedelta(seconds=2 ** (delivery.attempts - 1))
