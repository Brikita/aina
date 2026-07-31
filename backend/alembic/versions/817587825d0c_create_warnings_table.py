"""create warnings table

Revision ID: 817587825d0c
Revises: 
Create Date: 2026-07-28 16:08:45.954932

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '817587825d0c'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('warnings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('county', sa.String(length=100), nullable=False),
    sa.Column('hazard', sa.Enum('FLOOD', 'DROUGHT', 'LANDSLIDE', name='hazardtype'), nullable=False),
    sa.Column('severity', sa.Enum('LOW', 'MEDIUM', 'HIGH', name='severity'), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=False),
    sa.Column('issued_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('warnings')
    op.execute('DROP TYPE IF EXISTS hazardtype')
    op.execute('DROP TYPE IF EXISTS severity')