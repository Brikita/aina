from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from app.database.base import Base


class Allocation(Base):

    __tablename__ = "allocations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    recommendation_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("recommendations.id")
    )

    resource_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("resource_units.id")
    )

    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    recommendation = relationship("Recommendation", back_populates="allocations")

    resource = relationship("ResourceUnit", back_populates="allocations")