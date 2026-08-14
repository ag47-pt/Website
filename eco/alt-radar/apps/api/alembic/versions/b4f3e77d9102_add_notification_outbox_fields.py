"""add notification outbox fields

Revision ID: b4f3e77d9102
Revises: 534ff548f3d4
Create Date: 2026-08-14
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "b4f3e77d9102"
down_revision: str | Sequence[str] | None = "534ff548f3d4"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "notification_deliveries",
        sa.Column("attempts", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "notification_deliveries",
        sa.Column(
            "next_attempt_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.add_column("notification_deliveries", sa.Column("locked_at", sa.DateTime(timezone=True)))
    op.create_index(
        "ix_notification_deliveries_pending",
        "notification_deliveries",
        ["status", "next_attempt_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_notification_deliveries_pending", table_name="notification_deliveries")
    op.drop_column("notification_deliveries", "locked_at")
    op.drop_column("notification_deliveries", "next_attempt_at")
    op.drop_column("notification_deliveries", "attempts")
