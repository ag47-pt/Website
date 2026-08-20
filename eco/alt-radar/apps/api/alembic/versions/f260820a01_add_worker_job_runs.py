"""add durable worker job runs

Revision ID: f260820a01
Revises: b4f3e77d9102
Create Date: 2026-08-20
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "f260820a01"
down_revision: str | Sequence[str] | None = "b4f3e77d9102"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "job_runs",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("job_name", sa.String(length=80), nullable=False),
        sa.Column("run_key", sa.String(length=160), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("summary", sa.JSON(), nullable=True),
        sa.Column("error_type", sa.String(length=120), nullable=True),
        sa.CheckConstraint(
            "status IN ('running', 'succeeded', 'failed')",
            name=op.f("ck_job_runs_status_valid"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_job_runs")),
        sa.UniqueConstraint("job_name", "run_key", name="uq_job_runs_job_run_key"),
    )
    op.create_index(
        "ix_job_runs_job_completed",
        "job_runs",
        ["job_name", "completed_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_job_runs_job_completed", table_name="job_runs")
    op.drop_table("job_runs")
