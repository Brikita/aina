from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from geoalchemy2 import Geometry

from app.database.base import Base


class County(Base):

    __tablename__ = "counties"


    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )


    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )


    geometry = mapped_column(
        Geometry(
            geometry_type="MULTIPOLYGON",
            srid=4326
        ),
        nullable=False
    )

    sub_counties = relationship(
        "SubCounty",
        back_populates="county",
        cascade="all, delete-orphan",
    )