from collections import Counter

from geoalchemy2.shape import to_shape
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.asset import AssetType
from app.models.warning import Warning

from app.services.gis.asset_service import (
    get_assets_by_county,
    get_assets_by_subcounty,
)


CRITICAL_ASSET_TYPES = {
    AssetType.HOSPITAL,
    AssetType.SHELTER,
    AssetType.BRIDGE,
    AssetType.SCHOOL,
}


def serialize_asset(asset: Asset) -> dict:
    """
    Convert an Asset model into a JSON-friendly dictionary.
    """

    location = None

    try:
        geometry = to_shape(asset.geometry)

        location = {
            "longitude": geometry.x,
            "latitude": geometry.y,
        }

    except Exception:
        pass

    return {
        "id": asset.id,
        "name": asset.name,
        "type": asset.asset_type.name,
        "county": asset.county,
        "subcounty": asset.subcounty,
        "capacity": asset.capacity,
        "source": asset.source,
        "location": location,
    }


def count_assets_by_type(
    assets: list[Asset],
) -> dict[str, int]:
    """
    Count assets grouped by type.
    """

    counter = Counter()

    for asset in assets:
        counter[asset.asset_type.name] += 1

    return dict(counter)


def get_critical_assets(
    assets: list[Asset],
) -> list[dict]:
    """
    Return detailed information for critical infrastructure.
    """

    return [
        serialize_asset(asset)
        for asset in assets
        if asset.asset_type in CRITICAL_ASSET_TYPES
    ]


def calculate_severity(
    warning: Warning,
    asset_counts: dict[str, int],
) -> str:
    """
    Estimate impact severity.
    """

    score = 0

    severity = warning.severity.value.lower()

    if severity == "low":
        score += 10

    elif severity == "medium":
        score += 30

    elif severity == "high":
        score += 60

    score += asset_counts.get("HOSPITAL", 0) * 2
    score += asset_counts.get("SCHOOL", 0)
    score += asset_counts.get("BRIDGE", 0) * 3
    score += asset_counts.get("SHELTER", 0) * 4

    if score >= 120:
        return "Extreme"

    if score >= 80:
        return "High"

    if score >= 40:
        return "Moderate"

    return "Low"


def analyze_impact(
    db: Session,
    warning: Warning,
) -> dict:
    """
    Complete impact analysis for a warning.
    """

    # ----------------------------------------
    # Retrieve exposed assets
    # ----------------------------------------

    if getattr(warning, "subcounty", None):

        assets = get_assets_by_subcounty(
            db,
            warning.subcounty,
        )

    else:

        assets = get_assets_by_county(
            db,
            warning.county,
        )

    # ----------------------------------------
    # Statistics
    # ----------------------------------------

    asset_counts = count_assets_by_type(
        assets
    )

    critical_assets = get_critical_assets(
        assets
    )

    severity = calculate_severity(
        warning,
        asset_counts,
    )

    # ----------------------------------------
    # Response
    # ----------------------------------------

    return {

        "county": warning.county,

        "subcounty": getattr(
            warning,
            "subcounty",
            None,
        ),

        "hazard": warning.hazard.value,

        "severity": severity,

        "summary": {

            "total_assets": len(assets),

            "asset_counts": asset_counts,

        },

        "critical_assets": critical_assets,

    }


def analyze_county_impact(
    db: Session,
    county: str,
) -> dict[str, int]:
    """
    Lightweight county summary for dashboards.
    """

    results = (
        db.query(
            Asset.asset_type,
            func.count(Asset.id),
        )
        .filter(
            Asset.county.ilike(county),
        )
        .group_by(
            Asset.asset_type,
        )
        .all()
    )

    return {
        asset_type.name: count
        for asset_type, count in results
    }


def analyze_subcounty_impact(
    db: Session,
    subcounty: str,
) -> dict[str, int]:
    """
    Lightweight subcounty summary for dashboards.
    """

    results = (
        db.query(
            Asset.asset_type,
            func.count(Asset.id),
        )
        .filter(
            Asset.subcounty.ilike(subcounty),
        )
        .group_by(
            Asset.asset_type,
        )
        .all()
    )

    return {
        asset_type.name: count
        for asset_type, count in results
    }