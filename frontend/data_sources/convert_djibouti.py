import geopandas as gpd
import os

print("Converting Djibouti shapefiles to GeoJSON...")

# Define the shapefile paths
adm0_shp = "DJIBOUTI/dji_admbnda_gadm_adm0_2022.shp"
adm1_shp = "DJIBOUTI/dji_admbnda_gadm_adm1_2022.shp"
adm2_shp = "DJIBOUTI/dji_admbnda_gadm_adm2_2022.shp"

def convert_shp(shp_path, output_name):
    if os.path.exists(shp_path):
        gdf = gpd.read_file(shp_path)
        
        # Convert to WGS84 if needed
        if gdf.crs != 'EPSG:4326':
            gdf = gdf.to_crs('EPSG:4326')
        
        # Simplify geometry
        gdf['geometry'] = gdf.geometry.simplify(0.001)
        
        output = f"djibouti_{output_name}.geojson"
        gdf.to_file(output, driver='GeoJSON')
        print(f"✅ Converted {output}: {len(gdf)} features")
        return output
    else:
        print(f"❌ File not found: {shp_path}")
        return None

convert_shp(adm0_shp, "adm0")
convert_shp(adm1_shp, "adm1")
convert_shp(adm2_shp, "adm2")

print("✅ Djibouti conversion complete!")