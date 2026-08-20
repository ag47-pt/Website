from __future__ import annotations

from datetime import UTC, datetime
from time import perf_counter
from typing import Any

from ag47_radar.enums import Chain, DataQuality, SourceMode
from ag47_radar.fixtures import DEMO_BY_ADDRESS, DEMO_BY_ID, DEMO_FIXTURE_VERSION
from ag47_radar.logging import get_logger
from ag47_radar.providers.contracts import (
    AlertDeliveryProvider,
    BlockchainDataProvider,
    BlockchainTokenData,
    ContractRiskData,
    ContractRiskProvider,
    DeliveryReceipt,
    HolderData,
    HolderDataProvider,
    ProviderError,
    ProviderResult,
    SocialData,
    SocialDataProvider,
)


class DemoSocialProvider(SocialDataProvider):
    provider_id = f"demo.social.{DEMO_FIXTURE_VERSION}"
    mode = SourceMode.DEMO

    async def collect(self, token_id: str) -> ProviderResult[SocialData | None]:
        started = perf_counter()
        fixture = DEMO_BY_ID.get(token_id)
        data = None
        errors: list[ProviderError] = []
        if fixture:
            data = SocialData(token_id=token_id, platform="telegram", **fixture["social"])
        else:
            errors.append(
                ProviderError(
                    code="demo_fixture_missing",
                    message="No social demo fixture exists for this token.",
                    retryable=False,
                )
            )
        return ProviderResult(
            data=data,
            source=self.provider_id,
            collected_at=datetime.now(UTC),
            quality=DataQuality.MEDIUM if data else DataQuality.UNKNOWN,
            partial_errors=errors,
            duration_ms=(perf_counter() - started) * 1000,
            mode=self.mode,
        )


class DemoContractRiskProvider(ContractRiskProvider):
    provider_id = f"demo.risk.{DEMO_FIXTURE_VERSION}"
    mode = SourceMode.DEMO

    async def assess(
        self, chain: Chain, contract_address: str, *, token_id: str | None = None
    ) -> ProviderResult[ContractRiskData | None]:
        started = perf_counter()
        fixture = DEMO_BY_ID.get(token_id or "") or DEMO_BY_ADDRESS.get(
            (chain.value, contract_address)
        )
        data = None
        errors: list[ProviderError] = []
        if fixture:
            data = ContractRiskData(
                chain=chain,
                contract_address=contract_address,
                **fixture["risk"],
            )
        else:
            errors.append(
                ProviderError(
                    code="demo_fixture_missing",
                    message="No risk demo fixture exists for this token.",
                    retryable=False,
                )
            )
        return ProviderResult(
            data=data,
            source=self.provider_id,
            collected_at=datetime.now(UTC),
            quality=DataQuality.MEDIUM if data else DataQuality.UNKNOWN,
            partial_errors=errors,
            duration_ms=(perf_counter() - started) * 1000,
            mode=self.mode,
        )


class UnavailableBlockchainProvider(BlockchainDataProvider):
    provider_id = "blockchain.unconfigured"
    mode = SourceMode.REAL

    async def get_token(
        self, chain: Chain, contract_address: str
    ) -> ProviderResult[BlockchainTokenData | None]:
        return ProviderResult(
            data=None,
            source=self.provider_id,
            collected_at=datetime.now(UTC),
            quality=DataQuality.UNKNOWN,
            partial_errors=[
                ProviderError(
                    code="provider_unconfigured",
                    message="Blockchain metadata provider is not configured in Sprint 1.",
                    retryable=False,
                )
            ],
            duration_ms=0,
            mode=self.mode,
        )


class UnavailableHolderProvider(HolderDataProvider):
    provider_id = "holders.unconfigured"
    mode = SourceMode.REAL

    async def get_holders(
        self, chain: Chain, contract_address: str
    ) -> ProviderResult[HolderData | None]:
        return ProviderResult(
            data=None,
            source=self.provider_id,
            collected_at=datetime.now(UTC),
            quality=DataQuality.UNKNOWN,
            partial_errors=[
                ProviderError(
                    code="provider_unconfigured",
                    message="Holder provider is not configured in Sprint 1.",
                    retryable=False,
                )
            ],
            duration_ms=0,
            mode=self.mode,
        )


class LogOnlyAlertDeliveryProvider(AlertDeliveryProvider):
    provider_id = "demo.alert-log"
    mode = SourceMode.DEMO

    def __init__(self) -> None:
        self.log = get_logger(component="alert_delivery", provider=self.provider_id)

    async def deliver(
        self, *, alert_id: str, title: str, message: str, payload: dict[str, Any]
    ) -> ProviderResult[DeliveryReceipt]:
        started = perf_counter()
        self.log.info("demo_alert_not_delivered", alert_id=alert_id, title=title)
        return ProviderResult(
            data=DeliveryReceipt(accepted=False, destination="not-configured", external_id=None),
            source=self.provider_id,
            collected_at=datetime.now(UTC),
            quality=DataQuality.UNKNOWN,
            partial_errors=[
                ProviderError(
                    code="not_configured",
                    message="Telegram delivery is not configured",
                    retryable=False,
                )
            ],
            duration_ms=(perf_counter() - started) * 1000,
            mode=self.mode,
        )
