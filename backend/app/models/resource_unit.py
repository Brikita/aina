from enum import Enum

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class ResourceType(str, Enum):
    AMBULANCE = "Ambulance"
    BOAT = "Boat"
    TRUCK = "Truck"
    HELICOPTER = "Helicopter"


class ResourceStatus(str, Enum):
    AVAILABLE = "Available"
    DEPLOYED = "Deployed"
    MAINTENANCE = "Maintenance"


class ResourceUnit(Base):

    __tablename__ = "resource_units"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(100))

    resource_type: Mapped[ResourceType] = mapped_column(
        SQLEnum(ResourceType)
    )

    status: Mapped[ResourceStatus] = mapped_column(
        SQLEnum(ResourceStatus),
        default=ResourceStatus.AVAILABLE
    )

    latitude: Mapped[float] = mapped_column(Float)

    longitude: Mapped[float] = mapped_column(Float)

    allocations = relationship(
    "Allocation",
    back_populates="resource",
    cascade="all, delete-orphan"
    )