from enum import Enum

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry

from app.database.base import Base


class AssetType(str, Enum):
    HOSPITAL = "Hospital"
    SCHOOL = "School"
    SHELTER = "Shelter"
    VILLAGE = "Village"
    ROAD = "Road"
    BRIDGE = "Bridge"


class Asset(Base):

    __tablename__ = "assets"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(150))

    asset_type: Mapped[AssetType] = mapped_column(
        SQLEnum(AssetType)
    )

    geometry: Mapped[str] = mapped_column(
        Geometry("GEOMETRY", srid=4326)
    )

    county: Mapped[str] = mapped_column(String(100))

    subcounty: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    source: Mapped[str] = mapped_column(String(150))

    capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)