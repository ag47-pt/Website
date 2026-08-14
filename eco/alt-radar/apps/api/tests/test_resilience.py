import asyncio
from unittest.mock import patch

import pytest

from ag47_radar.providers.resilience import CircuitBreaker, ProviderUnavailableError, TTLCache


@pytest.mark.asyncio
async def test_ttl_cache_miss():
    cache = TTLCache(ttl_seconds=60)
    found, value = await cache.get("key")
    assert not found
    assert value is None


@pytest.mark.asyncio
async def test_ttl_cache_hit():
    cache = TTLCache(ttl_seconds=60)
    await cache.set("key", "value")
    found, value = await cache.get("key")
    assert found
    assert value == "value"


@pytest.mark.asyncio
async def test_ttl_cache_expiry():
    cache = TTLCache(ttl_seconds=1)
    await cache.set("key", "value")

    # patch monotonic inside the cache's get method checking
    with patch("ag47_radar.providers.resilience.monotonic") as mock_monotonic:
        # Initial call to monotonic gives a time way in the future
        import time

        mock_monotonic.return_value = time.monotonic() + 10.0
        found, value = await cache.get("key")
        assert not found
        assert value is None


@pytest.mark.asyncio
async def test_ttl_cache_eviction():
    cache = TTLCache(ttl_seconds=60, max_entries=2)
    await cache.set("key1", "value1")
    await asyncio.sleep(0.01)  # to ensure different expires_at
    await cache.set("key2", "value2")
    await asyncio.sleep(0.01)
    await cache.set("key3", "value3")

    # key1 should be evicted
    found, _ = await cache.get("key1")
    assert not found

    found, _ = await cache.get("key2")
    assert found
    found, _ = await cache.get("key3")
    assert found


@pytest.mark.asyncio
async def test_circuit_breaker_allows_when_closed():
    cb = CircuitBreaker(failure_threshold=3, cooldown_seconds=60)
    await cb.before_request()  # should not raise


@pytest.mark.asyncio
async def test_circuit_breaker_opens_after_threshold():
    cb = CircuitBreaker(failure_threshold=2, cooldown_seconds=60)
    await cb.record_failure()
    assert cb.opened_at is None
    await cb.record_failure()
    assert cb.opened_at is not None

    with pytest.raises(ProviderUnavailableError):
        await cb.before_request()


@pytest.mark.asyncio
async def test_circuit_breaker_half_open_after_cooldown():
    cb = CircuitBreaker(failure_threshold=2, cooldown_seconds=1)
    await cb.record_failure()
    await cb.record_failure()

    with patch("ag47_radar.providers.resilience.monotonic") as mock_monotonic:
        import time

        mock_monotonic.return_value = time.monotonic() + 10.0
        # should not raise, transition to half-open
        await cb.before_request()
        assert cb.opened_at is None
        assert cb.failure_count == 1  # threshold - 1


@pytest.mark.asyncio
async def test_circuit_breaker_closes_on_success():
    cb = CircuitBreaker(failure_threshold=2, cooldown_seconds=60)
    await cb.record_failure()
    await cb.record_success()
    assert cb.failure_count == 0
    assert cb.opened_at is None
