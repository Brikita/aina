from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.hazard import HazardResponse
# from app.services.gis.hazard_service import build_hazard

router = APIRouter(
    prefix="/hazards",
    tags=["Hazards"]
)


@router.get(
    "/{hazard}/{county}",
    response_model=HazardResponse
)
def get_hazard(
    hazard: str,
    county: str,
    db: Session = Depends(get_db),
):

    # result = build_hazard(
    #     db=db,
    #     county=county,
    #     hazard=hazard,
    #     severity="High"
    # )

    # if result is None:
    #     raise HTTPException(
    #         status_code=404,
    #         detail="County not found"
    #     )

    return []