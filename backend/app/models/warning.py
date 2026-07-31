from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.sql import func

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.database.base import Base
from geoalchemy2 import Geometry
from typing import Any


class HazardType(str, Enum):
    FLOOD = "Flood"
    DROUGHT = "Drought"
    LANDSLIDE = "Landslide"


class Severity(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Warning(Base):

    __tablename__ = "warnings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    county: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    subcounty: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    # Reference to the actual SubCounty record
    subcounty_id: Mapped[int] = mapped_column(
        ForeignKey("sub_counties.id"),
        nullable=False,
        index=True,
    )

    hazard: Mapped[HazardType] = mapped_column(
        SQLEnum(HazardType),
        nullable=False,
    )

    severity: Mapped[Severity] = mapped_column(
        SQLEnum(Severity),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="ACTIVE",
        nullable=False,
    )

    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    geometry: Mapped[Any] = mapped_column(
        Geometry(
            geometry_type="MULTIPOLYGON",
            srid=4326,
            spatial_index=True,
        ),
        nullable=True,
    )
    # ------------------------
    # Relationships
    # ------------------------

    subcounty_rel = relationship(
        "SubCounty",
    )

    impact_analysis = relationship(
        "ImpactAnalysis",
        back_populates="warning",
    )

    recommendations = relationship(
        "Recommendation",
        back_populates="warning",
    )

    feedback = relationship(
        "Feedback",
        back_populates="warning",
    )

