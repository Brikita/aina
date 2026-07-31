from sqlalchemy import ForeignKey
from sqlalchemy import Float, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship

from app.database.base import Base


class Feedback(Base):

    __tablename__ = "feedback"

    id: Mapped[int] = mapped_column(primary_key=True)

    warning_id: Mapped[int] = mapped_column(
        ForeignKey("warnings.id")
    )

    latitude: Mapped[float] = mapped_column(Float)

    longitude: Mapped[float] = mapped_column(Float)

    description: Mapped[str] = mapped_column(String(500))

    severity: Mapped[str] = mapped_column(String(50))

    warning = relationship("Warning", back_populates="feedback")