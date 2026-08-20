from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Protocol

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, ProviderStatus, SourceMode
from ag47_radar.providers.contracts import (
    AlertDeliveryProvider,
    ContractRiskData,
    ContractRiskProvider,
    HolderDataProvider,
    ProviderResult,
    SocialDataProvider,
)
from ag47_radar.providers.demo import (
    DemoContractRiskProvider,
    DemoSocialProvider,
    LogOnlyAlertDeliveryProvider,
    UnavailableBlockchainProvider,
    UnavailableHolderProvider,
)
from ag47_radar.providers.dexscreener import DexScreenerMarketProvider
from ag47_radar.providers.geckoterminal import GeckoTerminalDiscoveryProvider
from ag47_radar.providers.goplus import GoPlusContractRiskProvider
from ag47_radar.providers.holders import RoutingHolderProvider
from ag47_radar.providers.resilience import CircuitState, ResilientJsonClient
from ag47_radar.providers.solana_risk import RugCheckSolanaRiskProvider
from ag47_radar.providers.telegram import TelegramAlertDeliveryProvider
from ag47_radar.schemas import ProviderStatusRead


class _CircuitAwareProvider(Protocol):
    @property
    def provider_id(self) -> str: ...

    @property
    def mode(self) -> SourceMode: ...

    @property
    def http(self) -> ResilientJsonClient | None: ...


@dataclass(frozen=True, slots=True)
class _CircuitDetails:
    circuit_state: CircuitState
    consecutive_failures: int
    latency_ms: float | None
    remaining_cooldown: float | None


class RoutingContractRiskProvider(ContractRiskProvider):
    """Facade risk provider routing calls to GoPlus (EVM) or RugCheck (Solana)."""

    provider_id = "routing.risk"
    mode = SourceMode.REAL

    def __init__(self, settings: Settings) -> None:
        self.solana_risk = RugCheckSolanaRiskProvider(settings)
        self.evm_risk = GoPlusContractRiskProvider(settings)

    async def assess(
        self, chain: Chain, contract_address: str, *, token_id: str | None = None
    ) -> ProviderResult[ContractRiskData | None]:
        if chain == Chain.SOLANA:
            return await self.solana_risk.assess(chain, contract_address, token_id=token_id)
        else:
            return await self.evm_risk.assess(chain, contract_address, token_id=token_id)

    async def close(self) -> None:
        await self.solana_risk.close()
        await self.evm_risk.close()


def _extract_circuit_details(provider: _CircuitAwareProvider) -> _CircuitDetails:
    http_client = provider.http
    if http_client is None:
        return _CircuitDetails(
            circuit_state="closed",
            consecutive_failures=0,
            latency_ms=None,
            remaining_cooldown=None,
        )

    state, remaining = http_client.circuit.get_state_and_cooldown()
    return _CircuitDetails(
        circuit_state=state,
        consecutive_failures=http_client.circuit.failure_count,
        latency_ms=http_client.last_latency_ms,
        remaining_cooldown=remaining,
    )


class ProviderRegistry:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.discovery = GeckoTerminalDiscoveryProvider(settings)
        self.market = DexScreenerMarketProvider(settings)
        self.blockchain = UnavailableBlockchainProvider()
        self.holders: HolderDataProvider = (
            UnavailableHolderProvider() if settings.demo_mode else RoutingHolderProvider(settings)
        )
        self.risk: ContractRiskProvider = (
            DemoContractRiskProvider()
            if settings.demo_mode
            else RoutingContractRiskProvider(settings)
        )
        from ag47_radar.providers.social import RoutingSocialProvider

        self.social: SocialDataProvider = (
            DemoSocialProvider() if settings.demo_mode else RoutingSocialProvider(settings)
        )
        self.alert_delivery: AlertDeliveryProvider = (
            TelegramAlertDeliveryProvider(settings)
            if not settings.demo_mode and settings.telegram_bot_token and settings.telegram_chat_id
            else LogOnlyAlertDeliveryProvider()
        )

    def statuses(self) -> list[ProviderStatusRead]:
        now = datetime.now(UTC)

        # If in demo mode, return the static statuses as before to keep compatibility
        if self.settings.demo_mode:
            real_status = ProviderStatus.DISABLED
            real_detail = (
                "Implementado; chamadas externas desativadas enquanto AG47_DEMO_MODE=true."
            )
            return [
                ProviderStatusRead(
                    id=self.discovery.provider_id,
                    name="GeckoTerminal",
                    kind="pair_discovery",
                    status=real_status,
                    mode=SourceMode.REAL,
                    last_checked_at=None,
                    detail=real_detail,
                ),
                ProviderStatusRead(
                    id=self.market.provider_id,
                    name="DexScreener",
                    kind="market_data",
                    status=real_status,
                    mode=SourceMode.REAL,
                    last_checked_at=None,
                    detail=real_detail,
                ),
                ProviderStatusRead(
                    id=self.social.provider_id,
                    name="Social fixture",
                    kind="social_data",
                    status=ProviderStatus.ACTIVE,
                    mode=SourceMode.DEMO,
                    last_checked_at=now,
                    detail="Fixture explicitamente identificado; não representa Telegram real.",
                ),
                ProviderStatusRead(
                    id=self.risk.provider_id,
                    name="Risk fixture",
                    kind="contract_risk",
                    status=ProviderStatus.ACTIVE,
                    mode=self.risk.mode,
                    last_checked_at=now,
                    detail="Fixture explícito; campos desconhecidos permanecem desconhecidos.",
                ),
                ProviderStatusRead(
                    id=self.blockchain.provider_id,
                    name="Blockchain metadata",
                    kind="blockchain_data",
                    status=ProviderStatus.DISABLED,
                    mode=SourceMode.REAL,
                    detail="Contrato pronto; provider real adiado.",
                ),
                ProviderStatusRead(
                    id=self.holders.provider_id,
                    name="Holder analytics fixture",
                    kind="holder_data",
                    status=ProviderStatus.DISABLED,
                    mode=self.holders.mode,
                    detail="Contrato pronto; provider real adiado.",
                ),
                ProviderStatusRead(
                    id=self.alert_delivery.provider_id,
                    name="Structured log delivery",
                    kind="alert_delivery",
                    status=ProviderStatus.ACTIVE,
                    mode=self.alert_delivery.mode,
                    last_checked_at=now,
                    detail="Entrega externa não configurada; eventos permanecem internos.",
                ),
            ]

        # Real Mode: Map actual active providers and extract their circuit status
        result_list: list[ProviderStatusRead] = []

        # Helper to build status dynamically
        def add_provider_status(provider_obj: _CircuitAwareProvider, name: str, kind: str) -> None:
            details = _extract_circuit_details(provider_obj)
            status_val = ProviderStatus.ACTIVE
            if details.circuit_state == "open":
                status_val = ProviderStatus.DEGRADED

            result_list.append(
                ProviderStatusRead(
                    id=provider_obj.provider_id,
                    name=name,
                    kind=kind,
                    status=status_val,
                    mode=provider_obj.mode,
                    last_checked_at=now if details.latency_ms is not None else None,
                    detail=(
                        f"Circuito {details.circuit_state.upper()}. "
                        f"Falhas: {details.consecutive_failures}."
                    ),
                    circuit_state=details.circuit_state,
                    consecutive_failures=details.consecutive_failures,
                    latency_ms=details.latency_ms,
                    remaining_cooldown=details.remaining_cooldown,
                )
            )

        # 1. GeckoTerminal Discovery
        add_provider_status(self.discovery, "GeckoTerminal", "pair_discovery")

        # 2. DexScreener Market Data
        add_provider_status(self.market, "DexScreener", "market_data")

        # 3. GoPlus Risk (EVM) and RugCheck (Solana)
        from ag47_radar.providers.registry import RoutingContractRiskProvider

        if isinstance(self.risk, RoutingContractRiskProvider):
            add_provider_status(self.risk.evm_risk, "GoPlus Security", "contract_risk")
            add_provider_status(self.risk.solana_risk, "RugCheck Solana", "contract_risk")

        # 4. Routing Holders
        from ag47_radar.providers.holders import RoutingHolderProvider

        if isinstance(self.holders, RoutingHolderProvider):
            add_provider_status(self.holders.solana_provider, "Helius Holders", "holder_data")
            add_provider_status(self.holders.evm_provider, "Etherscan Holders", "holder_data")

        # 5. Routing Social
        from ag47_radar.providers.social import RoutingSocialProvider

        if isinstance(self.social, RoutingSocialProvider):
            add_provider_status(self.social.telegram, "Telegram Public API", "social_data")

        # 6. Alert Delivery (Telegram Bot or Log Delivery)
        from ag47_radar.providers.telegram import TelegramAlertDeliveryProvider

        if isinstance(self.alert_delivery, TelegramAlertDeliveryProvider):
            add_provider_status(self.alert_delivery, "Telegram Bot API", "alert_delivery")
        else:
            result_list.append(
                ProviderStatusRead(
                    id=self.alert_delivery.provider_id,
                    name="Structured Log Delivery",
                    kind="alert_delivery",
                    status=ProviderStatus.ACTIVE,
                    mode=self.alert_delivery.mode,
                    last_checked_at=now,
                    detail="Telegram não configurado; logs estruturados ativos.",
                    circuit_state="closed",
                    consecutive_failures=0,
                    latency_ms=None,
                    remaining_cooldown=None,
                )
            )

        return result_list

    async def reset_circuit(self, provider_id: str) -> bool:
        providers_to_check = [self.discovery, self.market, self.alert_delivery]

        from ag47_radar.providers.registry import RoutingContractRiskProvider

        if isinstance(self.risk, RoutingContractRiskProvider):
            providers_to_check.extend([self.risk.evm_risk, self.risk.solana_risk])

        from ag47_radar.providers.holders import RoutingHolderProvider

        if isinstance(self.holders, RoutingHolderProvider):
            providers_to_check.extend([self.holders.solana_provider, self.holders.evm_provider])

        from ag47_radar.providers.social import RoutingSocialProvider

        if isinstance(self.social, RoutingSocialProvider):
            providers_to_check.append(self.social.telegram)

        for p in providers_to_check:
            if hasattr(p, "provider_id") and p.provider_id == provider_id:
                if hasattr(p, "http") and p.http is not None:
                    if hasattr(p.http, "reset"):
                        await p.http.reset()
                        return True
        return False

    async def close(self) -> None:
        await self.discovery.close()
        await self.market.close()
        for p in (self.risk, self.holders, self.alert_delivery):
            if hasattr(p, "close") and callable(p.close):
                try:
                    await p.close()
                except Exception:
                    pass
