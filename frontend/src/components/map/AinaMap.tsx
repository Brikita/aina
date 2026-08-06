// @ts-ignore
import "leaflet/dist/leaflet.css";

import { useEffect, useState, useMemo } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { useAppContext } from "../../context/AppContext";
import { getCounties } from "../../services/api";
import type { Feature, FeatureCollection, Geometry } from 'geojson';

// Define RegionData interface
interface RegionData {
  id: string;
  name: string;
  hazardType: string;
  severity: string;
  context: string;
}

// Define County Properties
interface CountyProperties {
  COUNTY?: string;
  COUNTY_NAM?: string;
  id?: number;
  [key: string]: unknown;
}

type CountyFeature = Feature<Geometry, CountyProperties>;

// Define API response type
interface ApiCountyItem {
  id: number;
  name: string;
}

export function AinaMap() {
  const { setActiveRegion, fetchDecisionIntelligence } = useAppContext();
  
  const [counties, setCounties] = useState<FeatureCollection | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<CountyFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load counties from API
  useEffect(() => {
    getCounties()
      .then((response: { data: ApiCountyItem[] }) => {
        console.log('✅ Counties loaded from API:', response.data);
        
        const features: CountyFeature[] = response.data.map((item: ApiCountyItem, index: number) => ({
          type: "Feature",
          id: item.id,
          properties: {
            COUNTY: item.name,
            id: item.id,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [39 + (index % 10) * 0.3, -1.5 + Math.floor(index / 10) * 0.3],
                [39.3 + (index % 10) * 0.3, -1.5 + Math.floor(index / 10) * 0.3],
                [39.3 + (index % 10) * 0.3, -1.2 + Math.floor(index / 10) * 0.3],
                [39 + (index % 10) * 0.3, -1.2 + Math.floor(index / 10) * 0.3],
                [39 + (index % 10) * 0.3, -1.5 + Math.floor(index / 10) * 0.3],
              ],
            ],
          },
        }));

        setCounties({
          type: "FeatureCollection",
          features: features,
        } as FeatureCollection);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('❌ Error loading counties from API:', err);
        setError(err.message);
        setLoading(false);
        
        // Fallback: Load from local GeoJSON if API fails
        fetch('/data/kenya_counties_admin.geojson')
          .then(res => res.json())
          .then((data: FeatureCollection) => {
            console.log('✅ Using fallback local GeoJSON');
            setCounties(data);
            setLoading(false);
          })
          .catch(() => {
            console.error('❌ Fallback also failed');
            setLoading(false);
          });
      });
  }, []);

  const polygonStyle = useMemo(
    () => ({
      color: "#1E90FF",
      weight: 2,
      fillColor: "#1E90FF",
      fillOpacity: 0.2,
    }),
    [],
  );

  const selectedStyle = useMemo(
    () => ({
      color: "#FFD700",
      weight: 4,
      fillColor: "#FFD700",
      fillOpacity: 0.5,
    }),
    [],
  );

  const hoverStyle = useMemo(
    () => ({
      color: "#FFD700",
      weight: 3,
      fillColor: "#FFD700",
      fillOpacity: 0.35,
    }),
    [],
  );

  const handleCountyClick = (feature: CountyFeature) => {
    const props = feature.properties;
    const countyName = props.COUNTY || props.COUNTY_NAM || 'Unknown';
    const countyId = props.id || feature.id || 0;
    
    console.log(`📍 County clicked: ${countyName} (ID: ${countyId})`);
    setSelectedCounty(feature);
    
    // ✅ Define regionData with proper type
    const regionData: RegionData = {
      id: String(countyId) || countyName.toLowerCase().replace(/\s+/g, '-'),
      name: countyName,
      hazardType: "Flood",
      severity: "High",
      context: `${countyName} county analysis requested`,
    };
    
    setActiveRegion(regionData);
    fetchDecisionIntelligence(regionData);
  };

  const getCountyStyle = (feature: CountyFeature) => {
    const isSelected = selectedCounty && 
      selectedCounty.properties?.COUNTY === feature.properties?.COUNTY;
    return isSelected ? selectedStyle : polygonStyle;
  };

  const onEachCounty = (feature: CountyFeature, layer: any) => {
    layer.on({
      click: () => handleCountyClick(feature),
      mouseover: (e: { target: { setStyle: (style: unknown) => void; bringToFront: () => void } }) => {
        e.target.setStyle(hoverStyle);
        e.target.bringToFront();
      },
      mouseout: (e: { target: { setStyle: (style: unknown) => void } }) => {
        const isSelected = selectedCounty && 
          selectedCounty.properties?.COUNTY === feature.properties?.COUNTY;
        if (!isSelected) {
          e.target.setStyle(polygonStyle);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 rounded-3xl">
        <p className="text-slate-400">Loading counties from API...</p>
      </div>
    );
  }

  if (error && !counties) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 rounded-3xl">
        <p className="text-red-400">Error loading counties: {error}</p>
      </div>
    );
  }

  return (
    <section className="relative h-full min-h-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl">
      <MapContainer
        center={[0.5, 38]}
        zoom={5}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {counties && (
          <GeoJSON
            data={counties}
            style={getCountyStyle}
            onEachFeature={onEachCounty}
          />
        )}
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 max-w-sm rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
          Map Intelligence
        </p>
        <p className="mt-1 text-slate-200">
          {selectedCounty 
            ? `📍 ${selectedCounty.properties?.COUNTY || 'Selected'}`
            : 'Click a county polygon to generate decision intelligence.'}
        </p>
      </div>
    </section>
  );
}