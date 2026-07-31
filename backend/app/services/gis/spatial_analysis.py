from app.models.asset import AssetType
from app.services.gis.asset_service import find_assets_inside_geometry


def count_assets(
    db,
    geometry,
    asset_type: AssetType,
):
    assets = find_assets_inside_geometry(
        db,
        geometry,
        asset_type,
    )

    return len(assets)


def summarize_assets(
    db,
    geometry_geojson,
):
    """
    Returns the number of assets of each type
    intersecting the supplied geometry.
    """

    summary = {}

    for asset_type in AssetType:

        assets = find_assets_inside_geometry(
            db,
            geometry_geojson,
            asset_type,
        )

        summary[asset_type.value] = len(assets)

    return summary