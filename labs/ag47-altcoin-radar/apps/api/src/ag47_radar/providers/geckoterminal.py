from __future__ import annotations

from datetime import UTC, datetime
from time import perf_counter
from typing import Any, ClassVar

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, DataQuality, SourceMode
from ag47_radar.providers.contracts import (
    DiscoveredPair,
    PairDiscoveryProvider,
    ProviderError,
    ProviderResult,
)
from ag47_radar.providers.resilience import ProviderUnavailableError, ResilientJsonClient


class GeckoTerminalDiscoveryProvider(PairDiscoveryProvider):
    """Real adapter for GeckoTerminal's public v2 new-pools API."""

    provider_id = "geckoterminal"
    mode = SourceMode.REAL
    base_url = "https://api.geckoterminal.com/api/v2"
    network_ids: ClassVar[dict[Chain, str]] = {
        Chain.BSC: "bsc",
        Chain.SOLANA: "solana",
        Chain.ETHEREUM: "eth",
    }

    def __init__(self, settings: Settings) -> None:
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

    async def discover(
        self, chains: list[Chain], *, limit: int = 20
    ) -> ProviderResult[list[DiscoveredPair]]:
        started = perf_counter()
        collected_at = datetime.now(UTC)
        items: list[DiscoveredPair] = []
        errors: list[ProviderError] = []
        from_cache = True

        for chain in chains:
            try:
                response = await self.http.get_json(
                    f"{self.base_url}/networks/{self.network_ids[chain]}/new_pools",
                    params={"page": 1, "include": "base_token,quote_token"},
                )
                from_cache = from_cache and response.from_cache
                items.extend(
                    self._normalize(response.data, chain, limit=max(1, limit - len(items)))
                )
            except (ProviderUnavailableError, KeyError, TypeError, ValueError) as exc:
                errors.append(
                    ProviderError(
                        code="discovery_failed",
                        message=f"{chain.value}: {type(exc).__name__}",
                        retryable=True,
                    )
                )
            if len(items) >= limit:
                break

        quality = DataQuality.MEDIUM if items else DataQuality.UNKNOWN
        return ProviderResult(
            data=items[:limit],
            source=self.provider_id,
            collected_at=collected_at,
            quality=quality,
            partial_errors=errors,
            duration_ms=(perf_counter() - started) * 1000,
            mode=self.mode,
            from_cache=from_cache and bool(items),
        )

    def _normalize(self, payload: Any, chain: Chain, *, limit: int) -> list[DiscoveredPair]:
        if not isinstance(payload, dict):
            raise ValueError("unexpected GeckoTerminal payload")
        included_by_id = {
            item.get("id"): item
            for item in payload.get("included", [])
            if isinstance(item, dict) and item.get("id")
        }
        normalized: list[DiscoveredPair] = []
        for raw_pool in payload.get("data", []):
            if not isinstance(raw_pool, dict):
                continue
            attributes = raw_pool.get("attributes") or {}
            relationships = raw_pool.get("relationships") or {}
            base_ref = ((relationships.get("base_token") or {}).get("data") or {}).get("id")
            quote_ref = ((relationships.get("quote_token") or {}).get("data") or {}).get("id")
            base_attributes = (included_by_id.get(base_ref) or {}).get("attributes") or {}
            quote_attributes = (included_by_id.get(quote_ref) or {}).get("attributes") or {}
            address = str(base_attributes.get("address") or self._address_from_resource(base_ref))
            pair_address = str(
                attributes.get("address") or self._address_from_resource(raw_pool.get("id"))
            )
            if not address or not pair_address:
                continue
            normalized.append(
                DiscoveredPair(
                    chain=chain,
                    contract_address=address,
                    token_name=str(
                        base_attributes.get("name") or attributes.get("name") or "Unknown"
                    ),
                    token_symbol=str(base_attributes.get("symbol") or "UNKNOWN"),
                    decimals=self._optional_int(base_attributes.get("decimals")),
                    pair_address=pair_address,
                    quote_token=str(quote_attributes.get("symbol") or "UNKNOWN"),
                    dex=str(
                        ((relationships.get("dex") or {}).get("data") or {}).get("id") or "unknown"
                    ),
                    pair_created_at=self._optional_datetime(attributes.get("pool_created_at")),
                    source_url=f"https://www.geckoterminal.com/{self.network_ids[chain]}/pools/{pair_address}",
                )
            )
            if len(normalized) >= limit:
                break
        return normalized

    @staticmethod
    def _address_from_resource(resource_id: Any) -> str:
        value = str(resource_id or "")
        return value.split("_", maxsplit=1)[-1] if "_" in value else value

    @staticmethod
    def _optional_int(value: Any) -> int | None:
        try:
            return int(value) if value is not None else None
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _optional_datetime(value: Any) -> datetime | None:
        if not value:
            return None
        try:
            return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        except ValueError:
            return None

    async def close(self) -> None:
        await self.http.close()
