from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.gis.county_service import get_county_geojson
from geoalchemy2.shape import to_shape
from shapely.geometry import mapping
from app.schemas.gis import AssetCountResponse
from app.services.gis.analysis_service import count_assets_by_county
from app.schemas.impact import (
    ImpactAnalysisRequest,
    ImpactAnalysisResponse,
)

from app.services.gis.impact_analysis import (
    analyze_county_impact,
)


router = APIRouter(
    prefix="/gis",
    tags=["GIS"]
)


# @router.get("/county/{county_name}")
# def fetch_county(
#     county_name: str,
#     db: Session = Depends(get_db)
# ):

#     county = get_county_geojson(
#         db,
#         county_name
#     )

#     if not county:
#         raise HTTPException(
#             status_code=404,
#             detail="County not found"
#         )


    
#     return county

# @router.get(
#     "/assets/{county}",
#     response_model=AssetCountResponse,
# )
# def get_asset_counts(
#     county: str,
#     db: Session = Depends(get_db),
# ):

#     assets = count_assets_by_county(
#         db,
#         county,
#     )

#     return {
#         "county": county,
#         "assets": assets,
#     }


@router.post(
    "/impact-analysis",
    response_model=ImpactAnalysisResponse,
)
def impact_analysis(
    request: ImpactAnalysisRequest,
    db: Session = Depends(get_db),
):

    assets = analyze_county_impact(
        db,
        request.county,
    )

    return {
        "county": request.county,
        "hazard": request.hazard,
        "severity": request.severity,
        "affected_assets": assets,
    }