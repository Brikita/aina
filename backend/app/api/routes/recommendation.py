from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.warning import Warning

from app.services.gis.gis_service import gis_service
from app.services.recommendation_service import recommendation_service

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)

# Get recommendations for a specific warning
@router.get("/{warning_id}")
def recommendations(
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

    return recommendation_service.generate(
        gis
    )