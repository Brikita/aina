from pydantic import BaseModel


class ImpactAnalysisRequest(BaseModel):
    county: str
    hazard: str
    severity: str


class ImpactAnalysisResponse(BaseModel):
    county: str
    hazard: str
    severity: str
    affected_assets: dict[str, int]