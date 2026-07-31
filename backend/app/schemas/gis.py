from pydantic import BaseModel


class AssetCountResponse(BaseModel):
    county: str
    assets: dict[str, int]