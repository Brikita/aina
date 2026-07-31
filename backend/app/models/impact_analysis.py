from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from app.database.base import Base


class ImpactAnalysis(Base):

    __tablename__ = "impact_analysis"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    warning_id: Mapped[int] = mapped_column(
        ForeignKey("warnings.id")
    )

    summary: Mapped[dict] = mapped_column(
        JSON
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    warning = relationship(
        "Warning",
        back_populates="impact_analysis"
    )