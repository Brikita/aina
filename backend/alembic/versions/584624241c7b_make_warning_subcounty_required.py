"""make warning subcounty required

Revision ID: 584624241c7b
Revises: aadcbea7c3f0
Create Date: 2026-07-31 12:30:57.489939

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '584624241c7b'
down_revision: Union[str, Sequence[str], None] = 'aadcbea7c3f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():

    op.alter_column(
        "warnings",
        "subcounty_id",
        nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    pass
