from __future__ import annotations

from datetime import datetime
from typing import Annotated, Any, Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, StringConstraints, model_validator

from ag47_radar.enums import (
    AlertSeverity,
    AlertType,
    Chain,
    DataQuality,
    LiquidityLockStatus,
    OpportunityClassification,
    ProviderStatus,
    RiskSignalLevel,
    SourceMode,
)

TokenId = Annotated[str, StringConstraints(min_length=36, max_length=36)]


class ApiModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="forbid")


class ErrorDetail(ApiModel):
    code: str
    message: str
    request_id: str
    details: dict[str, Any] | None = None


class ErrorResponse(ApiModel):
    error: ErrorDetail


class PaginatedResponse[T](ApiModel):
    items: list[T]
    page: int = Field(ge=1)
    page_size: int = Field(ge=1)
    total: int = Field(ge=0)
    pages: int = Field(ge=0)
    demo_mode: bool
    partial: bool = False
    stale: bool = False


class HealthResponse(ApiModel):
    status: Literal["ok", "degraded"]
    service: str
    version: str
    database: Literal["connected", "unavailable"]
    demo_mode: bool
    read_only: Literal[True] = True
    time: datetime


class ProviderStatusRead(ApiModel):
    id: str
    name: str
    kind: str
    status: ProviderStatus
    mode: SourceMode
    last_checked_at: datetime | None = None
    detail: str | None = None


class EvolutionStatusRead(ApiModel):
    phase: str
    phase_title: str
    now: str
    completed_steps: int
    total_steps: int
    goal: str


class SystemCalibrationResponse(ApiModel):
    scoring_version: str
    base_weights: dict[str, float]
    calibrated_weights: dict[str, float]
    sample_count: int
    correlation: float | None
    generated_at: datetime


class ReactionRead(ApiModel):
    return_1m: float | None
    return_5m: float | None
    return_15m: float | None
    return_30m: float | None


class StructureRead(ApiModel):
    held_above_entry: bool
    pullback_strength: str
    continuation: bool
    fake_move: bool
    intent_type: str
    strength_score: float


class MicrostructureResponse(ApiModel):
    token_id: str
    priority_tier: Literal["Tier 1", "Tier 2", "Tier 3"]
    tracking_frequency_minutes: int
    reaction: ReactionRead
    structure: StructureRead
    evaluated_at: datetime


class SystemMetrics(ApiModel):
    tokens_monitored: int
    alerts_today: int
    strong_opportunities: int
    average_score: float | None
    active_providers: int


class SystemStatusResponse(ApiModel):
    status: Literal["operational", "degraded"]
    demo_mode: bool
    monitoring_active: bool
    read_only: Literal[True] = True
    database: Literal["connected", "unavailable"]
    last_sync_at: datetime | None
    generated_at: datetime
    metrics: SystemMetrics
    providers: list[ProviderStatusRead]


class TokenRead(ApiModel):
    id: str
    chain: Chain
    contract_address: str
    symbol: str
    name: str
    decimals: int | None
    created_at: datetime
    first_seen_at: datetime
    metadata: dict[str, Any] = Field(
        default_factory=dict,
        validation_alias=AliasChoices("metadata_json", "metadata"),
    )
    source: str
    is_demo: bool


class TradingPairRead(ApiModel):
    id: str
    token_id: str
    pair_address: str
    quote_token: str
    dex: str
    created_at: datetime | None
    first_seen_at: datetime
    source: str
    source_url: str | None
    is_demo: bool


class MarketSnapshotRead(ApiModel):
    id: str
    pair_id: str
    price_usd: float | None
    liquidity_usd: float | None
    volume_5m: float | None
    volume_1h: float | None
    volume_24h: float | None
    price_change_5m: float | None
    price_change_1h: float | None
    price_change_24h: float | None
    market_cap: float | None
    fdv: float | None
    buyers: int | None
    sellers: int | None
    captured_at: datetime
    source: str
    data_quality: DataQuality
    is_demo: bool


class SocialSnapshotRead(ApiModel):
    id: str
    token_id: str
    platform: str
    members: int | None
    member_growth_1h: float | None
    member_growth_24h: float | None
    messages_per_minute: float | None
    unique_authors: int | None
    participation_rate: float | None
    engagement_rate: float | None
    repetition_rate: float | None
    estimated_bot_ratio: float | None
    team_activity: str | None
    captured_at: datetime
    source: str
    data_quality: DataQuality
    is_demo: bool


class RiskFlagRead(ApiModel):
    code: str
    label: str
    level: RiskSignalLevel
    description: str | None = None


class RiskAssessmentRead(ApiModel):
    id: str
    token_id: str
    risk_score: float
    liquidity_lock_status: LiquidityLockStatus
    top_holders_percentage: float | None
    deployer_percentage: float | None
    holders_count: int | None
    owner_privileges: str | None
    mintable: bool | None
    blacklist_capability: bool | None
    can_change_tax: bool | None
    buy_tax: float | None
    sell_tax: float | None
    proxy_contract: bool | None
    contract_age_days: int | None
    honeypot_status: str | None
    flags: list[RiskFlagRead]
    captured_at: datetime
    source: str
    data_quality: DataQuality
    is_demo: bool
    critical_flags: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def derive_critical_flags(self) -> RiskAssessmentRead:
        self.critical_flags = [
            flag.code for flag in self.flags if flag.level == RiskSignalLevel.CRITICAL
        ]
        return self


class OpportunityScoreRead(ApiModel):
    id: str
    token_id: str
    momentum_score: float
    liquidity_score: float
    community_score: float
    distribution_score: float
    safety_score: float
    data_quality_score: float
    final_score: float
    classification: OpportunityClassification
    confidence: float
    signals_available: int
    explanation: str
    positive_factors: list[str]
    negative_factors: list[str]
    critical_gate_applied: bool
    calculated_at: datetime
    scoring_version: str
    is_demo: bool


class OpportunityRiskSummary(ApiModel):
    risk_score: float
    critical_flags: list[str]
    captured_at: datetime
    source: str
    data_quality: DataQuality
    is_demo: bool


class OpportunityItem(ApiModel):
    token: TokenRead
    pair: TradingPairRead
    market: MarketSnapshotRead | None
    risk: OpportunityRiskSummary | None
    score: OpportunityScoreRead | None
    holders_count: int | None
    watchlisted: bool
    updated_at: datetime


class TokenDetailResponse(ApiModel):
    token: TokenRead
    pairs: list[TradingPairRead]
    latest_market: MarketSnapshotRead | None
    latest_social: SocialSnapshotRead | None
    latest_risk: RiskAssessmentRead | None
    latest_score: OpportunityScoreRead | None
    watchlisted: bool
    data_mode: SourceMode


HistoryInterval = Literal["1h", "6h", "24h", "7d", "30d"]


class MarketHistoryPoint(ApiModel):
    captured_at: datetime
    price_usd: float | None
    volume_usd: float | None
    liquidity_usd: float | None
    source: str
    data_quality: DataQuality


class MarketHistoryResponse(ApiModel):
    token_id: str
    pair_id: str | None
    interval: HistoryInterval
    points: list[MarketHistoryPoint]
    demo_mode: bool


class SocialResponse(ApiModel):
    token_id: str
    latest: SocialSnapshotRead | None
    timeline: list[SocialSnapshotRead]
    demo_mode: bool


class AlertRead(ApiModel):
    id: str
    token_id: str
    token_symbol: str
    type: AlertType
    severity: AlertSeverity
    title: str
    message: str
    payload: dict[str, Any] = Field(
        default_factory=dict,
        validation_alias=AliasChoices("payload_json", "payload"),
    )
    deduplication_key: str
    created_at: datetime
    acknowledged_at: datetime | None = None
    is_demo: bool = False


class AlertRuleBase(BaseModel):
    name: str = Field(..., max_length=100)
    scope: str = Field(default="global", max_length=20)
    token_id: str | None = None
    enabled: bool = True
    source_kind: str = Field(..., max_length=20)
    source_type: str = Field(..., max_length=50)
    minimum_strength: float | None = None
    minimum_confidence: float | None = None
    cooldown_minutes: int = 60
    conditions: dict[str, Any] | None = None


class AlertRuleCreate(AlertRuleBase):
    pass


class AlertRuleUpdate(BaseModel):
    name: str | None = Field(None, max_length=100)
    enabled: bool | None = None
    minimum_strength: float | None = None
    minimum_confidence: float | None = None
    cooldown_minutes: int | None = None
    conditions: dict[str, Any] | None = None


class AlertRuleRead(AlertRuleBase):
    id: str
    rule_version: str
    created_at: datetime
    updated_at: datetime


class TokenAlertRead(BaseModel):
    id: str
    rule_id: str
    token_id: str
    token_symbol: str | None = None
    source_kind: str
    source_id: str
    severity: float | None = None
    confidence: float | None = None
    status: str
    triggered_at: datetime
    read_at: datetime | None = None
    acknowledged_at: datetime | None = None
    dismissed_at: datetime | None = None
    deduplication_key: str
    is_demo: bool = False


class TokenAlertUpdate(BaseModel):
    status: Literal["unread", "read", "acknowledged", "dismissed"]


class NotificationDeliveryRead(ApiModel):
    id: str
    alert_id: str
    channel: str
    recipient: str
    status: str
    sent_at: datetime | None = None
    error: str | None = None


class WatchlistCreate(ApiModel):
    token_id: TokenId = Field(examples=["10000000-0000-4000-8000-000000000001"])
    notes: Annotated[str, StringConstraints(strip_whitespace=True, max_length=1000)] | None = Field(
        default=None, examples=["Rever após a próxima atualização."]
    )


class WatchlistRead(ApiModel):
    id: str
    token_id: str
    notes: str | None
    created_at: datetime
    token: TokenRead
    latest_score: OpportunityScoreRead | None
    latest_market: MarketSnapshotRead | None


class ScoreComponentsInput(ApiModel):
    momentum_score: float | None = Field(default=None, ge=0, le=10)
    liquidity_score: float | None = Field(default=None, ge=0, le=10)
    community_score: float | None = Field(default=None, ge=0, le=10)
    distribution_score: float | None = Field(default=None, ge=0, le=10)
    safety_score: float | None = Field(default=None, ge=0, le=10)
    data_quality_score: float | None = Field(default=None, ge=0, le=10)


class ScoreCalculationResult(ApiModel):
    momentum_score: float
    liquidity_score: float
    community_score: float
    distribution_score: float
    safety_score: float
    data_quality_score: float
    final_score: float
    classification: OpportunityClassification
    confidence: float
    signals_available: int
    explanation: str
    positive_factors: list[str]
    negative_factors: list[str]
    critical_gate_applied: bool
    scoring_version: str


class ProviderErrorRead(ApiModel):
    code: str
    message: str
    retryable: bool


class ProviderResultMeta(ApiModel):
    source: str
    mode: SourceMode
    collected_at: datetime
    quality: DataQuality
    partial_errors: list[ProviderErrorRead]
    duration_ms: float
    from_cache: bool = False


class EvidenceNode(ApiModel):
    kind: Literal["snapshot", "event", "signal", "hypothesis", "knowledge"]
    id: str | None = None
    type: str
    description: str | None = None
    timestamp: datetime | None = None


class TimelineItemBase(ApiModel):
    id: str
    kind: Literal["event", "signal", "hypothesis"]
    type: str
    occurred_at: datetime
    title: str
    description: str
    rule_version: str
    caused_by: list[EvidenceNode] | list[str]


class TimelineEventRead(TimelineItemBase):
    kind: Literal["event"] = "event"
    severity: float | None = None
    strength: float | None = None
    confidence: float | None = None


class TimelineSignalRead(TimelineItemBase):
    kind: Literal["signal"] = "signal"
    strength: float
    confidence: float


class TokenHypothesisRead(TimelineItemBase):
    kind: Literal["hypothesis"] = "hypothesis"
    confidence: float
    metadata_json: dict[str, Any] = Field(
        default_factory=dict,
        validation_alias=AliasChoices("metadata_json", "metadata"),
    )


TimelineItem = Annotated[
    TimelineEventRead | TimelineSignalRead | TokenHypothesisRead, Field(discriminator="kind")
]


class GlobalKnowledgeRead(ApiModel):
    id: str
    pattern_name: str
    description: str
    market_regime: str
    chain: str
    total_occurrences: int
    success_count: int
    failure_count: int
    neutral_count: int
    historical_confidence: float
    validation_window: str
    created_at: datetime
    updated_at: datetime


class TokenTruthRead(ApiModel):
    id: str
    token_id: str
    hypothesis_id: str
    expected_outcome: dict[str, Any]
    observed_outcome: dict[str, Any]
    gain: float | None
    loss: float | None
    accuracy_score: float | None
    status: str
    created_at: datetime


class TruthSummaryRead(ApiModel):
    total_validated: int
    success_count: int
    failure_count: int
    neutral_count: int
    hit_rate_pct: float
    avg_gain_pct: float
    avg_drawdown_pct: float


class ActionableInsightRead(ApiModel):
    action: Literal["buy_watch", "monitor", "caution", "avoid"]
    reason: str
    empirical_confidence: float
    risk_level: str
    historical_hit_rate_pct: float | None = None


class BucketPerformanceRead(ApiModel):
    bucket_label: str
    min_score: float
    max_score: float
    total_samples: int
    success_count: int
    win_rate_pct: float
    avg_return_pct: float
    avg_drawdown_pct: float
    profit_factor: float
    is_statistically_profitable: bool


class ConfidenceBucketRead(ApiModel):
    bucket_label: str
    min_confidence: float
    max_confidence: float
    total_samples: int
    win_rate_pct: float
    avg_return_pct: float
    avg_drawdown_pct: float
    calibration_delta: float


class DrawdownDistributionRead(ApiModel):
    max_drawdown_overall_pct: float
    drawdown_p50_pct: float
    drawdown_p90_pct: float
    win_to_drawdown_ratio: float


class EdgeZoneRead(ApiModel):
    optimal_score_min: float
    optimal_confidence_min: float
    in_sample_win_rate_pct: float
    out_of_sample_win_rate_pct: float
    avg_expected_return_pct: float
    avg_max_drawdown_pct: float
    is_edge_verified: bool
    edge_verdict: str


class EdgeAnalysisRead(ApiModel):
    evaluated_at: datetime
    total_hypotheses_evaluated: int
    score_buckets: list[BucketPerformanceRead]
    confidence_buckets: list[ConfidenceBucketRead]
    drawdown_profile: DrawdownDistributionRead
    optimal_edge_zone: EdgeZoneRead
    demo_mode: bool
