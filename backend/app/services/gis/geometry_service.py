from geoalchemy2.shape import to_shape
from shapely.geometry import mapping


def serialize_geometry(geometry):
    """
    Converts a PostGIS geometry into GeoJSON.
    """

    return mapping(
        to_shape(
            geometry
        )
    )