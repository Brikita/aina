from sqlalchemy import func
from sqlalchemy.orm import Session

from geoalchemy2.shape import from_shape
from shapely.geometry import shape

from app.models.asset import Asset
from app.models.asset import AssetType


def find_assets_inside_geometry(
    db: Session,
    geometry_geojson: dict,
    asset_type: AssetType,
):
    polygon = shape(geometry_geojson)

    polygon_geom = from_shape(
        polygon,
        srid=4326,
    )

    return (
        db.query(Asset)
        .filter(
            Asset.asset_type == asset_type,
            func.ST_Intersects(
                Asset.geometry,
                polygon_geom,
            ),
        )
        .all()
    )


def get_assets_by_county(
    db: Session,
    county: str,
):
    return (
        db.query(Asset)
        .filter(
            Asset.county.ilike(county)
        )
        .all()
    )


def get_assets_by_county_and_type(
    db: Session,
    county: str,
    asset_type: AssetType | None,
):
    query = db.query(Asset).filter(
        Asset.county.ilike(county)
    )

    if asset_type is not None:
        query = query.filter(
            Asset.asset_type == asset_type
        )

    return query.all()


def get_asset(
    db: Session,
    asset_id: int,
):
    return (
        db.query(Asset)
        .filter(
            Asset.id == asset_id
        )
        .first()
    )


def get_all_assets(
    db: Session,
):
    return db.query(Asset).all()


def get_assets_by_subcounty(
    db: Session,
    subcounty: str,
):
    return (
        db.query(Asset)
        .filter(
            Asset.subcounty.ilike(subcounty)
        )
        .all()
    )


# ----------------------------
# NEW SUMMARY FUNCTION
# ----------------------------

def get_asset_summary(
    db: Session,
):
    total = db.query(
        func.count(Asset.id)
    ).scalar()

    type_counts = (
        db.query(
            Asset.asset_type,
            func.count(Asset.id)
        )
        .group_by(
            Asset.asset_type
        )
        .all()
    )

    county_counts = (
        db.query(
            Asset.county,
            func.count(Asset.id)
        )
        .group_by(
            Asset.county
        )
        .all()
    )

    return {
        "total": total,
        "types": {
            (
                asset_type.value
                if hasattr(asset_type, "value")
                else asset_type
            ): count
            for asset_type, count in type_counts
        },
        "counties": {
            county: count
            for county, count in county_counts
        },
    }