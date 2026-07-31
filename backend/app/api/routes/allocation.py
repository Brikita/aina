from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.warning import Warning

from app.services.gis.gis_service import gis_service

from app.services.recommendation_service import recommendation_service
from app.services.allocation_service import allocation_service

router = APIRouter(
    prefix="/allocation",
    tags=["Allocation"],
)

@router.get("/{warning_id}")
def allocation(
    warning_id: int,
    db: Session = Depends(get_db),
):

    warning = (
        db.query(Warning)
        .filter(
            Warning.id == warning_id
        )
        .first()
    )

    gis = gis_service.analyse(
        db,
        warning,
    )

    recommendations = (
        recommendation_service.generate(
            gis
        )
    )

    return allocation_service.allocate(
        recommendations
    )