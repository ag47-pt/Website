from __future__ import annotations

from datetime import UTC, datetime
from time import perf_counter
from typing import Any, ClassVar

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, DataQuality, SourceMode
from ag47_radar.providers.contracts import (
    ContractRiskData,
    ContractRiskProvider,
    ProviderError,
    ProviderResult,
)
from ag47_radar.providers.resilience import ProviderUnavailableError, ResilientJsonClient

RISK_RULES_VERSION = "goplus-rules-v1"


class GoPlusContractRiskProvider(ContractRiskProvider):
    """Real adapter for the public GoPlus token_security endpoint (EVM chains).

    Solana uses an incompatible response schema on GoPlus and is deliberately
    reported as unsupported instead of being partially normalized.
    """

    provider_id = "goplus"
    mode = SourceMode.REAL
    base_url = "https://api.gopluslabs.io/api/v1"
    chain_ids: ClassVar[dict[Chain, str]] = {
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

    async def assess(
        self, chain: Chain, contract_address: str, *, token_id: str | None = None
    ) -> ProviderResult[ContractRiskData | None]:
        started = perf_counter()
        collected_at = datetime.now(UTC)
        cleaned = contract_address.strip().lower()
        if chain not in self.chain_ids:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(
                    code="chain_unsupported",
                    message=f"GoPlus adapter does not support chain '{chain.value}' yet.",
                    retryable=False,
                ),
            )
        if not (cleaned.startswith("0x") and len(cleaned) == 42):
            return self._empty_result(
                started,
                collected_at,
                ProviderError(
                    code="invalid_contract_address",
                    message="Contract address is not a valid EVM address.",
                    retryable=False,
                ),
            )
        try:
            response = await self.http.get_json(
                f"{self.base_url}/token_security/{self.chain_ids[chain]}",
                params={"contract_addresses": cleaned},
            )
        except ProviderUnavailableError as exc:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(
                    code="risk_provider_unavailable", message=type(exc).__name__, retryable=True
                ),
                from_cache=False,
            )
        raw = self._extract_token(response.data, cleaned)
        if raw is None:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(
                    code="token_not_found",
                    message="GoPlus returned no security data for this contract.",
                    retryable=False,
                ),
                from_cache=response.from_cache,
            )
        data = self._normalize(chain, cleaned, raw)
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

    def _empty_result(
        self,
        started: float,
        collected_at: datetime,
        error: ProviderError,
        *,
        from_cache: bool = False,
    ) -> ProviderResult[ContractRiskData | None]:
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

    @staticmethod
    def _extract_token(payload: Any, address: str) -> dict[str, Any] | None:
        if not isinstance(payload, dict):
            return None
        result = payload.get("result")
        if not isinstance(result, dict):
            return None
        token = result.get(address)
        return token if isinstance(token, dict) else None

    def _normalize(self, chain: Chain, address: str, raw: dict[str, Any]) -> ContractRiskData:
        mintable = self._flag(raw.get("is_mintable"))
        blacklist = self._flag(raw.get("is_blacklisted"))
        can_change_tax = self._flag(raw.get("slippage_modifiable"))
        proxy = self._flag(raw.get("is_proxy"))
        honeypot = self._flag(raw.get("is_honeypot"))
        open_source = self._flag(raw.get("is_open_source"))
        hidden_owner = self._flag(raw.get("hidden_owner"))
        can_take_back_ownership = self._flag(raw.get("can_take_back_ownership"))
        selfdestruct = self._flag(raw.get("selfdestruct"))
        buy_tax = self._tax(raw.get("buy_tax"))
        sell_tax = self._tax(raw.get("sell_tax"))
        holders_count = self._optional_int(raw.get("holder_count"))
        top_holders = self._top_holders_percentage(raw.get("holders"))
        creator_percent = self._percent(raw.get("creator_percent"))
        lock_status = self._liquidity_lock(raw.get("lp_holders"))

        owner_privileges = None
        if hidden_owner:
            owner_privileges = "hidden_owner"
        elif can_take_back_ownership:
            owner_privileges = "can_take_back_ownership"
        elif str(raw.get("owner_address") or "") in {
            "",
            "0x0000000000000000000000000000000000000000",
        }:
            owner_privileges = "renounced_or_none"
        else:
            owner_privileges = "owner_present"

        flags: list[dict[str, Any]] = []

        def flag(rule: str, weight: float, detail: str) -> None:
            flags.append(
                {"rule": rule, "weight": weight, "detail": detail, "version": RISK_RULES_VERSION}
            )

        score = 0.0
        if honeypot:
            score += 10.0
            flag("honeypot", 10.0, "GoPlus marca o contrato como honeypot.")
        if selfdestruct:
            score += 4.0
            flag("selfdestruct", 4.0, "Contrato contém função de autodestruição.")
        if hidden_owner:
            score += 3.0
            flag("hidden_owner", 3.0, "Owner oculto detectado.")
        if can_take_back_ownership:
            score += 2.5
            flag("can_take_back_ownership", 2.5, "Ownership pode ser retomado.")
        if mintable:
            score += 2.0
            flag("mintable", 2.0, "Supply pode ser aumentado pelo owner.")
        if blacklist:
            score += 2.0
            flag("blacklist", 2.0, "Contrato pode bloquear endereços.")
        if can_change_tax:
            score += 1.5
            flag("mutable_tax", 1.5, "Taxas de compra/venda podem ser alteradas.")
        if proxy:
            score += 1.5
            flag("proxy_contract", 1.5, "Contrato é um proxy atualizável.")
        if open_source is False:
            score += 2.0
            flag("closed_source", 2.0, "Código-fonte não verificado.")
        for label, tax in (("buy_tax", buy_tax), ("sell_tax", sell_tax)):
            if tax is not None and tax >= 10.0:
                score += 2.0
                flag(f"high_{label}", 2.0, f"{label} de {tax:.1f}%.")
        if top_holders is not None and top_holders >= 50.0:
            score += 1.5
            flag(
                "holder_concentration",
                1.5,
                f"Top holders concentram {top_holders:.1f}% do supply.",
            )
        if lock_status == "unlocked":
            score += 1.0
            flag("liquidity_unlocked", 1.0, "Liquidez majoritariamente não bloqueada.")

        return ContractRiskData(
            chain=chain,
            contract_address=address,
            risk_score=round(min(10.0, score), 2),
            liquidity_lock_status=lock_status,
            top_holders_percentage=top_holders,
            deployer_percentage=creator_percent,
            holders_count=holders_count,
            owner_privileges=owner_privileges,
            mintable=mintable,
            blacklist_capability=blacklist,
            can_change_tax=can_change_tax,
            buy_tax=buy_tax,
            sell_tax=sell_tax,
            proxy_contract=proxy,
            contract_age_days=None,
            honeypot_status="honeypot"
            if honeypot
            else ("clear" if honeypot is False else "unknown"),
            flags=flags,
        )

    @staticmethod
    def _flag(value: Any) -> bool | None:
        if value in ("1", 1, True):
            return True
        if value in ("0", 0, False):
            return False
        return None

    @staticmethod
    def _tax(value: Any) -> float | None:
        """GoPlus reports taxes as a 0-1 fraction string; expose as percentage."""
        try:
            return round(float(value) * 100, 2) if value not in (None, "") else None
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _percent(value: Any) -> float | None:
        try:
            return round(float(value) * 100, 2) if value not in (None, "") else None
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _optional_int(value: Any) -> int | None:
        try:
            return int(str(value).replace(",", "")) if value not in (None, "") else None
        except (TypeError, ValueError):
            return None

    @classmethod
    def _top_holders_percentage(cls, holders: Any) -> float | None:
        if not isinstance(holders, list) or not holders:
            return None
        total = 0.0
        seen = False
        for holder in holders[:10]:
            if not isinstance(holder, dict):
                continue
            percent = cls._percent(holder.get("percent"))
            if percent is not None:
                total += percent
                seen = True
        return round(total, 2) if seen else None

    @classmethod
    def _liquidity_lock(cls, lp_holders: Any) -> str:
        if not isinstance(lp_holders, list) or not lp_holders:
            return "unknown"
        locked = 0.0
        unlocked = 0.0
        for holder in lp_holders:
            if not isinstance(holder, dict):
                continue
            percent = cls._percent(holder.get("percent")) or 0.0
            if cls._flag(holder.get("is_locked")):
                locked += percent
            else:
                unlocked += percent
        if locked == 0.0 and unlocked == 0.0:
            return "unknown"
        return "locked" if locked >= unlocked else "unlocked"

    async def close(self) -> None:
        await self.http.close()
