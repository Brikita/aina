import geopandas as gpd
import pandas as pd
import json

# Load county boundaries
counties = gpd.read_file("KENYA COUNTIES/counties.shp")

# Remove the null county
counties = counties[counties['COUNTY_NAM'].notna()]

# Load population data
pop = pd.read_csv("KE_POPULATION/ke_population.csv")

# Clean population data - remove commas and convert to numbers
for col in ['Total_Population19', 'Male populatio 2019', 'Female population 2019', 
            'Households', 'Population Density', 'Population in 2009', 'Pop_change']:
    pop[col] = pop[col].astype(str).str.replace(',', '').astype(float)

# Function to clean county names
def clean_name(name):
    if pd.isna(name):
        return None
    name = str(name).strip().upper()
    name = name.replace(' COUNTY', '').replace(' DISTRICT', '')
    name = name.replace('THARAKA - NITHI', 'THARAKA-NITHI')
    name = name.replace('ELEGEYO-MARAKWET', 'ELGEYO-MARAKWET')
    name = name.replace('TANA RIVER', 'TANA RIVER')
    name = ' '.join(name.split())
    return name

# Clean names in both datasets
counties['COUNTY_NAM_clean'] = counties['COUNTY_NAM'].apply(clean_name)
pop['County_clean'] = pop['County'].apply(clean_name)

# Merge
merged = counties.merge(pop, left_on='COUNTY_NAM_clean', right_on='County_clean', how='left')

print(f"Merged {len(merged)} counties")

# Save with MAXIMUM precision using custom JSON encoder
def save_geojson_precise(gdf, filename):
    # Convert to GeoJSON with high precision
    geojson_dict = json.loads(gdf.to_json(show_bbox=True, drop_id=False))
    
    # Save with high precision (14 decimal places)
    with open(filename, 'w') as f:
        json.dump(geojson_dict, f, ensure_ascii=False, indent=2)

# Save with high precision
save_geojson_precise(merged, "kenya_counties_precise.geojson")
print("\n✅ Saved with HIGH precision to: kenya_counties_precise.geojson")

# Check file size
import os
size = os.path.getsize("kenya_counties_precise.geojson")
print(f"File size: {size / 1024:.2f} KB")

# Also check coordinate precision in the saved file
import json
with open("kenya_counties_precise.geojson", 'r') as f:
    data = json.load(f)
    # Sample a coordinate from the first feature
    coords = data['features'][0]['geometry']['coordinates'][0][0][:5]
    print(f"\nSample coordinates from saved file: {coords}")