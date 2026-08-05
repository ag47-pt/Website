from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from ag47_radar.enums import Chain, DataQuality, SourceMode


class ProviderModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ProviderError(ProviderModel):
    code: str
    message: str
    retryable: bool = False


class ProviderResult[T](ProviderModel):
    data: T
    source: str
    collected_at: datetime
    quality: DataQuality
    partial_errors: list[ProviderError] = Field(default_factory=list)
    duration_ms: float = Field(ge=0)
    mode: SourceMode
    from_cache: bool = False


class DiscoveredPair(ProviderModel):
    chain: Chain
    contract_address: str
    token_name: str
    token_symbol: str
    decimals: int | None = None
    pair_address: str
    quote_token: str
    dex: str
    pair_created_at: datetime | None = None
    source_url: str | None = None


class MarketPairData(ProviderModel):
    chain: Chain
    contract_address: str
    token_name: str
    token_symbol: str
    pair_address: str
    quote_token: str
    dex: str
    pair_created_at: datetime | None = None
    source_url: str | None = None
    price_usd: float | None = None
    liquidity_usd: float | None = None
    volume_5m: float | None = None
    volume_1h: float | None = None
    volume_24h: float | None = None
    price_change_5m: float | None = None
    price_change_1h: float | None = None
    price_change_24h: float | None = None
    market_cap: float | None = None
    fdv: float | None = None
    buyers: int | None = None
    sellers: int | None = None


class BlockchainTokenData(ProviderModel):
    chain: Chain
    contract_address: str
    decimals: int | None = None
    total_supply: float | None = None
    contract_created_at: datetime | None = None


class HolderData(ProviderModel):
    chain: Chain
    contract_address: str
    holders_count: int | None = None
    top_holders_percentage: float | None = None
    deployer_percentage: float | None = None


class ContractRiskData(ProviderModel):
    chain: Chain
    contract_address: str
    risk_score: float = Field(ge=0, le=10)
    liquidity_lock_status: str = "unknown"
    top_holders_percentage: float | None = None
    deployer_percentage: float | None = None
    holders_count: int | None = None
    owner_privileges: str | None = None
    mintable: bool | None = None
    blacklist_capability: bool | None = None
    can_change_tax: bool | None = None
    buy_tax: float | None = None
    sell_tax: float | None = None
    proxy_contract: bool | None = None
    contract_age_days: int | None = None
    honeypot_status: str | None = None
    flags: list[dict[str, Any]] = Field(default_factory=list)


class SocialData(ProviderModel):
    token_id: str
    platform: str
    members: int | None = None
    member_growth_1h: float | None = None
    member_growth_24h: float | None = None
    messages_per_minute: float | None = None
    unique_authors: int | None = None
    participation_rate: float | None = None
    engagement_rate: float | None = None
    repetition_rate: float | None = None
    estimated_bot_ratio: float | None = None
    team_activity: str | None = None


class DeliveryReceipt(ProviderModel):
    accepted: bool
    destination: str
    external_id: str | None = None


class PairDiscoveryProvider(ABC):
    provider_id: str
    mode: SourceMode

    @abstractmethod
    async def discover(
        self, chains: list[Chain], *, limit: int = 20
    ) -> ProviderResult[list[DiscoveredPair]]: ...


class MarketDataProvider(ABC):
    provider_id: str
    mode: SourceMode

    @abstractmethod
    async def search(
        self, query: str, chains: list[Chain] | None = None, *, limit: int = 20
    ) -> ProviderResult[list[MarketPairData]]: ...

    @abstractmethod
    async def get_pair(
        self, chain: Chain, pair_address: str
    ) -> ProviderResult[MarketPairData | None]: ...


class BlockchainDataProvider(ABC):
    provider_id: str
    mode: SourceMode

    @abstractmethod
    async def get_token(
        self, chain: Chain, contract_address: str
    ) -> ProviderResult[BlockchainTokenData | None]: ...


class HolderDataProvider(ABC):
    provider_id: str
    mode: SourceMode

    @abstractmethod
    async def get_holders(
        self, chain: Chain, contract_address: str
    ) -> ProviderResult[HolderData | None]: ...


class ContractRiskProvider(ABC):
    provider_id: str
    mode: SourceMode

    @abstractmethod
    async def assess(
        self, chain: Chain, contract_address: str, *, token_id: str | None = None
    ) -> ProviderResult[ContractRiskData | None]: ...


class SocialDataProvider(ABC):
    provider_id: str
    mode: SourceMode

    @abstractmethod
    async def collect(self, token_id: str) -> ProviderResult[SocialData | None]: ...


class AlertDeliveryProvider(ABC):
    provider_id: str
    mode: SourceMode

    @abstractmethod
    async def deliver(
        self, *, alert_id: str, title: str, message: str, payload: dict[str, Any]
    ) -> ProviderResult[DeliveryReceipt]: ...
