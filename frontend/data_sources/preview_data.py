import geopandas as gpd
import pandas as pd
import os

# The script is in data_sources folder, so files are in current directory
counties = gpd.read_file("KENYA COUNTIES/counties.shp")
print("=== COUNTY SHAPEFILE ===")
print(f"Number of counties: {len(counties)}")
print(f"\nColumn names: {counties.columns.tolist()}")
print(f"\nFirst 5 rows:")
print(counties.head())
print(f"\nCRS: {counties.crs}")