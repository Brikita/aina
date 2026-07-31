from geoalchemy2.shape import from_shape, to_shape
from shapely.geometry import shape
import json

from app.database.session import SessionLocal
from app.models.county import County
from app.models.subcounty import SubCounty


GEOJSON_PATH = "data/raw/subcounties.geojson"


def import_subcounties():

    db = SessionLocal()

    with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
        geojson = json.load(f)

    imported = 0
    skipped = 0

    counties = db.query(County).all()

    for feature in geojson["features"]:

        polygon = shape(feature["geometry"])

        name = feature["properties"]["shapeName"].strip()

        county_found = None

        centroid = polygon.centroid

        for county in counties:

            county_polygon = to_shape(
                county.geometry
            )

            if county_polygon.contains(centroid):

                county_found = county

                break

        if county_found is None:

            skipped += 1

            print(f"Skipped: {name}")

            continue

        exists = (
            db.query(SubCounty)
            .filter(
                SubCounty.name == name,
                SubCounty.county_id == county_found.id,
            )
            .first()
        )

        if exists:

            continue

        db.add(

            SubCounty(

                name=name,

                county_id=county_found.id,

                geometry=from_shape(
                    polygon,
                    srid=4326,
                ),

            )

        )

        imported += 1

    db.commit()

    db.close()

    print(f"Imported: {imported}")

    print(f"Skipped: {skipped}")


if __name__ == "__main__":

    import_subcounties()