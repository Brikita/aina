from pydantic import BaseModel

from app.schemas.warning import WarningResponse


class ProcessWarningResponse(BaseModel):
    warning: WarningResponse
    impact: dict
    recommendations: dict
    allocations: dict
    simulation: dict