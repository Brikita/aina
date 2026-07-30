import geopandas as gpd
import pandas as pd

# Load county boundaries WITHOUT simplifying
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

# Merge by cleaned county names
merged = counties.merge(pop, left_on='COUNTY_NAM_clean', right_on='County_clean', how='left')

print("=== FINAL MERGED DATA ===")
print(f"Number of counties: {len(merged)}")
print(f"Missing population data: {merged['Total_Population19'].isna().sum()} counties")

# IMPORTANT: Save WITHOUT simplification
# Use the original geometry as-is
merged.to_file("kenya_counties_with_population.geojson", driver="GeoJSON")

# Also save with the correct coordinate precision (6 decimal places is enough)
# This reduces file size while keeping accuracy
print("\n✅ Saved merged data to: kenya_counties_with_population.geojson")
print(f"   File size: {merged.shape[0]} counties with population data")