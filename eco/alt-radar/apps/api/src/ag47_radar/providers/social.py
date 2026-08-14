from __future__ import annotations

from datetime import UTC, datetime
from time import perf_counter

from ag47_radar.config import Settings
from ag47_radar.enums import DataQuality, SourceMode
from ag47_radar.logging import get_logger
from ag47_radar.providers.contracts import (
    ProviderError,
    ProviderResult,
    SocialData,
    SocialDataProvider,
)
from ag47_radar.providers.resilience import ResilientJsonClient


class TelegramPublicSocialProvider(SocialDataProvider):
    provider_id = "telegram.public"
    mode = SourceMode.REAL

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.log = get_logger(component="social_provider", provider=self.provider_id)
        self.http = ResilientJsonClient(
            provider_id=self.provider_id,
            timeout_seconds=settings.provider_timeout_seconds,
            max_retries=settings.provider_max_retries,
            backoff_seconds=settings.provider_backoff_seconds,
            cache_ttl_seconds=settings.provider_cache_ttl_seconds,
            circuit_failure_threshold=settings.provider_circuit_failure_threshold,
            circuit_cooldown_seconds=settings.provider_circuit_cooldown_seconds,
            headers={"User-Agent": "AG47-Altcoin-Radar/0.1"},
        )
        self.bot_token = settings.telegram_bot_token

    async def collect(self, token_id: str) -> ProviderResult[SocialData | None]:
        started = perf_counter()
        errors: list[ProviderError] = []

        if not self.bot_token:
            errors.append(
                ProviderError(
                    code="telegram_token_missing",
                    message="AG47_TELEGRAM_BOT_TOKEN is not configured.",
                    retryable=False,
                )
            )
            return ProviderResult(
                data=None,
                source=self.provider_id,
                collected_at=datetime.now(UTC),
                quality=DataQuality.UNKNOWN,
                partial_errors=errors,
                duration_ms=(perf_counter() - started) * 1000,
                mode=self.mode,
            )

        # TO-DO: Implement resolution of token_id to Telegram chat_id (e.g., via DB or metadata).
        # For now, since we cannot map token_id to a chat_id inherently, we return None gracefully.
        # Once we have the chat_id, we would call:
        # /bot{self.bot_token}/getChatMemberCount?chat_id={chat_id}
        
        errors.append(
            ProviderError(
                code="telegram_chat_id_unknown",
                message=f"Cannot map token_id {token_id} to a Telegram chat_id yet.",
                retryable=False,
            )
        )

        return ProviderResult(
            data=None,
            source=self.provider_id,
            collected_at=datetime.now(UTC),
            quality=DataQuality.UNKNOWN,
            partial_errors=errors,
            duration_ms=(perf_counter() - started) * 1000,
            mode=self.mode,
        )

    async def close(self) -> None:
        await self.http.close()


class RoutingSocialProvider(SocialDataProvider):
    """Facade social provider routing calls to the best available social provider."""

    provider_id = "routing.social"
    mode = SourceMode.REAL

    def __init__(self, settings: Settings) -> None:
        self.telegram = TelegramPublicSocialProvider(settings)

    async def collect(self, token_id: str) -> ProviderResult[SocialData | None]:
        # For now, we only route to Telegram.
        # In the future, we could query LunarCrush here and fallback to Telegram.
        return await self.telegram.collect(token_id)

    async def close(self) -> None:
        await self.telegram.close()
