import asyncio
import hashlib
import hmac
import ipaddress
import json
import logging
import socket
from datetime import UTC, datetime
from typing import Any
from urllib.parse import urlparse

import httpx
from sqlalchemy import select, update

from ag47_radar.config import Settings
from ag47_radar.models import NotificationDelivery, UserNotificationSettings

logger = logging.getLogger(__name__)

WEBHOOK_TIMEOUT_SECONDS = 10
WEBHOOK_MAX_RETRIES = 3


def validate_webhook_url(webhook_url: str, settings: Settings) -> None:
    parsed = urlparse(webhook_url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("Webhook URL must be an HTTPS URL without embedded credentials")
    if settings.is_production and parsed.hostname.lower() not in settings.webhook_host_allowlist:
        raise ValueError("Webhook host is not allowed in production")


async def validate_webhook_destination(webhook_url: str, settings: Settings) -> None:
    validate_webhook_url(webhook_url, settings)
    hostname = urlparse(webhook_url).hostname
    if hostname is None:
        raise ValueError("Webhook host is required")
    addresses = await asyncio.get_running_loop().getaddrinfo(
        hostname, None, type=socket.SOCK_STREAM
    )
    if not addresses:
        raise ValueError("Webhook host did not resolve")
    for address in addresses:
        ip = ipaddress.ip_address(address[4][0])
        if not ip.is_global:
            raise ValueError("Webhook host resolves to a non-public address")


def sign_payload(payload_bytes: bytes, secret: str) -> str:
    """Generate HMAC SHA-256 signature for webhook payload."""
    return hmac.new(
        secret.encode("utf-8"),
        payload_bytes,
        hashlib.sha256,
    ).hexdigest()


async def dispatch_webhook_alert_bg(
    session_factory: Any,
    settings: Settings,
    alert_id: str,
    token_symbol: str,
    source_type: str,
    severity: float,
    confidence: float,
    confidence_level: str | None = None,
) -> None:
    """Dispatch an alert to the configured webhook endpoint with HMAC SHA-256 signature."""

    # 1. Read webhook config and create delivery record
    async with session_factory() as session:
        user_settings = await session.scalar(select(UserNotificationSettings))
        if not user_settings or not user_settings.webhook_url:
            return

        webhook_url = user_settings.webhook_url
        webhook_secret = user_settings.webhook_secret or ""

        from ag47_radar.services.outbox import enqueue_delivery

        delivery = await enqueue_delivery(session, alert_id=alert_id, channel="webhook_custom")
        await session.commit()
        delivery_id = delivery.id

    # 2. Build payload
    payload = {
        "event": "alert.edge_confirmed",
        "alert_id": alert_id,
        "token_symbol": token_symbol,
        "source_type": source_type,
        "severity": round(severity, 4),
        "confidence": round(confidence, 4),
        "confidence_level": confidence_level,
        "timestamp": datetime.now(UTC).isoformat(),
    }
    payload_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    signature = sign_payload(payload_bytes, webhook_secret)

    # 3. Dispatch with retries
    success = False
    response_data: dict[str, Any] | None = None
    error_msg: str | None = None

    try:
        await validate_webhook_destination(webhook_url, settings)
    except ValueError as exc:
        error_msg = str(exc)
    else:
        async with httpx.AsyncClient(timeout=WEBHOOK_TIMEOUT_SECONDS) as client:
            for attempt in range(WEBHOOK_MAX_RETRIES):
                try:
                    resp = await client.post(
                        webhook_url,
                        content=payload_bytes,
                        headers={
                            "Content-Type": "application/json",
                            "X-AG47-Signature": signature,
                            "X-AG47-Event": "alert.edge_confirmed",
                        },
                    )
                    if 200 <= resp.status_code < 300:
                        success = True
                        response_data = {
                            "status_code": resp.status_code,
                            "duration_ms": resp.elapsed.total_seconds() * 1000
                            if resp.elapsed
                            else None,
                        }
                        break
                    error_msg = f"HTTP {resp.status_code}: {resp.text[:200]}"
                except httpx.TimeoutException:
                    error_msg = "Webhook request timed out"
                except Exception as exc:
                    error_msg = str(exc)[:200]

                if attempt < WEBHOOK_MAX_RETRIES - 1:
                    await asyncio.sleep(2**attempt)

    # 4. Update delivery status
    async with session_factory() as session:
        final_status = "success" if success else "failed"
        provider_resp = response_data if success else {"error": error_msg}
        stmt = (
            update(NotificationDelivery)
            .where(NotificationDelivery.id == delivery_id)
            .values(status=final_status, provider_response=provider_resp)
        )
        await session.execute(stmt)
        await session.commit()

    logger.info(
        "webhook_dispatch_complete",
        extra={"alert_id": alert_id, "success": success, "delivery_id": delivery_id},
    )


async def send_test_webhook(
    webhook_url: str, webhook_secret: str, settings: Settings
) -> dict[str, Any]:
    """Send a test payload to verify the webhook endpoint."""
    payload = {
        "event": "webhook.test",
        "message": "AG47 Altcoin Radar webhook test — se receber esta mensagem, a integração está funcional.",
        "timestamp": datetime.now(UTC).isoformat(),
    }
    payload_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    signature = sign_payload(payload_bytes, webhook_secret)

    try:
        await validate_webhook_destination(webhook_url, settings)
        async with httpx.AsyncClient(timeout=WEBHOOK_TIMEOUT_SECONDS) as client:
            resp = await client.post(
                webhook_url,
                content=payload_bytes,
                headers={
                    "Content-Type": "application/json",
                    "X-AG47-Signature": signature,
                    "X-AG47-Event": "webhook.test",
                },
            )
            return {
                "success": 200 <= resp.status_code < 300,
                "status_code": resp.status_code,
                "duration_ms": resp.elapsed.total_seconds() * 1000 if resp.elapsed else None,
            }
    except httpx.TimeoutException:
        return {"success": False, "error": "Timeout"}
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}
