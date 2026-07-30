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

# Save with HIGH precision (7 decimal places)
# This preserves the detailed geometry
merged.to_file("kenya_counties_precise.geojson", driver="GeoJSON", 
               encoding='utf-8')

print("\n✅ Saved with high precision to: kenya_counties_precise.geojson")

# Also check file size
import os
size = os.path.getsize("kenya_counties_precise.geojson")
print(f"File size: {size / 1024:.2f} KB")