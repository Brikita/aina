import geopandas as gpd
import os

print("=" * 50)
print("EXPORTING KENYA DATA LAYERS TO GEOJSON")
print("=" * 50)

# 1. ROADS
print("\n📁 Loading Roads...")
roads = gpd.read_file("KE_ROADS/ken_roads.shp")
print(f"   Features: {len(roads)}")
print(f"   CRS: {roads.crs}")

# 2. RIVERS
print("\n📁 Loading Rivers...")
rivers = gpd.read_file("KE_RIVERS/ken_water_lines_dcw.shp")
print(f"   Features: {len(rivers)}")
print(f"   CRS: {rivers.crs}")

# 3. LIVELIHOOD ZONES
print("\n📁 Loading Livelihood Zones...")
livelihood = gpd.read_file("KE_LIVELIHOOD/Kenya_Livelihoods_GAUL_Clean.shp")
print(f"   Features: {len(livelihood)}")
print(f"   CRS: {livelihood.crs}")

# Convert to WGS84 (EPSG:4326) for web
print("\n🔄 Converting to WGS84 (EPSG:4326)...")
roads = roads.to_crs("EPSG:4326")
rivers = rivers.to_crs("EPSG:4326")
livelihood = livelihood.to_crs("EPSG:4326")

# Simplify for performance
print("\n🔧 Simplifying geometries...")
roads['geometry'] = roads.geometry.simplify(0.0001)
rivers['geometry'] = rivers.geometry.simplify(0.0001)
livelihood['geometry'] = livelihood.geometry.simplify(0.0001)

# Export
print("\n💾 Saving GeoJSON files...")
roads.to_file("kenya_roads.geojson", driver="GeoJSON")
rivers.to_file("kenya_rivers.geojson", driver="GeoJSON")
livelihood.to_file("kenya_livelihood.geojson", driver="GeoJSON")

print("\n✅ EXPORT COMPLETE!")
print(f"   - kenya_roads.geojson ({len(roads)} features)")
print(f"   - kenya_rivers.geojson ({len(rivers)} features)")
print(f"   - kenya_livelihood.geojson ({len(livelihood)} features)")