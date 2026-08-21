"""widen global knowledge confidence for percentages

Revision ID: f260821a01
Revises: f260820a02
Create Date: 2026-08-21
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "f260821a01"
down_revision: str | Sequence[str] | None = "f260820a02"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.batch_alter_table("global_knowledge") as batch_op:
        batch_op.alter_column(
            "historical_confidence",
            existing_type=sa.Numeric(precision=5, scale=4),
            type_=sa.Numeric(precision=7, scale=4),
            existing_nullable=False,
        )


def downgrade() -> None:
    with op.batch_alter_table("global_knowledge") as batch_op:
        batch_op.alter_column(
            "historical_confidence",
            existing_type=sa.Numeric(precision=7, scale=4),
            type_=sa.Numeric(precision=5, scale=4),
            existing_nullable=False,
        )
