from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.schemas.warning import WarningCreate
from app.schemas.warning import WarningResponse

from app.services.warning_service import warning_service
from app.use_cases.process_warning import ProcessWarningUseCase

from app.services.gis.gis_service import gis_service
from app.services.recommendation_service import recommendation_service
from app.services.allocation_service import allocation_service
from app.services.simulation_service import simulation_service
from app.schemas.process_warning import (
    ProcessWarningResponse,
)

router = APIRouter(
    prefix="/warnings",
    tags=["Warnings"],
)

# Create a new warning
@router.post(
    "/",
    response_model=ProcessWarningResponse,
    status_code=201,
)
def create_warning(warning_data: WarningCreate,db: Session = Depends(get_db),):

    use_case = ProcessWarningUseCase(
        warning_service=warning_service,
        gis_service=gis_service,
        recommendation_service=recommendation_service,
        allocation_service=allocation_service,
        simulation_service=simulation_service,
    )

    result = use_case.execute(
        db,
        warning_data,
    )

    return  result

# Get all warnings
@router.get(
    "/",
    response_model=list[WarningResponse],
)
def get_warnings(
    db: Session = Depends(get_db),
):

    return warning_service.get_warnings(db)

# Get a warning by ID
@router.get(
    "/{warning_id}",
    response_model=WarningResponse,
)
def get_warning(
    warning_id: int,
    db: Session = Depends(get_db),
):

    warning = warning_service.get_warning(
        db,
        warning_id,
    )

    if warning is None:

        raise HTTPException(
            status_code=404,
            detail="Warning not found",
        )

    return warning