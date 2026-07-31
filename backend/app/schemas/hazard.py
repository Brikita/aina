from pydantic import BaseModel


class HazardResponse(BaseModel):
    county: str
    hazard: str
    severity: str
    geometry: dict