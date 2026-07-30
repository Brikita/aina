import geopandas as gpd
import os
import json

print("=" * 60)
print("STEP 1: Exporting Kenya Administrative Shapefiles to GeoJSON")
print("=" * 60)

# Define the base path
BASE_PATH = "KE_ADMINISTRATIVE"

# Define the shapefiles to export with their actual file names
shapefiles = [
    {
        "folder": "ke_counties",
        "file": "Kenya_county.shp",
        "output": "kenya_counties_admin.geojson",
        "name": "Counties"
    },
    {
        "folder": "ke_subcounty",
        "file": "ke_subcounty.shp",
        "output": "kenya_subcounties.geojson",
        "name": "Sub-Counties"
    },
    {
        "folder": "ke_sublocations",
        "file": "kenya_sublocations.shp",
        "output": "kenya_sublocations.geojson",
        "name": "Sub-Locations"
    },
    {
        "folder": "ke_wards",
        "file": "kenya_wards.shp",
        "output": "kenya_wards.geojson",
        "name": "Wards"
    },
    {
        "folder": "KE_VILLAGES",
        "file": "kenya_villages.shp",
        "output": "kenya_villages.geojson",
        "name": "Villages"
    }
]

# Print what we're about to do
print("\n📁 Shapefiles to export:")
for sf in shapefiles:
    print(f"   - {sf['name']}: {sf['folder']}/{sf['file']}")

print("\n" + "=" * 60)

# Export each shapefile
for sf in shapefiles:
    file_path = os.path.join(BASE_PATH, sf["folder"], sf["file"])
    output_path = sf["output"]
    
    try:
        print(f"\n📂 Loading {sf['name']}...")
        gdf = gpd.read_file(file_path)
        
        print(f"   ✅ Loaded: {len(gdf)} features")
        print(f"   📋 Columns: {gdf.columns.tolist()}")
        print(f"   🗺️  CRS: {gdf.crs}")
        
        # Convert to WGS84 if needed
        if gdf.crs != 'EPSG:4326':
            print(f"   🔄 Converting to WGS84 (EPSG:4326)...")
            gdf = gdf.to_crs('EPSG:4326')
        
        # Simplify geometry for performance (optional)
        # gdf['geometry'] = gdf.geometry.simplify(0.0001)
        
        # Save as GeoJSON
        gdf.to_file(output_path, driver="GeoJSON")
        print(f"   💾 Saved: {output_path}")
        
        # Check file size
        size = os.path.getsize(output_path)
        if size > 1024 * 1024:
            print(f"   📊 Size: {size / (1024 * 1024):.2f} MB")
        else:
            print(f"   📊 Size: {size / 1024:.2f} KB")
            
    except Exception as e:
        print(f"   ❌ Error loading {sf['name']}: {e}")

print("\n" + "=" * 60)
print("✅ Step 1 Complete!")
print("=" * 60)

# List all exported files
print("\n📁 Exported files:")
for sf in shapefiles:
    try:
        size = os.path.getsize(sf["output"])
        if size > 1024 * 1024:
            print(f"   📄 {sf['output']} ({size / (1024 * 1024):.2f} MB)")
        else:
            print(f"   📄 {sf['output']} ({size / 1024:.2f} KB)")
    except:
        print(f"   ❌ {sf['output']} (not found)")