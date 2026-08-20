"""bound durable notification retries

Revision ID: f260820a02
Revises: f260820a01
Create Date: 2026-08-20
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "f260820a02"
down_revision: str | Sequence[str] | None = "f260820a01"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "job_runs",
        sa.Column(
            "notification_pending",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )
    op.add_column(
        "job_runs",
        sa.Column("notification_next_attempt_at", sa.DateTime(timezone=True)),
    )
    op.execute(
        sa.text(
            """
            UPDATE job_runs
            SET notification_pending = true,
                notification_next_attempt_at = CURRENT_TIMESTAMP
            WHERE job_name = 'market-ingestion'
              AND status = 'succeeded'
              AND CAST(summary AS TEXT) LIKE '%pending_confirmed_alerts%'
            """
        )
    )
    op.create_index(
        "ix_job_runs_notification_due",
        "job_runs",
        ["job_name", "notification_pending", "notification_next_attempt_at"],
        unique=False,
    )

    op.execute(
        sa.text(
            """
            DELETE FROM notification_deliveries
            WHERE id IN (
                SELECT id
                FROM (
                    SELECT
                        id,
                        ROW_NUMBER() OVER (
                            PARTITION BY alert_id, channel
                            ORDER BY
                                CASE status
                                    WHEN 'success' THEN 0
                                    WHEN 'dead' THEN 1
                                    WHEN 'sending' THEN 2
                                    WHEN 'pending' THEN 3
                                    ELSE 4
                                END,
                                attempts DESC,
                                created_at DESC,
                                id DESC
                        ) AS duplicate_rank
                    FROM notification_deliveries
                ) AS ranked_deliveries
                WHERE duplicate_rank > 1
            )
            """
        )
    )
    op.create_index(
        "uq_notification_deliveries_alert_channel",
        "notification_deliveries",
        ["alert_id", "channel"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        "uq_notification_deliveries_alert_channel",
        table_name="notification_deliveries",
    )
    op.drop_index("ix_job_runs_notification_due", table_name="job_runs")
    op.drop_column("job_runs", "notification_next_attempt_at")
    op.drop_column("job_runs", "notification_pending")
