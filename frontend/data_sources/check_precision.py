import geopandas as gpd

# Load original shapefile
counties = gpd.read_file("KENYA COUNTIES/counties.shp")

# Check geometry type
print("=== GEOMETRY PRECISION CHECK ===")
print(f"Geometry type: {counties.geometry.geom_type.iloc[0]}")
print(f"Number of counties: {len(counties)}")

# Check first county geometry details
first_geom = counties.geometry.iloc[0]
print(f"\nFirst county (NAIROBI) geometry:")
print(f"  Type: {first_geom.geom_type}")
print(f"  Number of exterior points: {len(first_geom.exterior.coords)}")
print(f"  First 5 coordinates: {first_geom.exterior.coords[:5]}")
print(f"  Last 5 coordinates: {first_geom.exterior.coords[-5:]}")

# Check coordinate precision (how many decimal places)
import re
# Get the WKT representation of first polygon
wkt = first_geom.wkt
# Find all decimal numbers
decimals = re.findall(r'(\d+\.\d+)', wkt)
if decimals:
    # Count decimal places
    precisions = [len(d.split('.')[1]) for d in decimals[:10]]
    print(f"\nCoordinate precision (decimal places): {min(precisions)} to {max(precisions)}")
    print(f"Sample coordinates: {decimals[:5]}")

print("\n✅ If precision shows 6+ decimal places, the shapefile is detailed.")
print("   If precision shows 1-2 decimal places, the shapefile is simplified.")