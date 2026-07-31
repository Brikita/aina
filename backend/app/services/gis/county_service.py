from sqlalchemy.orm import Session

from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

from app.models.county import County


def get_county_by_name(
    db: Session,
    county_name: str,
):
    """
    Returns the SQLAlchemy County model.
    Used internally by other backend services.
    """

    return (
        db.query(County)
        .filter(County.name.ilike(county_name))
        .first()
    )


def get_county_geojson(
    db: Session,
    county_name: str,
):
    """
    Returns a county ready for API responses.
    """

    county = get_county_by_name(db, county_name)

    if county is None:
        return None

    return {
        "id": county.id,
        "name": county.name,
        "geometry": mapping(to_shape(county.geometry))
    }