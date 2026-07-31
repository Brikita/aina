import geopandas as gpd

from app.database.session import engine
from app.models.asset import AssetType

from pathlib import Path
import pandas as pd


def load_dataset(file_path: str) -> gpd.GeoDataFrame:

    print(f"Loading {file_path}...")

    extension = Path(file_path).suffix.lower()

    # ----------------------------------------
    # GeoJSON
    # ----------------------------------------

    if extension in [".geojson", ".json"]:

        gdf = gpd.read_file(file_path)

    # ----------------------------------------
    # CSV
    # ----------------------------------------

    elif extension == ".csv":

        df = pd.read_csv(file_path)

        latitude_column = None
        longitude_column = None

        for column in df.columns:

            name = column.lower()

            if name in [
                "latitude",
                "lat",
                "y",
            ]:
                latitude_column = column

            if name in [
                "longitude",
                "lon",
                "lng",
                "x",
            ]:
                longitude_column = column

        if latitude_column is None or longitude_column is None:
            raise ValueError(
                "CSV must contain latitude and longitude columns."
            )

        gdf = gpd.GeoDataFrame(
            df,
            geometry=gpd.points_from_xy(
                df[longitude_column],
                df[latitude_column],
            ),
            crs="EPSG:4326",
        )

    else:

        raise ValueError(
            f"Unsupported file format: {extension}"
        )

    print(f"Loaded {len(gdf)} features")
    print(f"CRS: {gdf.crs}")
    print(gdf.columns.tolist())

    return gdf

def normalize_crs(
    gdf: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:

    if gdf.crs != "EPSG:4326":
        print("Converting CRS to EPSG:4326")
        gdf = gdf.to_crs(4326)

    return gdf


def assign_counties(
    gdf: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:

    counties = gpd.read_postgis(
        """
        SELECT
            id,
            name,
            geometry
        FROM counties
        """,
        con=engine,
        geom_col="geometry",
    )

    joined = gpd.sjoin(
        gdf,
        counties,
        predicate="intersects",
        how="left",
    )

    print("\nSpatial join completed")
    print(joined.columns.tolist())

    asset_name_column = None

    for candidate in [
        "name",
        "Name",
        "NAME",
        "name_left",
    ]:
        if candidate in joined.columns:
            asset_name_column = candidate
            break

    county_column = "name_right" if "name_right" in joined.columns else "name"

    joined = joined.rename(
        columns={
            asset_name_column: "name",
            county_column: "county",
        }
    )

    missing = joined["county"].isna().sum()

    print(f"\nAssets without county: {missing}")

    if missing > 0:
        print("Dropping assets with no county assignment...")

        joined = joined[
            joined["county"].notna()
        ]

    return joined


def normalize_schema(
    gdf: gpd.GeoDataFrame,
    asset_type: AssetType,
) -> gpd.GeoDataFrame:

    # ----------------------------
    # Name
    # ----------------------------

    if "name" not in gdf.columns:
        gdf["name"] = "Unnamed Asset"

    gdf["name"] = (
        gdf["name"]
        .fillna("Unnamed Asset")
        .replace("", "Unnamed Asset")
    )

    # ----------------------------
    # Source
    # ----------------------------

    if "source" not in gdf.columns:
        gdf["source"] = "OpenStreetMap"

    gdf["source"] = (
        gdf["source"]
        .fillna("OpenStreetMap")
        .replace("", "OpenStreetMap")
    )

    # ----------------------------
    # Capacity
    # ----------------------------

    if "capacity" not in gdf.columns:
        gdf["capacity"] = None

    # ----------------------------
    # Asset Type
    # ----------------------------

    # Use the ENUM name stored in PostgreSQL
    gdf["asset_type"] = asset_type.name

    return gdf[
        [
            "name",
            "county",
            "asset_type",
            "geometry",
            "capacity",
            "source",
        ]
    ]


def validate_data(
    gdf: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:

    before = len(gdf)

    gdf = gdf.dropna(
        subset=[
            "name",
            "county",
            "geometry",
        ]
    )

    after = len(gdf)

    print(f"\nRemoved {before-after} invalid records")

    return gdf


def save_assets(
    gdf: gpd.GeoDataFrame,
):

    print("\nWriting assets to PostGIS...")

    gdf.to_postgis(
        name="assets",
        con=engine,
        if_exists="append",
        index=False,
    )

    print(f"Successfully imported {len(gdf)} assets")


def import_assets(
    file_path: str,
    asset_type: AssetType,
):

    gdf = load_dataset(file_path)

    gdf = normalize_crs(gdf)

    gdf = assign_counties(gdf)

    gdf = normalize_schema(
        gdf,
        asset_type,
    )

    gdf = validate_data(gdf)

    save_assets(gdf)


if __name__ == "__main__":

    import_assets(
        "data/raw/schools.csv",
        AssetType.SCHOOL,
    )