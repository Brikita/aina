import geopandas as gpd
from sqlalchemy import create_engine
from shapely.geometry import MultiPolygon, Polygon

from app.core.config import settings


def import_counties():

    print("Loading Kenya county dataset...")

    file_path = "data/raw/kenya_counties.geojson"

    gdf = gpd.read_file(file_path)


    print("Dataset loaded")
    print(gdf.head())


    # Confirm CRS
    print("Original CRS:", gdf.crs)


    # Convert to WGS84 if needed
    if gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs(epsg=4326)


    # Rename dataset columns
    gdf = gdf.rename(
    columns={
        "COUNTY_NAM": "name"
    }
    )


    # Remove records without county names
    gdf = gdf.dropna(
        subset=["name"]
    )


    # Remove empty strings
    gdf = gdf[
        gdf["name"].str.strip() != ""
    ]


    # Keep only application fields
    gdf = gdf[
        [
            "name",
            "geometry"
        ]
    ]


    # Remove duplicate county names if any
    gdf = gdf.drop_duplicates(
        subset=["name"]
    )


    engine = create_engine(
        settings.DATABASE_URL,
        echo=True
    )


    print("Writing counties to PostGIS...")


    def convert_to_multipolygon(geom):

        if isinstance(geom, Polygon):
            return MultiPolygon([geom])

        return geom


    gdf["geometry"] = gdf["geometry"].apply(
        convert_to_multipolygon
    )

    print(
    f"Importing {len(gdf)} counties"
    )

    print(
        gdf["name"].unique()
    )


    gdf.to_postgis(
        name="counties",
        con=engine,
        if_exists="append",
        index=False
    )


    print("County import completed successfully!")


if __name__ == "__main__":
    import_counties()