from __future__ import annotations

from datetime import UTC, datetime

from ag47_radar.config import Settings
from ag47_radar.enums import ProviderStatus, SourceMode
from ag47_radar.providers.demo import (
    DemoContractRiskProvider,
    DemoSocialProvider,
    LogOnlyAlertDeliveryProvider,
    UnavailableBlockchainProvider,
    UnavailableHolderProvider,
)
from ag47_radar.providers.dexscreener import DexScreenerMarketProvider
from ag47_radar.providers.geckoterminal import GeckoTerminalDiscoveryProvider
from ag47_radar.schemas import ProviderStatusRead


class ProviderRegistry:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.discovery = GeckoTerminalDiscoveryProvider(settings)
        self.market = DexScreenerMarketProvider(settings)
        self.blockchain = UnavailableBlockchainProvider()
        self.holders = UnavailableHolderProvider()
        self.risk = DemoContractRiskProvider()
        self.social = DemoSocialProvider()
        self.alert_delivery = LogOnlyAlertDeliveryProvider()

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
                name="Risk fixture",
                kind="contract_risk",
                status=ProviderStatus.ACTIVE
                if self.settings.demo_mode
                else ProviderStatus.DISABLED,
                mode=SourceMode.DEMO,
                last_checked_at=now if self.settings.demo_mode else None,
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
                name="Holder analytics",
                kind="holder_data",
                status=ProviderStatus.DISABLED,
                mode=SourceMode.REAL,
                detail="Contrato pronto; provider real adiado.",
            ),
            ProviderStatusRead(
                id=self.alert_delivery.provider_id,
                name="Structured log delivery",
                kind="alert_delivery",
                status=ProviderStatus.ACTIVE,
                mode=SourceMode.DEMO,
                last_checked_at=now,
                detail="Entrega externa não configurada; eventos permanecem internos.",
            ),
        ]

    async def close(self) -> None:
        await self.discovery.close()
        await self.market.close()
