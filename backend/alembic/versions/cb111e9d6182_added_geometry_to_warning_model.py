"""added geometry to warning model"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry

revision: str = "cb111e9d6182"
down_revision: Union[str, Sequence[str], None] = "584624241c7b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "warnings",
        sa.Column(
            "geometry",
            Geometry(
                geometry_type="MULTIPOLYGON",
                srid=4326,
            ),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("warnings", "geometry")