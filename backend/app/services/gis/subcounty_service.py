from sqlalchemy.orm import Session

from geoalchemy2.shape import to_shape
from shapely.geometry import mapping

from app.models.county import County
from app.models.subcounty import SubCounty

from sqlalchemy.orm import joinedload


def get_subcounty_by_name(
    db: Session,
    subcounty_name: str,
):
    """
    Returns the SQLAlchemy SubCounty model.
    """

    return (
        db.query(SubCounty)
        .filter(
            SubCounty.name.ilike(subcounty_name)
        )
        .first()
    )


def get_subcounty_geojson(
    db: Session,
    subcounty_name: str,
):
    """
    Returns a single subcounty as GeoJSON.
    """

    subcounty = get_subcounty_by_name(
        db,
        subcounty_name,
    )

    if subcounty is None:
        return None

    return {

        "type": "Feature",

        "geometry": mapping(
            to_shape(
                subcounty.geometry
            )
        ),

        "properties": {

            "id": subcounty.id,

            "name": subcounty.name,

            "county": subcounty.county.name,

        },

    }


def get_all_subcounties(
    db: Session,
):
    """
    Returns every subcounty.
    """

    return (
    db.query(SubCounty)
    .options(
        joinedload(SubCounty.county)
    )
    .order_by(SubCounty.name)
    .all()
)


def get_all_subcounties_geojson(
    db: Session,
):
    """
    Returns all subcounties as a GeoJSON FeatureCollection.
    """

    subcounties = get_all_subcounties(db)

    return {

        "type": "FeatureCollection",

        "features": [

            {

                "type": "Feature",

                "geometry": mapping(
                    to_shape(
                        subcounty.geometry
                    )
                ),

                "properties": {

                    "id": subcounty.id,

                    "name": subcounty.name,

                    "county": subcounty.county.name,

                },

            }

            for subcounty in subcounties

        ],

    }


def get_subcounties_by_county(
    db: Session,
    county_name: str,
):
    """
    Returns all subcounties belonging to a county.
    """

    return (
    db.query(SubCounty)
    .options(
        joinedload(SubCounty.county)
    )
    .join(County)
    .filter(
        County.name.ilike(county_name)
    )
    .order_by(SubCounty.name)
    .all()
)


def get_subcounties_by_county_geojson(
    db: Session,
    county_name: str,
):
    """
    Returns GeoJSON for all subcounties
    inside a county.
    """

    subcounties = get_subcounties_by_county(
        db,
        county_name,
    )

    return {

        "type": "FeatureCollection",

        "features": [

            {

                "type": "Feature",

                "geometry": mapping(
                    to_shape(
                        subcounty.geometry
                    )
                ),

                "properties": {

                    "id": subcounty.id,

                    "name": subcounty.name,

                    "county": subcounty.county.name,

                },

            }

            for subcounty in subcounties

        ],

    }