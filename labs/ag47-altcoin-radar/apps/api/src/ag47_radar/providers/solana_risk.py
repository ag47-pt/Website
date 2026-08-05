from __future__ import annotations

from datetime import UTC, datetime
from time import perf_counter
from typing import Any

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, DataQuality, SourceMode
from ag47_radar.providers.contracts import (
    ContractRiskData,
    ContractRiskProvider,
    ProviderError,
    ProviderResult,
)
from ag47_radar.providers.resilience import ProviderUnavailableError, ResilientJsonClient

RISK_RULES_VERSION = "rugcheck-rules-v1"


class RugCheckSolanaRiskProvider(ContractRiskProvider):
    """Real adapter for the public RugCheck API endpoint (Solana SPL tokens)."""

    provider_id = "rugcheck"
    mode = SourceMode.REAL
    base_url = "https://api.rugcheck.xyz/v1"

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
        cleaned = contract_address.strip()

        if chain != Chain.SOLANA:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(
                    code="chain_unsupported",
                    message=f"RugCheck adapter only supports Solana, got '{chain.value}'.",
                    retryable=False,
                ),
            )

        try:
            response = await self.http.get_json(f"{self.base_url}/tokens/{cleaned}/report")
        except ProviderUnavailableError as exc:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(code="risk_provider_unavailable", message=str(exc), retryable=True),
                from_cache=False,
            )
        except Exception as exc:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(code="risk_provider_error", message=str(exc), retryable=False),
                from_cache=False,
            )

        raw = response.data
        if not isinstance(raw, dict) or "mint" not in raw:
            return self._empty_result(
                started,
                collected_at,
                ProviderError(
                    code="token_not_found",
                    message="RugCheck returned no valid report for this contract.",
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

    def _normalize(self, chain: Chain, address: str, raw: dict[str, Any]) -> ContractRiskData:
        token_info = raw.get("token") or {}
        mint_authority = token_info.get("mintAuthority")
        mintable = mint_authority is not None

        # RugCheck reports raw risk scores, often up to 1000+
        raw_score = raw.get("score", 0)
        risk_score = round(min(10.0, float(raw_score) / 100.0), 2)

        # Detect liquidity lock status
        # 1. Check risks list for unlocking warnings
        risks_list = raw.get("risks") or []
        unlocked_warning = False
        for risk in risks_list:
            risk_name = str(risk.get("name", "")).lower()
            if "no liquidity locked" in risk_name or "unlocked" in risk_name:
                unlocked_warning = True

        # 2. Check lockers presence
        lockers = raw.get("lockers") or []
        has_lockers = isinstance(lockers, list) and len(lockers) > 0

        if unlocked_warning:
            lock_status = "unlocked"
        elif has_lockers:
            lock_status = "locked"
        else:
            lock_status = "unknown"

        # Extract transfer fees
        transfer_fee = raw.get("transferFee") or {}
        buy_tax = None
        sell_tax = None
        fee_pct = transfer_fee.get("pct")
        if fee_pct is not None:
            try:
                # Fee is represented in percent (e.g. 5 for 5%)
                buy_tax = float(fee_pct)
                sell_tax = float(fee_pct)
            except (TypeError, ValueError):
                pass

        # Extract holders
        holders_count = raw.get("totalHolders")
        if holders_count is not None:
            try:
                holders_count = int(holders_count)
            except (TypeError, ValueError):
                holders_count = None

        top_holders = raw.get("topHolders")
        top_holders_percentage = None
        if isinstance(top_holders, list) and top_holders:
            try:
                # Calculate sum of top 10 holders
                top_holders_percentage = round(
                    sum(float(h.get("pct", 0.0)) for h in top_holders[:10]), 2
                )
            except (TypeError, ValueError):
                pass

        # Creator percent (deployer percentage)
        creator_balance = raw.get("creatorBalance")
        supply = token_info.get("supply")
        deployer_percentage = None
        if creator_balance is not None and supply:
            try:
                deployer_percentage = round((float(creator_balance) / float(supply)) * 100, 2)
            except (TypeError, ValueError, ZeroDivisionError):
                pass

        # Mapeamento de flags
        flags: list[dict[str, Any]] = []
        for risk in risks_list:
            rule = risk.get("name", "unknown_rule")
            score = float(risk.get("score", 0)) / 100.0
            description = risk.get("description", "")
            flags.append(
                {
                    "rule": rule,
                    "weight": score,
                    "detail": description,
                    "version": RISK_RULES_VERSION,
                }
            )

        owner_privileges = None
        if mint_authority:
            owner_privileges = "owner_present"
        elif mint_authority is None:
            owner_privileges = "renounced_or_none"

        return ContractRiskData(
            chain=chain,
            contract_address=address,
            risk_score=risk_score,
            liquidity_lock_status=lock_status,
            top_holders_percentage=top_holders_percentage,
            deployer_percentage=deployer_percentage,
            holders_count=holders_count,
            owner_privileges=owner_privileges,
            mintable=mintable,
            blacklist_capability=None,
            can_change_tax=None,
            buy_tax=buy_tax,
            sell_tax=sell_tax,
            proxy_contract=None,
            contract_age_days=None,
            honeypot_status="honeypot" if risk_score >= 8.0 and unlocked_warning else "clear",
            flags=flags,
        )

    async def close(self) -> None:
        await self.http.close()
