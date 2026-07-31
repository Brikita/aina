from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

from app.models.warning import Warning


def serialize_warning(warning: Warning):

    geometry = None

    if warning.geometry:
        geometry = mapping(
            to_shape(warning.geometry)
        )

    return {
        "id": warning.id,
        "county": warning.county,
        "subcounty": warning.subcounty,
        "subcounty_id": warning.subcounty_id,
        "hazard": warning.hazard,
        "severity": warning.severity,
        "status": warning.status,
        "issued_at": warning.issued_at,
        "geometry": geometry,
    }