from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from app.database.session import get_db
from app.models.subcounty import SubCounty



from app.services.gis.subcounty_service import (
    get_subcounty_geojson,
)

router = APIRouter(
    prefix="/subcounties",
    tags=["SubCounties"],
)


# Get all subcounties
@router.get("/")
def get_subcounties(
    db: Session = Depends(get_db),
):

    subcounties = db.query(SubCounty).all()

    return [
        {
            "id": subcounty.id,
            "name": subcounty.name,
        }
        for subcounty in subcounties
    ]

# Get a specific subcounty by name
@router.get("/{subcounty_name}")
def get_subcounty(
    subcounty_name: str,
    db: Session = Depends(get_db),
):

    subcounty = get_subcounty_geojson(
        db,
        subcounty_name,
    )

    if subcounty is None:
        return {
            "message": "SubCounty not found"
        }

    return subcounty