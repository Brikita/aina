from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.warning import Warning

from app.services.gis.impact_analysis import (
    analyze_impact,
)

from app.services.gis.exposure_service import (
    analyze_exposure,
)

router = APIRouter(
    prefix="/exposure",
    tags=["Exposure"],
)

# Get exposure analysis for a specific warning
@router.get("/{warning_id}")
def get_exposure(
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

    if warning is None:
        return {
            "message": "Warning not found"
        }

    impact = analyze_impact(
        db,
        warning,
    )

    return analyze_exposure(
        impact,
    )