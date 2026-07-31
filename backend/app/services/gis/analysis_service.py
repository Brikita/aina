from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.asset import Asset


def count_assets_by_county(
    db: Session,
    county: str,
) -> dict:

    results = (
        db.query(
            Asset.asset_type,
            func.count(Asset.id).label("count"),
        )
        .filter(
            Asset.county.ilike(county)
        )
        .group_by(
            Asset.asset_type
        )
        .all()
    )

    return {
        asset_type.name: count
        for asset_type, count in results
    }