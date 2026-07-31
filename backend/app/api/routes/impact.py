from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.warning import Warning

from app.services.gis.impact_analysis import (
    analyze_impact,
)

router = APIRouter(
    prefix="/impact",
    tags=["Impact"],
)

# Get impact analysis for a specific warning
@router.get("/{warning_id}")
def get_impact(
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

    return analyze_impact(
        db,
        warning,
    )