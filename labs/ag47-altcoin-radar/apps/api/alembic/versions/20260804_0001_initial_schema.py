"""Initial Sprint 1 schema.

Revision ID: 20260804_0001
Revises: None
Create Date: 2026-08-04
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260804_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "tokens",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("chain", sa.String(length=24), nullable=False),
        sa.Column("contract_address", sa.String(length=160), nullable=False),
        sa.Column("symbol", sa.String(length=32), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("decimals", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_tokens"),
        sa.UniqueConstraint("chain", "contract_address", name="uq_tokens_chain_contract"),
    )
    op.create_index("ix_tokens_chain_symbol", "tokens", ["chain", "symbol"])
    op.create_index("ix_tokens_first_seen_at", "tokens", ["first_seen_at"])

    op.create_table(
        "trading_pairs",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("token_id", sa.String(length=36), nullable=False),
        sa.Column("pair_address", sa.String(length=160), nullable=False),
        sa.Column("quote_token", sa.String(length=64), nullable=False),
        sa.Column("dex", sa.String(length=80), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("source_url", sa.String(length=500), nullable=True),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(
            ["token_id"], ["tokens.id"], name="fk_pairs_token", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_trading_pairs"),
        sa.UniqueConstraint("token_id", "pair_address", name="uq_pairs_token_address"),
    )
    op.create_index("ix_trading_pairs_token_id", "trading_pairs", ["token_id"])
    op.create_index("ix_pairs_pair_address", "trading_pairs", ["pair_address"])
    op.create_index("ix_pairs_first_seen_at", "trading_pairs", ["first_seen_at"])

    op.create_table(
        "market_snapshots",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("pair_id", sa.String(length=36), nullable=False),
        sa.Column("price_usd", sa.Numeric(38, 18), nullable=True),
        sa.Column("liquidity_usd", sa.Numeric(24, 2), nullable=True),
        sa.Column("volume_5m", sa.Numeric(24, 2), nullable=True),
        sa.Column("volume_1h", sa.Numeric(24, 2), nullable=True),
        sa.Column("volume_24h", sa.Numeric(24, 2), nullable=True),
        sa.Column("price_change_5m", sa.Numeric(12, 4), nullable=True),
        sa.Column("price_change_1h", sa.Numeric(12, 4), nullable=True),
        sa.Column("price_change_24h", sa.Numeric(12, 4), nullable=True),
        sa.Column("market_cap", sa.Numeric(24, 2), nullable=True),
        sa.Column("fdv", sa.Numeric(24, 2), nullable=True),
        sa.Column("buyers", sa.Integer(), nullable=True),
        sa.Column("sellers", sa.Integer(), nullable=True),
        sa.Column("captured_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("data_quality", sa.String(length=24), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.CheckConstraint(
            "price_usd IS NULL OR price_usd >= 0", name="ck_market_price_nonnegative"
        ),
        sa.CheckConstraint(
            "liquidity_usd IS NULL OR liquidity_usd >= 0",
            name="ck_market_liquidity_nonnegative",
        ),
        sa.ForeignKeyConstraint(
            ["pair_id"], ["trading_pairs.id"], name="fk_market_pair", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_market_snapshots"),
    )
    op.create_index("ix_market_snapshots_pair_id", "market_snapshots", ["pair_id"])
    op.create_index("ix_market_pair_captured", "market_snapshots", ["pair_id", "captured_at"])

    op.create_table(
        "social_snapshots",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("token_id", sa.String(length=36), nullable=False),
        sa.Column("platform", sa.String(length=40), nullable=False),
        sa.Column("members", sa.Integer(), nullable=True),
        sa.Column("member_growth_1h", sa.Numeric(12, 4), nullable=True),
        sa.Column("member_growth_24h", sa.Numeric(12, 4), nullable=True),
        sa.Column("messages_per_minute", sa.Numeric(12, 4), nullable=True),
        sa.Column("unique_authors", sa.Integer(), nullable=True),
        sa.Column("participation_rate", sa.Numeric(8, 6), nullable=True),
        sa.Column("engagement_rate", sa.Numeric(8, 6), nullable=True),
        sa.Column("repetition_rate", sa.Numeric(8, 6), nullable=True),
        sa.Column("estimated_bot_ratio", sa.Numeric(8, 6), nullable=True),
        sa.Column("team_activity", sa.String(length=40), nullable=True),
        sa.Column("captured_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("data_quality", sa.String(length=24), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.CheckConstraint("members IS NULL OR members >= 0", name="ck_social_members_nonnegative"),
        sa.CheckConstraint(
            "engagement_rate IS NULL OR (engagement_rate >= 0 AND engagement_rate <= 1)",
            name="ck_social_engagement_range",
        ),
        sa.CheckConstraint(
            "repetition_rate IS NULL OR (repetition_rate >= 0 AND repetition_rate <= 1)",
            name="ck_social_repetition_range",
        ),
        sa.CheckConstraint(
            "estimated_bot_ratio IS NULL OR "
            "(estimated_bot_ratio >= 0 AND estimated_bot_ratio <= 1)",
            name="ck_social_bot_ratio_range",
        ),
        sa.ForeignKeyConstraint(
            ["token_id"], ["tokens.id"], name="fk_social_token", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_social_snapshots"),
    )
    op.create_index("ix_social_snapshots_token_id", "social_snapshots", ["token_id"])
    op.create_index(
        "ix_social_token_platform_captured",
        "social_snapshots",
        ["token_id", "platform", "captured_at"],
    )

    op.create_table(
        "risk_assessments",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("token_id", sa.String(length=36), nullable=False),
        sa.Column("risk_score", sa.Numeric(4, 2), nullable=False),
        sa.Column("liquidity_lock_status", sa.String(length=24), nullable=False),
        sa.Column("top_holders_percentage", sa.Numeric(6, 3), nullable=True),
        sa.Column("deployer_percentage", sa.Numeric(6, 3), nullable=True),
        sa.Column("holders_count", sa.Integer(), nullable=True),
        sa.Column("owner_privileges", sa.String(length=200), nullable=True),
        sa.Column("mintable", sa.Boolean(), nullable=True),
        sa.Column("blacklist_capability", sa.Boolean(), nullable=True),
        sa.Column("can_change_tax", sa.Boolean(), nullable=True),
        sa.Column("buy_tax", sa.Numeric(8, 4), nullable=True),
        sa.Column("sell_tax", sa.Numeric(8, 4), nullable=True),
        sa.Column("proxy_contract", sa.Boolean(), nullable=True),
        sa.Column("contract_age_days", sa.Integer(), nullable=True),
        sa.Column("honeypot_status", sa.String(length=40), nullable=True),
        sa.Column("flags", sa.JSON(), nullable=False),
        sa.Column("captured_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("data_quality", sa.String(length=24), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.CheckConstraint("risk_score >= 0 AND risk_score <= 10", name="ck_risk_score_range"),
        sa.CheckConstraint(
            "top_holders_percentage IS NULL OR "
            "(top_holders_percentage >= 0 AND top_holders_percentage <= 100)",
            name="ck_risk_top_holders_range",
        ),
        sa.ForeignKeyConstraint(
            ["token_id"], ["tokens.id"], name="fk_risk_token", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_risk_assessments"),
    )
    op.create_index("ix_risk_assessments_token_id", "risk_assessments", ["token_id"])
    op.create_index("ix_risk_token_captured", "risk_assessments", ["token_id", "captured_at"])

    op.create_table(
        "opportunity_scores",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("token_id", sa.String(length=36), nullable=False),
        sa.Column("momentum_score", sa.Numeric(4, 2), nullable=False),
        sa.Column("liquidity_score", sa.Numeric(4, 2), nullable=False),
        sa.Column("community_score", sa.Numeric(4, 2), nullable=False),
        sa.Column("distribution_score", sa.Numeric(4, 2), nullable=False),
        sa.Column("safety_score", sa.Numeric(4, 2), nullable=False),
        sa.Column("data_quality_score", sa.Numeric(4, 2), nullable=False),
        sa.Column("final_score", sa.Numeric(4, 2), nullable=False),
        sa.Column("classification", sa.String(length=40), nullable=False),
        sa.Column("confidence", sa.Numeric(5, 4), nullable=False),
        sa.Column("signals_available", sa.Integer(), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        sa.Column("positive_factors", sa.JSON(), nullable=False),
        sa.Column("negative_factors", sa.JSON(), nullable=False),
        sa.Column("critical_gate_applied", sa.Boolean(), nullable=False),
        sa.Column("calculated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("scoring_version", sa.String(length=32), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.CheckConstraint("momentum_score BETWEEN 0 AND 10", name="ck_score_momentum_range"),
        sa.CheckConstraint("liquidity_score BETWEEN 0 AND 10", name="ck_score_liquidity_range"),
        sa.CheckConstraint("community_score BETWEEN 0 AND 10", name="ck_score_community_range"),
        sa.CheckConstraint(
            "distribution_score BETWEEN 0 AND 10", name="ck_score_distribution_range"
        ),
        sa.CheckConstraint("safety_score BETWEEN 0 AND 10", name="ck_score_safety_range"),
        sa.CheckConstraint(
            "data_quality_score BETWEEN 0 AND 10", name="ck_score_data_quality_range"
        ),
        sa.CheckConstraint("final_score BETWEEN 0 AND 10", name="ck_score_final_range"),
        sa.CheckConstraint("confidence BETWEEN 0 AND 1", name="ck_score_confidence_range"),
        sa.ForeignKeyConstraint(
            ["token_id"], ["tokens.id"], name="fk_score_token", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_opportunity_scores"),
    )
    op.create_index("ix_opportunity_scores_token_id", "opportunity_scores", ["token_id"])
    op.create_index(
        "ix_scores_token_calculated", "opportunity_scores", ["token_id", "calculated_at"]
    )
    op.create_index(
        "ix_scores_final_calculated", "opportunity_scores", ["final_score", "calculated_at"]
    )

    op.create_table(
        "alerts",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("token_id", sa.String(length=36), nullable=False),
        sa.Column("type", sa.String(length=64), nullable=False),
        sa.Column("severity", sa.String(length=32), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("deduplication_key", sa.String(length=200), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("acknowledged_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(
            ["token_id"], ["tokens.id"], name="fk_alert_token", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_alerts"),
    )
    op.create_index("ix_alerts_token_id", "alerts", ["token_id"])
    op.create_index("ix_alerts_created_at", "alerts", ["created_at"])
    op.create_index("ix_alerts_token_created", "alerts", ["token_id", "created_at"])
    op.create_index("ix_alerts_dedupe_created", "alerts", ["deduplication_key", "created_at"])

    op.create_table(
        "watchlist_entries",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("token_id", sa.String(length=36), nullable=False),
        sa.Column("notes", sa.String(length=1000), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["token_id"], ["tokens.id"], name="fk_watchlist_token", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_watchlist_entries"),
        sa.UniqueConstraint("token_id", name="uq_watchlist_token"),
    )
    op.create_index("ix_watchlist_entries_token_id", "watchlist_entries", ["token_id"])


def downgrade() -> None:
    op.drop_table("watchlist_entries")
    op.drop_table("alerts")
    op.drop_table("opportunity_scores")
    op.drop_table("risk_assessments")
    op.drop_table("social_snapshots")
    op.drop_table("market_snapshots")
    op.drop_table("trading_pairs")
    op.drop_table("tokens")
