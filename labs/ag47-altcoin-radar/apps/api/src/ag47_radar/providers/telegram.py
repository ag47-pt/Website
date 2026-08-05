from __future__ import annotations

from datetime import UTC, datetime
from time import perf_counter
from typing import Any

from ag47_radar.config import Settings
from ag47_radar.enums import DataQuality, SourceMode
from ag47_radar.providers.contracts import (
    AlertDeliveryProvider,
    DeliveryReceipt,
    ProviderError,
    ProviderResult,
)
from ag47_radar.providers.resilience import ProviderUnavailableError, ResilientJsonClient


class TelegramAlertDeliveryProvider(AlertDeliveryProvider):
    """Real alert delivery provider using the public Telegram Bot API."""

    provider_id = "telegram.alerts"
    mode = SourceMode.REAL

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.token = settings.telegram_bot_token
        self.chat_id = settings.telegram_chat_id

        self.http = ResilientJsonClient(
            provider_id=self.provider_id,
            timeout_seconds=settings.provider_timeout_seconds,
            max_retries=settings.provider_max_retries,
            backoff_seconds=settings.provider_backoff_seconds,
            cache_ttl_seconds=1,  # Alerts shouldn't be cached aggressively
            circuit_failure_threshold=settings.provider_circuit_failure_threshold,
            circuit_cooldown_seconds=settings.provider_circuit_cooldown_seconds,
            headers={"User-Agent": "AG47-Altcoin-Radar/0.1"},
        )

    async def deliver(
        self, *, alert_id: str, title: str, message: str, payload: dict[str, Any]
    ) -> ProviderResult[DeliveryReceipt]:
        started = perf_counter()
        collected_at = datetime.now(UTC)

        if not self.token or not self.chat_id:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(
                    code="telegram_unconfigured",
                    message="Telegram bot token or chat ID is missing in environment config.",
                    retryable=False,
                ),
            )

        url = f"https://api.telegram.org/bot{self.token}/sendMessage"

        # Format message in HTML to prevent Markdown parse breaks with odd characters
        html_text = f"<b>{self._escape_html(title)}</b>\n\n{self._escape_html(message)}"

        req_payload = {
            "chat_id": self.chat_id,
            "text": html_text,
            "parse_mode": "HTML",
        }

        try:
            res = await self.http.client.post(url, json=req_payload)
            if res.status_code != 200:
                # Handle specific Telegram rate limits (429) or other API errors
                err_data = (
                    res.json()
                    if res.headers.get("Content-Type", "").startswith("application/json")
                    else {}
                )
                err_desc = err_data.get("description", f"HTTP {res.status_code}")
                raise ProviderUnavailableError(f"Telegram API failed: {err_desc}")

            res_json = res.json()
            message_id = res_json.get("result", {}).get("message_id")

            receipt = DeliveryReceipt(
                accepted=True,
                destination=f"telegram:{self.chat_id}",
                external_id=str(message_id) if message_id else None,
            )

            return ProviderResult(
                data=receipt,
                source=self.provider_id,
                collected_at=collected_at,
                quality=DataQuality.HIGH,
                partial_errors=[],
                duration_ms=(perf_counter() - started) * 1000,
                mode=self.mode,
            )

        except Exception as exc:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(code="telegram_delivery_failed", message=str(exc), retryable=True),
            )

    def _empty_result(
        self, started: float, collected_at: datetime, error: ProviderError
    ) -> ProviderResult[DeliveryReceipt]:
        return ProviderResult(
            data=DeliveryReceipt(
                accepted=False,
                destination=f"telegram:{self.chat_id or 'unknown'}",
                external_id=None,
            ),
            source=self.provider_id,
            collected_at=collected_at,
            quality=DataQuality.UNKNOWN,
            partial_errors=[error],
            duration_ms=(perf_counter() - started) * 1000,
            mode=self.mode,
        )

    @staticmethod
    def _escape_html(text: str) -> str:
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    async def close(self) -> None:
        await self.http.close()
