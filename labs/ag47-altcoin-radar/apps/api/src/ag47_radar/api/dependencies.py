from __future__ import annotations

import asyncio
from collections import defaultdict, deque
from time import monotonic

from fastapi import Depends, Request, Response

from ag47_radar.config import Settings, get_settings
from ag47_radar.errors import RateLimitExceededError
from ag47_radar.providers.registry import ProviderRegistry


class SlidingWindowRateLimiter:
    def __init__(self) -> None:
        self._requests: dict[str, deque[float]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def check(self, key: str, *, limit: int, window_seconds: int) -> tuple[int, int]:
        now = monotonic()
        threshold = now - window_seconds
        async with self._lock:
            samples = self._requests[key]
            while samples and samples[0] <= threshold:
                samples.popleft()
            if len(samples) >= limit:
                retry_after = max(1, int(window_seconds - (now - samples[0])) + 1)
                raise RateLimitExceededError(
                    "Mutation rate limit exceeded", retry_after=retry_after
                )
            samples.append(now)
            return max(0, limit - len(samples)), window_seconds


mutation_limiter = SlidingWindowRateLimiter()


async def enforce_mutation_rate_limit(
    request: Request,
    response: Response,
    settings: Settings = Depends(get_settings),
) -> None:
    # Proxy headers are intentionally not trusted in the local MVP.
    client_host = request.client.host if request.client else "unknown"
    key = f"{client_host}:{request.url.path}"
    remaining, reset = await mutation_limiter.check(
        key,
        limit=settings.mutation_rate_limit_requests,
        window_seconds=settings.mutation_rate_limit_window_seconds,
    )
    response.headers["X-RateLimit-Limit"] = str(settings.mutation_rate_limit_requests)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Reset"] = str(reset)


def get_provider_registry(request: Request) -> ProviderRegistry:
    registry = getattr(request.app.state, "providers", None)
    if not isinstance(registry, ProviderRegistry):
        raise RuntimeError("Provider registry has not been initialized")
    return registry
