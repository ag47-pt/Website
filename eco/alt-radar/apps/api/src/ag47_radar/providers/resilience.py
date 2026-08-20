from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import UTC, datetime
from email.utils import parsedate_to_datetime
from time import monotonic, perf_counter
from typing import Any, ClassVar, Literal

import httpx

from ag47_radar.logging import get_logger

CircuitState = Literal["closed", "open", "half-open"]


class ProviderUnavailableError(RuntimeError):
    """Raised when the upstream or its circuit is unavailable."""


class ProviderResponseError(ProviderUnavailableError):
    """Raised when an upstream returns an unusable response."""


@dataclass(slots=True)
class CachedValue:
    expires_at: float
    value: Any


class TTLCache:
    def __init__(self, ttl_seconds: int, max_entries: int = 512) -> None:
        self._ttl_seconds = ttl_seconds
        self._max_entries = max_entries
        self._values: dict[str, CachedValue] = {}
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> tuple[bool, Any]:
        async with self._lock:
            cached = self._values.get(key)
            if cached is None:
                return False, None
            if cached.expires_at <= monotonic():
                self._values.pop(key, None)
                return False, None
            return True, cached.value

    async def set(self, key: str, value: Any) -> None:
        async with self._lock:
            if len(self._values) >= self._max_entries:
                oldest_key = min(self._values, key=lambda item: self._values[item].expires_at)
                self._values.pop(oldest_key, None)
            self._values[key] = CachedValue(monotonic() + self._ttl_seconds, value)


class CircuitBreaker:
    def __init__(self, failure_threshold: int, cooldown_seconds: int) -> None:
        self.failure_threshold = failure_threshold
        self.cooldown_seconds = cooldown_seconds
        self.failure_count = 0
        self.opened_at: float | None = None
        self._lock = asyncio.Lock()

    async def before_request(self) -> None:
        async with self._lock:
            if self.opened_at is None:
                return
            if monotonic() - self.opened_at >= self.cooldown_seconds:
                # Allow one half-open probe. A failure opens it again.
                self.opened_at = None
                self.failure_count = max(0, self.failure_threshold - 1)
                return
            raise ProviderUnavailableError("provider circuit is temporarily open")

    async def record_success(self) -> None:
        async with self._lock:
            self.failure_count = 0
            self.opened_at = None

    async def record_failure(self) -> None:
        async with self._lock:
            self.failure_count += 1
            if self.failure_count >= self.failure_threshold:
                self.opened_at = monotonic()

    async def reset(self) -> None:
        async with self._lock:
            self.failure_count = 0
            self.opened_at = None

    def get_state_and_cooldown(self) -> tuple[CircuitState, float | None]:
        if self.opened_at is None:
            if self.failure_count == self.failure_threshold - 1:
                return "half-open", None
            return "closed", None

        elapsed = monotonic() - self.opened_at
        remaining = max(0.0, self.cooldown_seconds - elapsed)
        if remaining <= 0:
            return "half-open", None
        return "open", remaining


@dataclass(slots=True)
class JsonResponse:
    data: Any
    duration_ms: float
    from_cache: bool


class ResilientJsonClient:
    RETRYABLE_STATUS_CODES: ClassVar[set[int]] = {429, 500, 502, 503, 504}

    def __init__(
        self,
        *,
        provider_id: str,
        timeout_seconds: float,
        max_retries: int,
        backoff_seconds: float,
        cache_ttl_seconds: int,
        circuit_failure_threshold: int,
        circuit_cooldown_seconds: int,
        headers: dict[str, str] | None = None,
    ) -> None:
        self.provider_id = provider_id
        self.max_retries = max_retries
        self.backoff_seconds: float = backoff_seconds
        self.cache = TTLCache(cache_ttl_seconds)
        self.circuit = CircuitBreaker(circuit_failure_threshold, circuit_cooldown_seconds)
        self.client = httpx.AsyncClient(
            timeout=httpx.Timeout(timeout_seconds),
            follow_redirects=False,
            headers={"Accept": "application/json", **(headers or {})},
        )
        self.log = get_logger(component="provider_http", provider=provider_id)
        self.last_latency_ms: float | None = None

    async def reset(self) -> None:
        await self.circuit.reset()
        self.last_latency_ms = None

    async def get_json(self, url: str, *, params: dict[str, Any] | None = None) -> JsonResponse:
        safe_params = tuple(sorted((str(key), str(value)) for key, value in (params or {}).items()))
        cache_key = f"GET:{url}:{safe_params}"
        found, cached = await self.cache.get(cache_key)
        if found:
            return JsonResponse(data=cached, duration_ms=0.0, from_cache=True)

        await self.circuit.before_request()
        started = perf_counter()
        last_error: Exception | None = None

        for attempt in range(self.max_retries + 1):
            try:
                response = await self.client.get(url, params=params)
            except httpx.HTTPError as exc:
                last_error = exc
            else:
                if response.status_code in self.RETRYABLE_STATUS_CODES:
                    last_error = ProviderResponseError(
                        f"provider returned retryable status {response.status_code}"
                    )
                    if attempt < self.max_retries:
                        delay = self._retry_delay(response, attempt)
                        self.log.warning(
                            "provider_retry",
                            status_code=response.status_code,
                            attempt=attempt + 1,
                            delay_seconds=delay,
                        )
                        await asyncio.sleep(delay)
                        continue
                elif not 200 <= response.status_code < 300:
                    # The provider is reachable; do not retry or open the circuit for a bad request.
                    await self.circuit.record_success()
                    self.log.warning("provider_request_rejected", status_code=response.status_code)
                    raise ProviderResponseError(
                        f"provider rejected request with status {response.status_code}"
                    )
                else:
                    try:
                        payload = response.json()
                    except ValueError as exc:
                        last_error = ProviderResponseError("provider returned invalid JSON")
                        last_error.__cause__ = exc
                    else:
                        await self.circuit.record_success()
                        await self.cache.set(cache_key, payload)
                        duration_ms = (perf_counter() - started) * 1000
                        self.last_latency_ms = duration_ms
                        self.log.info(
                            "provider_request_completed",
                            status_code=response.status_code,
                            duration_ms=round(duration_ms, 2),
                        )
                        return JsonResponse(payload, duration_ms, False)

            if attempt < self.max_retries:
                delay = self.backoff_seconds * (2**attempt)
                await asyncio.sleep(delay)

        await self.circuit.record_failure()
        duration_ms = (perf_counter() - started) * 1000
        self.last_latency_ms = duration_ms
        self.log.warning(
            "provider_request_failed",
            duration_ms=round(duration_ms, 2),
            error_type=type(last_error).__name__ if last_error else "unknown",
        )
        raise ProviderUnavailableError("provider request failed after retries") from last_error

    def _retry_delay(self, response: httpx.Response, attempt: int) -> float:
        retry_after = response.headers.get("Retry-After")
        if retry_after:
            try:
                return min(10.0, max(0.0, float(retry_after)))
            except ValueError:
                try:
                    parsed = parsedate_to_datetime(retry_after)
                    return min(10.0, max(0.0, (parsed - datetime.now(UTC)).total_seconds()))
                except (TypeError, ValueError, OverflowError):
                    pass
        return float(self.backoff_seconds * (2**attempt))

    async def close(self) -> None:
        await self.client.aclose()
