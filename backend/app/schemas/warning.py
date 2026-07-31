from datetime import datetime
from typing import Any

from pydantic import BaseModel

from app.models.warning import HazardType
from app.models.warning import Severity


class WarningCreate(BaseModel):
    county: str
    subcounty: str
    hazard: HazardType
    severity: Severity


class WarningResponse(BaseModel):
    id: int
    county: str
    subcounty: str
    subcounty_id: int
    hazard: HazardType
    severity: Severity
    status: str
    issued_at: datetime
    geometry: dict[str, Any] | None = None

    model_config = {
        "from_attributes": True
    }