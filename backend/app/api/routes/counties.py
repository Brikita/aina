from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.county import County

from app.services.gis.county_service import (
    get_county_geojson,
)

router = APIRouter(
    prefix="/counties",
    tags=["Counties"],
)


# Get all counties
@router.get("/")
def get_counties(
    db: Session = Depends(get_db),
):

    counties = db.query(County).all()

    return [
        {
            "id": county.id,
            "name": county.name,
        }
        for county in counties
    ]

# Get a specific county by name
@router.get("/{county_name}")
def get_county(
    county_name: str,
    db: Session = Depends(get_db),
):

    county = get_county_geojson(
        db,
        county_name,
    )

    if county is None:
        return {
            "message": "County not found"
        }

    return county