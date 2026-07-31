from sqlalchemy import ForeignKey
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.database.base import Base


class Recommendation(Base):

    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(primary_key=True)

    warning_id: Mapped[int] = mapped_column(
        ForeignKey("warnings.id")
    )

    priority: Mapped[int] = mapped_column(Integer)

    action: Mapped[str] = mapped_column(String(255))

    reason: Mapped[str] = mapped_column(String(255))

    status: Mapped[str] = mapped_column(
        String(30),
        default="Pending"
    )

    warning = relationship("Warning", back_populates="recommendations")

    allocations = relationship("Allocation", back_populates="recommendation")