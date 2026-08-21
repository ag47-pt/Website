from __future__ import annotations

from datetime import UTC, datetime
from math import isfinite
from time import perf_counter
from typing import Any, ClassVar

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, DataQuality, SourceMode
from ag47_radar.providers.contracts import (
    MarketDataProvider,
    MarketPairData,
    ProviderError,
    ProviderResult,
)
from ag47_radar.providers.resilience import ProviderUnavailableError, ResilientJsonClient


class DexScreenerMarketProvider(MarketDataProvider):
    """Real adapter for DexScreener pair lookup and search endpoints."""

    provider_id = "dexscreener"
    mode = SourceMode.REAL
    base_url = "https://api.dexscreener.com"
    max_persistable_price_change: ClassVar[float] = 99_999_999.9999
    chain_ids: ClassVar[dict[Chain, str]] = {
        Chain.BSC: "bsc",
        Chain.SOLANA: "solana",
        Chain.ETHEREUM: "ethereum",
    }
    reverse_chain_ids: ClassVar[dict[str, Chain]] = {value: key for key, value in chain_ids.items()}

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

    async def search(
        self, query: str, chains: list[Chain] | None = None, *, limit: int = 20
    ) -> ProviderResult[list[MarketPairData]]:
        cleaned_query = query.strip()
        if not 1 <= len(cleaned_query) <= 160:
            raise ValueError("query must contain between 1 and 160 characters")
        started = perf_counter()
        collected_at = datetime.now(UTC)
        try:
            response = await self.http.get_json(
                f"{self.base_url}/latest/dex/search", params={"q": cleaned_query}
            )
            allowed = set(chains or list(Chain))
            pairs = [
                normalized
                for raw in self._extract_pairs(response.data)
                if (normalized := self._normalize_pair(raw)) is not None
                and normalized.chain in allowed
            ][:limit]
            return ProviderResult(
                data=pairs,
                source=self.provider_id,
                collected_at=collected_at,
                quality=DataQuality.HIGH if pairs else DataQuality.UNKNOWN,
                partial_errors=[],
                duration_ms=(perf_counter() - started) * 1000,
                mode=self.mode,
                from_cache=response.from_cache,
            )
        except ProviderUnavailableError as exc:
            return ProviderResult(
                data=[],
                source=self.provider_id,
                collected_at=collected_at,
                quality=DataQuality.UNKNOWN,
                partial_errors=[
                    ProviderError(
                        code="market_search_unavailable",
                        message=type(exc).__name__,
                        retryable=True,
                    )
                ],
                duration_ms=(perf_counter() - started) * 1000,
                mode=self.mode,
            )

    async def get_pair(
        self, chain: Chain, pair_address: str
    ) -> ProviderResult[MarketPairData | None]:
        cleaned_address = pair_address.strip()
        if not 4 <= len(cleaned_address) <= 160:
            raise ValueError("invalid pair address")
        started = perf_counter()
        collected_at = datetime.now(UTC)
        try:
            response = await self.http.get_json(
                f"{self.base_url}/latest/dex/pairs/{self.chain_ids[chain]}/{cleaned_address}"
            )
            raw_pairs = self._extract_pairs(response.data)
            pair = self._normalize_pair(raw_pairs[0]) if raw_pairs else None
            return ProviderResult(
                data=pair,
                source=self.provider_id,
                collected_at=collected_at,
                quality=DataQuality.HIGH if pair else DataQuality.UNKNOWN,
                partial_errors=[],
                duration_ms=(perf_counter() - started) * 1000,
                mode=self.mode,
                from_cache=response.from_cache,
            )
        except ProviderUnavailableError as exc:
            return ProviderResult(
                data=None,
                source=self.provider_id,
                collected_at=collected_at,
                quality=DataQuality.UNKNOWN,
                partial_errors=[
                    ProviderError(
                        code="pair_unavailable", message=type(exc).__name__, retryable=True
                    )
                ],
                duration_ms=(perf_counter() - started) * 1000,
                mode=self.mode,
            )

    @staticmethod
    def _extract_pairs(payload: Any) -> list[dict[str, Any]]:
        if not isinstance(payload, dict):
            return []
        pairs = payload.get("pairs")
        return [item for item in (pairs or []) if isinstance(item, dict)]

    def _normalize_pair(self, raw: dict[str, Any]) -> MarketPairData | None:
        chain = self.reverse_chain_ids.get(str(raw.get("chainId") or "").lower())
        base = raw.get("baseToken") or {}
        quote = raw.get("quoteToken") or {}
        pair_address = str(raw.get("pairAddress") or "")
        contract_address = str(base.get("address") or "")
        if chain is None or not pair_address or not contract_address:
            return None
        volume = raw.get("volume") or {}
        changes = raw.get("priceChange") or {}
        liquidity = raw.get("liquidity") or {}
        txns_h1 = (raw.get("txns") or {}).get("h1") or {}
        created_ms = self._optional_float(raw.get("pairCreatedAt"))
        return MarketPairData(
            chain=chain,
            contract_address=contract_address,
            token_name=str(base.get("name") or "Unknown"),
            token_symbol=str(base.get("symbol") or "UNKNOWN"),
            pair_address=pair_address,
            quote_token=str(quote.get("symbol") or "UNKNOWN"),
            dex=str(raw.get("dexId") or "unknown"),
            pair_created_at=datetime.fromtimestamp(created_ms / 1000, UTC) if created_ms else None,
            source_url=self._safe_source_url(raw.get("url")),
            price_usd=self._optional_float(raw.get("priceUsd")),
            liquidity_usd=self._optional_float(liquidity.get("usd")),
            volume_5m=self._optional_float(volume.get("m5")),
            volume_1h=self._optional_float(volume.get("h1")),
            volume_24h=self._optional_float(volume.get("h24")),
            price_change_5m=self._optional_price_change(changes.get("m5")),
            price_change_1h=self._optional_price_change(changes.get("h1")),
            price_change_24h=self._optional_price_change(changes.get("h24")),
            market_cap=self._optional_float(raw.get("marketCap")),
            fdv=self._optional_float(raw.get("fdv")),
            buyers=self._optional_int(txns_h1.get("buys")),
            sellers=self._optional_int(txns_h1.get("sells")),
        )

    @staticmethod
    def _optional_float(value: Any) -> float | None:
        try:
            return float(value) if value is not None else None
        except (TypeError, ValueError):
            return None

    @classmethod
    def _optional_price_change(cls, value: Any) -> float | None:
        parsed = cls._optional_float(value)
        if parsed is None or not isfinite(parsed) or abs(parsed) > cls.max_persistable_price_change:
            return None
        return parsed

    @staticmethod
    def _optional_int(value: Any) -> int | None:
        try:
            return int(value) if value is not None else None
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _safe_source_url(value: Any) -> str | None:
        url = str(value or "")
        return url if url.startswith("https://dexscreener.com/") else None

    async def close(self) -> None:
        await self.http.close()
