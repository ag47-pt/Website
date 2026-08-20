from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Literal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ag47_radar.db import utc_now
from ag47_radar.models import NotificationDelivery

type NotificationChannel = Literal["telegram", "webhook_custom"]
type NotificationDispatchStatus = Literal["success", "skipped", "failed", "deferred", "dead"]

DELIVERY_MAX_ATTEMPTS = 3
DELIVERY_LOCK_TIMEOUT = timedelta(minutes=5)


@dataclass(frozen=True, slots=True)
class NotificationDispatchResult:
    channel: NotificationChannel
    status: NotificationDispatchStatus
    reason: str | None = None
    delivery_id: str | None = None
    next_attempt_at: datetime | None = None


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


def delivery_next_attempt_at(delivery: NotificationDelivery) -> datetime | None:
    if delivery.status == "pending":
        return _as_utc(delivery.next_attempt_at)
    if delivery.status == "sending":
        locked_at = delivery.locked_at or delivery.next_attempt_at
        return _as_utc(locked_at) + DELIVERY_LOCK_TIMEOUT
    return None


async def enqueue_delivery(
    session: AsyncSession, *, alert_id: str, channel: str
) -> NotificationDelivery:
    existing = await session.scalar(
        select(NotificationDelivery)
        .where(
            NotificationDelivery.alert_id == alert_id,
            NotificationDelivery.channel == channel,
        )
        .order_by(NotificationDelivery.created_at.desc())
        .with_for_update()
    )
    if existing is not None:
        if existing.status == "failed":
            existing.status = "pending"
            existing.locked_at = None
            existing.next_attempt_at = utc_now()
            await session.flush()
        return existing

    delivery = NotificationDelivery(alert_id=alert_id, channel=channel, status="pending")
    session.add(delivery)
    await session.flush()
    return delivery


async def claim_delivery(
    session: AsyncSession,
    delivery: NotificationDelivery,
) -> bool:
    """Claim one due delivery and persist its attempt before external I/O."""

    now = utc_now()
    if delivery.status == "sending":
        retry_at = delivery_next_attempt_at(delivery)
        if retry_at is not None and retry_at > now:
            return False
        delivery.status = "pending"
        delivery.locked_at = None
        delivery.next_attempt_at = now
    if delivery.status != "pending" or _as_utc(delivery.next_attempt_at) > now:
        return False
    delivery.status = "sending"
    delivery.locked_at = now
    delivery.attempts += 1
    await session.flush()
    return True


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


def schedule_delivery_retry(
    delivery: NotificationDelivery,
    *,
    max_attempts: int = DELIVERY_MAX_ATTEMPTS,
) -> None:
    if delivery.attempts >= max_attempts:
        delivery.status = "dead"
        delivery.locked_at = None
        return
    delivery.status = "pending"
    delivery.locked_at = None
    delivery.next_attempt_at = utc_now() + timedelta(seconds=2 ** (delivery.attempts - 1))
