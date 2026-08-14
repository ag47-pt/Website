from __future__ import annotations

import asyncio
import ipaddress
import secrets
from collections import defaultdict, deque
from time import monotonic

from fastapi import Depends, Header, Request, Response

from ag47_radar.config import Settings, get_settings
from ag47_radar.errors import (
    AuthenticationError,
    AuthorizationError,
    RateLimitExceededError,
    SecurityConfigurationError,
)
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
    client_host = get_client_host(request, settings)
    key = f"{client_host}:{request.url.path}"
    remaining, reset = await mutation_limiter.check(
        key,
        limit=settings.mutation_rate_limit_requests,
        window_seconds=settings.mutation_rate_limit_window_seconds,
    )
    response.headers["X-RateLimit-Limit"] = str(settings.mutation_rate_limit_requests)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Reset"] = str(reset)


def get_client_host(request: Request, settings: Settings) -> str:
    peer_host = request.client.host if request.client else "unknown"
    if not is_trusted_proxy(peer_host, settings):
        return peer_host
    forwarded_for = request.headers.get("x-forwarded-for", "")
    return forwarded_for.split(",", maxsplit=1)[0].strip() or peer_host


def is_trusted_proxy(peer_host: str, settings: Settings) -> bool:
    try:
        peer_ip = ipaddress.ip_address(peer_host)
    except ValueError:
        return False
    for raw_network in settings.trusted_proxy_networks:
        try:
            if peer_ip in ipaddress.ip_network(raw_network, strict=False):
                return True
        except ValueError:
            continue
    return False


def resolve_operator_role(
    settings: Settings,
    api_key: str | None,
) -> str:
    if not settings.is_production:
        return "admin"
    if not settings.operator_api_key or not settings.admin_api_key:
        raise SecurityConfigurationError("Production operator credentials are not configured")
    if api_key is None:
        raise AuthenticationError("Operator API key is required")
    if secrets.compare_digest(api_key, settings.admin_api_key):
        return "admin"
    if secrets.compare_digest(api_key, settings.operator_api_key):
        return "operator"
    raise AuthenticationError("Operator API key is invalid")


async def require_operator(
    x_ag47_api_key: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> str:
    return resolve_operator_role(settings, x_ag47_api_key)


async def require_admin(
    x_ag47_api_key: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> str:
    role = resolve_operator_role(settings, x_ag47_api_key)
    if role != "admin":
        raise AuthorizationError("Administrator role is required")
    return role


def get_provider_registry(request: Request) -> ProviderRegistry:
    registry = getattr(request.app.state, "providers", None)
    if not isinstance(registry, ProviderRegistry):
        raise RuntimeError("Provider registry has not been initialized")
    return registry
