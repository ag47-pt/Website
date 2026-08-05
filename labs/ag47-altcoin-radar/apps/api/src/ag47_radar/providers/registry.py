from __future__ import annotations

from datetime import UTC, datetime

from ag47_radar.config import Settings
from ag47_radar.enums import Chain, ProviderStatus, SourceMode
from ag47_radar.providers.contracts import (
    AlertDeliveryProvider,
    ContractRiskData,
    ContractRiskProvider,
    HolderDataProvider,
    ProviderResult,
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
from ag47_radar.providers.solana_risk import RugCheckSolanaRiskProvider
from ag47_radar.providers.telegram import TelegramAlertDeliveryProvider
from ag47_radar.schemas import ProviderStatusRead


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
        self.social = DemoSocialProvider()
        self.alert_delivery: AlertDeliveryProvider = (
            TelegramAlertDeliveryProvider(settings)
            if not settings.demo_mode and settings.telegram_bot_token and settings.telegram_chat_id
            else LogOnlyAlertDeliveryProvider()
        )

    def statuses(self) -> list[ProviderStatusRead]:
        now = datetime.now(UTC)
        real_status = ProviderStatus.DISABLED if self.settings.demo_mode else ProviderStatus.ACTIVE
        real_detail = (
            "Implementado; chamadas externas desativadas enquanto AG47_DEMO_MODE=true."
            if self.settings.demo_mode
            else "Provider público configurado; saúde é confirmada na próxima coleta."
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
                status=ProviderStatus.ACTIVE
                if self.settings.demo_mode
                else ProviderStatus.DISABLED,
                mode=SourceMode.DEMO,
                last_checked_at=now if self.settings.demo_mode else None,
                detail="Fixture explicitamente identificado; não representa Telegram real.",
            ),
            ProviderStatusRead(
                id=self.risk.provider_id,
                name="Risk fixture" if self.settings.demo_mode else "MultiChain Risk Router",
                kind="contract_risk",
                status=ProviderStatus.ACTIVE,
                mode=self.risk.mode,
                last_checked_at=now if self.settings.demo_mode else None,
                detail=(
                    "Fixture explícito; campos desconhecidos permanecem desconhecidos."
                    if self.settings.demo_mode
                    else "Provider roteador inteligente ativo (RugCheck em Solana, GoPlus em EVM)."
                ),
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
                name="Holder analytics fixture"
                if self.settings.demo_mode
                else "MultiChain Holder Router",
                kind="holder_data",
                status=ProviderStatus.DISABLED
                if self.settings.demo_mode
                else ProviderStatus.ACTIVE,
                mode=self.holders.mode,
                detail=(
                    "Contrato pronto; provider real adiado."
                    if self.settings.demo_mode
                    else "Roteador ativo (Helius em Solana, GoPlus/Eetherscan em EVM)."
                ),
            ),
            ProviderStatusRead(
                id=self.alert_delivery.provider_id,
                name="Structured log delivery"
                if isinstance(self.alert_delivery, LogOnlyAlertDeliveryProvider)
                else "Telegram Bot Delivery",
                kind="alert_delivery",
                status=ProviderStatus.ACTIVE,
                mode=self.alert_delivery.mode,
                last_checked_at=now,
                detail=(
                    "Entrega externa não configurada; eventos permanecem internos."
                    if isinstance(self.alert_delivery, LogOnlyAlertDeliveryProvider)
                    else "Entrega ativa para Telegram Chat ID configurado."
                ),
            ),
        ]

    async def close(self) -> None:
        await self.discovery.close()
        await self.market.close()
        for p in (self.risk, self.holders, self.alert_delivery):
            if hasattr(p, "close") and callable(p.close):
                try:
                    await p.close()
                except Exception:
                    pass
