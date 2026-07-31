from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.asset import AssetType

from app.services.gis.asset_service import (
    get_asset,
    get_all_assets,
    get_asset_summary,
    get_assets_by_county,
    get_assets_by_county_and_type,
)

from app.services.gis.impact_analysis import serialize_asset

router = APIRouter(
    prefix="/assets",
    tags=["Assets"],
)


# ------------------------------------
# Dashboard Summary
# ------------------------------------
@router.get("/")
def asset_summary(
    db: Session = Depends(get_db),
):
    return get_asset_summary(db)


# ------------------------------------
# Get every asset
# ------------------------------------
@router.get("/all")
def all_assets(
    db: Session = Depends(get_db),
):
    assets = get_all_assets(db)

    return {
        "count": len(assets),
        "assets": [
            serialize_asset(asset)
            for asset in assets
        ],
    }


# ------------------------------------
# Filter assets
# ------------------------------------
@router.get("/filter")
def filter_assets(
    county: str = Query(...),
    asset_type: AssetType | None = Query(None),
    db: Session = Depends(get_db),
):
    assets = get_assets_by_county_and_type(
        db,
        county,
        asset_type,
    )

    return {
        "count": len(assets),
        "assets": [
            serialize_asset(asset)
            for asset in assets
        ],
    }


# ------------------------------------
# Assets in one county
# ------------------------------------
@router.get("/county/{county}")
def assets_by_county(
    county: str,
    db: Session = Depends(get_db),
):
    assets = get_assets_by_county(
        db,
        county,
    )

    return {
        "count": len(assets),
        "assets": [
            serialize_asset(asset)
            for asset in assets
        ],
    }


# ------------------------------------
# Single asset
# ------------------------------------
@router.get("/{asset_id}")
def asset_by_id(
    asset_id: int,
    db: Session = Depends(get_db),
):
    asset = get_asset(
        db,
        asset_id,
    )

    if asset is None:
        return None

    return serialize_asset(asset)