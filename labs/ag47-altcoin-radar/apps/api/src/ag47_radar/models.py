from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import uuid4

from sqlalchemy import (
    JSON,
    Boolean,
    CheckConstraint,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ag47_radar.db import Base, utc_now


def new_id() -> str:
    return str(uuid4())


class Token(Base):
    __tablename__ = "tokens"
    __table_args__ = (
        UniqueConstraint("chain", "contract_address", name="uq_tokens_chain_contract"),
        Index("ix_tokens_chain_symbol", "chain", "symbol"),
        Index("ix_tokens_first_seen_at", "first_seen_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    chain: Mapped[str] = mapped_column(String(24), nullable=False)
    contract_address: Mapped[str] = mapped_column(String(160), nullable=False)
    symbol: Mapped[str] = mapped_column(String(32), nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    decimals: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    first_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    metadata_json: Mapped[dict[str, Any]] = mapped_column("metadata", JSON, default=dict)
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    pairs: Mapped[list[TradingPair]] = relationship(
        back_populates="token", cascade="all, delete-orphan"
    )
    social_snapshots: Mapped[list[SocialSnapshot]] = relationship(
        back_populates="token", cascade="all, delete-orphan"
    )
    risk_assessments: Mapped[list[RiskAssessment]] = relationship(
        back_populates="token", cascade="all, delete-orphan"
    )
    opportunity_scores: Mapped[list[OpportunityScore]] = relationship(
        back_populates="token", cascade="all, delete-orphan"
    )
    alerts: Mapped[list[Alert]] = relationship(back_populates="token", cascade="all, delete-orphan")
    watchlist_entry: Mapped[WatchlistEntry | None] = relationship(
        back_populates="token", cascade="all, delete-orphan", uselist=False
    )
    events: Mapped[list[TokenEvent]] = relationship(
        back_populates="token", cascade="all, delete-orphan"
    )
    signals: Mapped[list[TokenSignal]] = relationship(
        back_populates="token", cascade="all, delete-orphan"
    )
    hypotheses: Mapped[list[TokenHypothesis]] = relationship(
        back_populates="token", cascade="all, delete-orphan"
    )
    truths: Mapped[list[TokenTruth]] = relationship(
        back_populates="token", cascade="all, delete-orphan"
    )
    knowledge: Mapped[list[TokenKnowledge]] = relationship(
        back_populates="token", cascade="all, delete-orphan"
    )


class TradingPair(Base):
    __tablename__ = "trading_pairs"
    __table_args__ = (
        UniqueConstraint("token_id", "pair_address", name="uq_pairs_token_address"),
        Index("ix_pairs_pair_address", "pair_address"),
        Index("ix_pairs_first_seen_at", "first_seen_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    pair_address: Mapped[str] = mapped_column(String(160), nullable=False)
    quote_token: Mapped[str] = mapped_column(String(64), nullable=False)
    dex: Mapped[str] = mapped_column(String(80), nullable=False)
    created_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    first_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    source_url: Mapped[str | None] = mapped_column(String(500))
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    token: Mapped[Token] = relationship(back_populates="pairs")
    market_snapshots: Mapped[list[MarketSnapshot]] = relationship(
        back_populates="pair", cascade="all, delete-orphan"
    )


class MarketSnapshot(Base):
    __tablename__ = "market_snapshots"
    __table_args__ = (
        CheckConstraint("price_usd IS NULL OR price_usd >= 0", name="price_nonnegative"),
        CheckConstraint(
            "liquidity_usd IS NULL OR liquidity_usd >= 0", name="liquidity_nonnegative"
        ),
        Index("ix_market_pair_captured", "pair_id", "captured_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    pair_id: Mapped[str] = mapped_column(
        ForeignKey("trading_pairs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    price_usd: Mapped[Decimal | None] = mapped_column(Numeric(38, 18))
    liquidity_usd: Mapped[Decimal | None] = mapped_column(Numeric(24, 2))
    volume_5m: Mapped[Decimal | None] = mapped_column(Numeric(24, 2))
    volume_1h: Mapped[Decimal | None] = mapped_column(Numeric(24, 2))
    volume_24h: Mapped[Decimal | None] = mapped_column(Numeric(24, 2))
    price_change_5m: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    price_change_1h: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    price_change_24h: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    market_cap: Mapped[Decimal | None] = mapped_column(Numeric(24, 2))
    fdv: Mapped[Decimal | None] = mapped_column(Numeric(24, 2))
    buyers: Mapped[int | None] = mapped_column(Integer)
    sellers: Mapped[int | None] = mapped_column(Integer)
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    data_quality: Mapped[str] = mapped_column(String(24), nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    pair: Mapped[TradingPair] = relationship(back_populates="market_snapshots")


class SocialSnapshot(Base):
    __tablename__ = "social_snapshots"
    __table_args__ = (
        CheckConstraint("members IS NULL OR members >= 0", name="members_nonnegative"),
        CheckConstraint(
            "engagement_rate IS NULL OR (engagement_rate >= 0 AND engagement_rate <= 1)",
            name="engagement_range",
        ),
        CheckConstraint(
            "repetition_rate IS NULL OR (repetition_rate >= 0 AND repetition_rate <= 1)",
            name="repetition_range",
        ),
        CheckConstraint(
            "estimated_bot_ratio IS NULL OR "
            "(estimated_bot_ratio >= 0 AND estimated_bot_ratio <= 1)",
            name="bot_ratio_range",
        ),
        Index("ix_social_token_platform_captured", "token_id", "platform", "captured_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[str] = mapped_column(String(40), nullable=False)
    members: Mapped[int | None] = mapped_column(Integer)
    member_growth_1h: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    member_growth_24h: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    messages_per_minute: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    unique_authors: Mapped[int | None] = mapped_column(Integer)
    participation_rate: Mapped[Decimal | None] = mapped_column(Numeric(8, 6))
    engagement_rate: Mapped[Decimal | None] = mapped_column(Numeric(8, 6))
    repetition_rate: Mapped[Decimal | None] = mapped_column(Numeric(8, 6))
    estimated_bot_ratio: Mapped[Decimal | None] = mapped_column(Numeric(8, 6))
    team_activity: Mapped[str | None] = mapped_column(String(40))
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    data_quality: Mapped[str] = mapped_column(String(24), nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    token: Mapped[Token] = relationship(back_populates="social_snapshots")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    __table_args__ = (
        CheckConstraint("risk_score >= 0 AND risk_score <= 10", name="risk_score_range"),
        CheckConstraint(
            "top_holders_percentage IS NULL OR "
            "(top_holders_percentage >= 0 AND top_holders_percentage <= 100)",
            name="top_holders_range",
        ),
        Index("ix_risk_token_captured", "token_id", "captured_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    risk_score: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    liquidity_lock_status: Mapped[str] = mapped_column(
        String(24), nullable=False, default="unknown"
    )
    top_holders_percentage: Mapped[Decimal | None] = mapped_column(Numeric(6, 3))
    deployer_percentage: Mapped[Decimal | None] = mapped_column(Numeric(6, 3))
    holders_count: Mapped[int | None] = mapped_column(Integer)
    owner_privileges: Mapped[str | None] = mapped_column(String(200))
    mintable: Mapped[bool | None] = mapped_column(Boolean)
    blacklist_capability: Mapped[bool | None] = mapped_column(Boolean)
    can_change_tax: Mapped[bool | None] = mapped_column(Boolean)
    buy_tax: Mapped[Decimal | None] = mapped_column(Numeric(8, 4))
    sell_tax: Mapped[Decimal | None] = mapped_column(Numeric(8, 4))
    proxy_contract: Mapped[bool | None] = mapped_column(Boolean)
    contract_age_days: Mapped[int | None] = mapped_column(Integer)
    honeypot_status: Mapped[str | None] = mapped_column(String(40))
    flags: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    data_quality: Mapped[str] = mapped_column(String(24), nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    token: Mapped[Token] = relationship(back_populates="risk_assessments")


class OpportunityScore(Base):
    __tablename__ = "opportunity_scores"
    __table_args__ = (
        CheckConstraint("momentum_score >= 0 AND momentum_score <= 10", name="momentum_range"),
        CheckConstraint("liquidity_score >= 0 AND liquidity_score <= 10", name="liquidity_range"),
        CheckConstraint("community_score >= 0 AND community_score <= 10", name="community_range"),
        CheckConstraint(
            "distribution_score >= 0 AND distribution_score <= 10", name="distribution_range"
        ),
        CheckConstraint("safety_score >= 0 AND safety_score <= 10", name="safety_range"),
        CheckConstraint(
            "data_quality_score >= 0 AND data_quality_score <= 10", name="data_quality_range"
        ),
        CheckConstraint("final_score >= 0 AND final_score <= 10", name="final_range"),
        CheckConstraint("confidence >= 0 AND confidence <= 1", name="confidence_range"),
        Index("ix_scores_token_calculated", "token_id", "calculated_at"),
        Index("ix_scores_final_calculated", "final_score", "calculated_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    momentum_score: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    liquidity_score: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    community_score: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    distribution_score: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    safety_score: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    data_quality_score: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    final_score: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    classification: Mapped[str] = mapped_column(String(40), nullable=False)
    confidence: Mapped[Decimal] = mapped_column(Numeric(5, 4), nullable=False)
    signals_available: Mapped[int] = mapped_column(Integer, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    positive_factors: Mapped[list[str]] = mapped_column(JSON, default=list)
    negative_factors: Mapped[list[str]] = mapped_column(JSON, default=list)
    critical_gate_applied: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    calculated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    scoring_version: Mapped[str] = mapped_column(String(32), nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    token: Mapped[Token] = relationship(back_populates="opportunity_scores")


class Alert(Base):
    __tablename__ = "alerts"
    __table_args__ = (UniqueConstraint("deduplication_key", "is_demo", name="uq_alert_dedup"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    type: Mapped[str] = mapped_column(String(64), nullable=False)
    severity: Mapped[str] = mapped_column(String(32), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    payload_json: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    deduplication_key: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)

    token: Mapped[Token] = relationship(back_populates="alerts")


class AlertRule(Base):
    __tablename__ = "alert_rules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    scope: Mapped[str] = mapped_column(String(20), nullable=False, default="global")
    token_id: Mapped[str | None] = mapped_column(ForeignKey("tokens.id"), nullable=True)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    source_kind: Mapped[str] = mapped_column(String(20), nullable=False)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    minimum_strength: Mapped[float | None] = mapped_column(Float, nullable=True)
    minimum_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    cooldown_minutes: Mapped[int] = mapped_column(default=60)
    rule_version: Mapped[str] = mapped_column(String(20), nullable=False)
    conditions: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now
    )


class TokenAlert(Base):
    __tablename__ = "token_alerts"
    __table_args__ = (UniqueConstraint("deduplication_key", name="uq_token_alert_dedup"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    rule_id: Mapped[str] = mapped_column(ForeignKey("alert_rules.id"), nullable=False)
    token_id: Mapped[str] = mapped_column(ForeignKey("tokens.id"), nullable=False)
    source_kind: Mapped[str] = mapped_column(String(20), nullable=False)
    source_id: Mapped[str] = mapped_column(String(36), nullable=False)
    severity: Mapped[float | None] = mapped_column(Float, nullable=True)
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="unread")

    triggered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    dismissed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    deduplication_key: Mapped[str] = mapped_column(String(64), nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)

    rule: Mapped[AlertRule] = relationship()
    token: Mapped[Token] = relationship()


class NotificationDelivery(Base):
    __tablename__ = "notification_deliveries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    alert_id: Mapped[str] = mapped_column(ForeignKey("token_alerts.id"), nullable=False)
    channel: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    provider_response: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now
    )

    alert: Mapped[TokenAlert] = relationship()


class WatchlistEntry(Base):
    __tablename__ = "watchlist_entries"
    __table_args__ = (UniqueConstraint("token_id", name="uq_watchlist_token"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    notes: Mapped[str | None] = mapped_column(String(1000))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )

    token: Mapped[Token] = relationship(back_populates="watchlist_entry")


class TokenEvent(Base):
    __tablename__ = "token_events"
    __table_args__ = (
        UniqueConstraint(
            "token_id",
            "event_type",
            "rule_version",
            "caused_by_hash",
            name="uq_token_events_idempotency",
        ),
        Index("ix_events_token_created", "token_id", "created_at"),
        Index("ix_events_type_created", "event_type", "created_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    event_type: Mapped[str] = mapped_column(String(80), nullable=False)
    rule_version: Mapped[str] = mapped_column(String(32), nullable=False, default="events-v1")
    metadata_json: Mapped[dict[str, Any]] = mapped_column("metadata", JSON, default=dict)
    caused_by: Mapped[list[str]] = mapped_column(JSON, default=list)
    caused_by_hash: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    token: Mapped[Token] = relationship(back_populates="events")


class TokenSignal(Base):
    __tablename__ = "token_signals"
    __table_args__ = (
        UniqueConstraint(
            "token_id",
            "signal_type",
            "rule_version",
            "caused_by_hash",
            name="uq_token_signals_idempotency",
        ),
        Index("ix_signals_token_created", "token_id", "created_at"),
        Index("ix_signals_type_created", "signal_type", "created_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    signal_type: Mapped[str] = mapped_column(String(80), nullable=False)
    strength: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    confidence: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    rule_version: Mapped[str] = mapped_column(String(32), nullable=False, default="signals-v1")
    metadata_json: Mapped[dict[str, Any]] = mapped_column("metadata", JSON, default=dict)
    caused_by: Mapped[list[str]] = mapped_column(JSON, default=list)
    caused_by_hash: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    token: Mapped[Token] = relationship(back_populates="signals")


class TokenKnowledge(Base):
    __tablename__ = "token_knowledge"
    __table_args__ = (Index("ix_knowledge_token_created", "token_id", "created_at"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    pattern_name: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    historical_occurrences: Mapped[int | None] = mapped_column(Integer, default=1)
    historical_confidence: Mapped[Decimal | None] = mapped_column(Numeric(5, 4))
    caused_by: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    token: Mapped[Token] = relationship(back_populates="knowledge")


class TokenHypothesis(Base):
    __tablename__ = "token_hypotheses"
    __table_args__ = (
        UniqueConstraint(
            "token_id",
            "hypothesis_type",
            "rule_version",
            "caused_by_hash",
            name="uq_token_hypotheses_idempotency",
        ),
        Index("ix_hypotheses_token_created", "token_id", "created_at"),
        Index("ix_hypotheses_type_created", "hypothesis_type", "created_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    hypothesis_type: Mapped[str] = mapped_column(String(80), nullable=False)
    confidence: Mapped[Decimal] = mapped_column(Numeric(4, 2), nullable=False)
    rule_version: Mapped[str] = mapped_column(String(32), nullable=False, default="hypotheses-v1")
    metadata_json: Mapped[dict[str, Any]] = mapped_column("metadata", JSON, default=dict)
    caused_by: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    caused_by_hash: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    token: Mapped[Token] = relationship(back_populates="hypotheses")
    truth: Mapped[TokenTruth | None] = relationship(back_populates="hypothesis", uselist=False)


class GlobalKnowledge(Base):
    __tablename__ = "global_knowledge"
    __table_args__ = (
        UniqueConstraint(
            "pattern_name",
            "validation_window",
            "market_regime",
            "chain",
            name="uq_global_knowledge_context",
        ),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    pattern_name: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    # Context dimensions
    market_regime: Mapped[str] = mapped_column(String(32), nullable=False, default="all")
    chain: Mapped[str] = mapped_column(String(32), nullable=False, default="all")

    total_occurrences: Mapped[int] = mapped_column(Integer, default=0)
    success_count: Mapped[int] = mapped_column(Integer, default=0)
    failure_count: Mapped[int] = mapped_column(Integer, default=0)
    neutral_count: Mapped[int] = mapped_column(Integer, default=0)
    historical_confidence: Mapped[Decimal] = mapped_column(Numeric(5, 4), default=Decimal("0.0000"))
    validation_window: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )


class TokenTruth(Base):
    __tablename__ = "token_truths"
    __table_args__ = (
        Index("ix_truths_token_created", "token_id", "created_at"),
        UniqueConstraint("hypothesis_id", name="uq_token_truths_hypothesis"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    token_id: Mapped[str] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"), nullable=False, index=True
    )
    hypothesis_id: Mapped[str] = mapped_column(
        ForeignKey("token_hypotheses.id", ondelete="CASCADE"), nullable=False, index=True
    )

    expected_outcome: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    observed_outcome: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)

    gain: Mapped[float | None] = mapped_column(Float, nullable=True)
    loss: Mapped[float | None] = mapped_column(Float, nullable=True)
    accuracy_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    # success, partial, failure, neutral
    status: Mapped[str] = mapped_column(String(20), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    token: Mapped[Token] = relationship(back_populates="truths")
    hypothesis: Mapped[TokenHypothesis] = relationship(back_populates="truth")
