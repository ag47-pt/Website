from __future__ import annotations

from datetime import UTC, datetime
from time import perf_counter

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, DataQuality, SourceMode
from ag47_radar.providers.contracts import (
    HolderData,
    HolderDataProvider,
    ProviderError,
    ProviderResult,
)
from ag47_radar.providers.resilience import ProviderUnavailableError, ResilientJsonClient


class HeliusHolderProvider(HolderDataProvider):
    """Real holder data provider for Solana using Helius RPC or public fallback RPC."""

    provider_id = "helius.holders"
    mode = SourceMode.REAL

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        api_key = settings.helius_api_key
        if api_key:
            self.rpc_url = f"https://mainnet.helius-rpc.com/?api-key={api_key}"
        else:
            self.rpc_url = "https://api.mainnet-beta.solana.com"

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

    async def get_holders(
        self, chain: Chain, contract_address: str
    ) -> ProviderResult[HolderData | None]:
        started = perf_counter()
        collected_at = datetime.now(UTC)
        cleaned = contract_address.strip()

        if chain != Chain.SOLANA:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(
                    code="chain_unsupported",
                    message=f"Helius holder provider only supports Solana, got '{chain.value}'.",
                    retryable=False,
                ),
            )

        try:
            # 1. Fetch token supply
            supply_payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getTokenSupply",
                "params": [cleaned],
            }
            supply_res = await self.http.client.post(self.rpc_url, json=supply_payload)
            if supply_res.status_code != 200:
                raise ProviderUnavailableError(f"RPC returned status {supply_res.status_code}")
            supply_data = supply_res.json()
            if "error" in supply_data:
                raise RuntimeError(f"RPC error: {supply_data['error']}")

            supply_val = supply_data.get("result", {}).get("value", {})
            total_supply = float(supply_val.get("uiAmount") or 0.0)

            # 2. Fetch token largest accounts
            largest_payload = {
                "jsonrpc": "2.0",
                "id": 2,
                "method": "getTokenLargestAccounts",
                "params": [cleaned],
            }
            largest_res = await self.http.client.post(self.rpc_url, json=largest_payload)
            if largest_res.status_code != 200:
                raise ProviderUnavailableError(f"RPC returned status {largest_res.status_code}")
            largest_data = largest_res.json()
            if "error" in largest_data:
                raise RuntimeError(f"RPC error: {largest_data['error']}")

            largest_list = largest_data.get("result", {}).get("value") or []

            # 3. Calculate top holders percentage
            top_holders_percentage = None
            if total_supply > 0 and largest_list:
                # Sum the uiAmount of the top 10 largest accounts
                top_10_sum = sum(float(acc.get("uiAmount") or 0.0) for acc in largest_list[:10])
                top_holders_percentage = round((top_10_sum / total_supply) * 100, 2)
            elif largest_list:
                top_holders_percentage = 0.0

            data = HolderData(
                chain=chain,
                contract_address=cleaned,
                holders_count=None,  # Solana RPC doesn't expose holder counts natively
                top_holders_percentage=top_holders_percentage,
                deployer_percentage=None,
            )

            return ProviderResult(
                data=data,
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
                ProviderError(code="holder_provider_error", message=str(exc), retryable=True),
            )

    def _empty_result(
        self, started: float, collected_at: datetime, error: ProviderError
    ) -> ProviderResult[HolderData | None]:
        return ProviderResult(
            data=None,
            source=self.provider_id,
            collected_at=collected_at,
            quality=DataQuality.UNKNOWN,
            partial_errors=[error],
            duration_ms=(perf_counter() - started) * 1000,
            mode=self.mode,
        )

    async def close(self) -> None:
        await self.http.close()


class EtherscanHolderProvider(HolderDataProvider):
    """Real holder data provider for EVM chains.

    Uses GoPlus API under the hood to bypass Etherscan PRO paid tier requirements
    for fetching token holders distribution.
    """

    provider_id = "etherscan.holders"
    mode = SourceMode.REAL
    base_url = "https://api.gopluslabs.io/api/v1"
    chain_ids = {
        Chain.ETHEREUM: "1",
        Chain.BSC: "56",
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

    async def get_holders(
        self, chain: Chain, contract_address: str
    ) -> ProviderResult[HolderData | None]:
        started = perf_counter()
        collected_at = datetime.now(UTC)
        cleaned = contract_address.strip().lower()

        if chain not in self.chain_ids:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(
                    code="chain_unsupported",
                    message=f"Etherscan holder provider does not support chain '{chain.value}'.",
                    retryable=False,
                ),
            )

        try:
            response = await self.http.get_json(
                f"{self.base_url}/token_security/{self.chain_ids[chain]}",
                params={"contract_addresses": cleaned},
            )
            raw_payload = response.data
            result = raw_payload.get("result") or {}
            raw = result.get(cleaned)

            if not isinstance(raw, dict):
                return self._empty_result(
                    started,
                    collected_at,
                    ProviderError(
                        code="token_not_found",
                        message="GoPlus API returned no data for this address.",
                        retryable=False,
                    ),
                    from_cache=response.from_cache,
                )

            # Parse holder count
            holders_count = None
            raw_holders_count = raw.get("holder_count")
            if raw_holders_count is not None:
                try:
                    holders_count = int(str(raw_holders_count).replace(",", ""))
                except (TypeError, ValueError):
                    pass

            # Parse top holders
            top_holders_percentage = None
            holders_list = raw.get("holders")
            if isinstance(holders_list, list) and holders_list:
                try:
                    # Sum percent values (represented as strings, e.g. "0.05" for 5%)
                    top_holders_percentage = round(
                        sum(float(h.get("percent") or 0.0) for h in holders_list[:10]) * 100, 2
                    )
                except (TypeError, ValueError):
                    pass

            # Parse deployer percent
            deployer_percentage = None
            raw_creator_pct = raw.get("creator_percent")
            if raw_creator_pct is not None:
                try:
                    deployer_percentage = round(float(raw_creator_pct) * 100, 2)
                except (TypeError, ValueError):
                    pass

            data = HolderData(
                chain=chain,
                contract_address=cleaned,
                holders_count=holders_count,
                top_holders_percentage=top_holders_percentage,
                deployer_percentage=deployer_percentage,
            )

            return ProviderResult(
                data=data,
                source=self.provider_id,
                collected_at=collected_at,
                quality=DataQuality.HIGH,
                partial_errors=[],
                duration_ms=(perf_counter() - started) * 1000,
                mode=self.mode,
                from_cache=response.from_cache,
            )

        except Exception as exc:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(code="holder_provider_error", message=str(exc), retryable=True),
            )

    def _empty_result(
        self,
        started: float,
        collected_at: datetime,
        error: ProviderError,
        *,
        from_cache: bool = False,
    ) -> ProviderResult[HolderData | None]:
        return ProviderResult(
            data=None,
            source=self.provider_id,
            collected_at=collected_at,
            quality=DataQuality.UNKNOWN,
            partial_errors=[error],
            duration_ms=(perf_counter() - started) * 1000,
            mode=self.mode,
            from_cache=from_cache,
        )

    async def close(self) -> None:
        await self.http.close()


class RoutingHolderProvider(HolderDataProvider):
    """Facade holder provider routing calls dynamically based on the chain under observation."""

    provider_id = "routing.holders"
    mode = SourceMode.REAL

    def __init__(self, settings: Settings) -> None:
        self.solana_provider = HeliusHolderProvider(settings)
        self.evm_provider = EtherscanHolderProvider(settings)

    async def get_holders(
        self, chain: Chain, contract_address: str
    ) -> ProviderResult[HolderData | None]:
        if chain == Chain.SOLANA:
            return await self.solana_provider.get_holders(chain, contract_address)
        else:
            return await self.evm_provider.get_holders(chain, contract_address)

    async def close(self) -> None:
        await self.solana_provider.close()
        await self.evm_provider.close()
