// @ts-ignore
import "leaflet/dist/leaflet.css";

import { useEffect, useState, useMemo } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { useAppContext } from "../../context/AppContext";
import "leaflet/dist/leaflet.css";

export function AinaMap() {
  // Get dashboard functions from AppContext
  const { 
    setActiveRegion, 
    fetchDecisionIntelligence,
    selectedCounty,
    setSelectedCounty,
  } = useAppContext();
  
  const [counties, setCounties] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load counties from local GeoJSON
  useEffect(() => {
    fetch('/data/kenya_counties_admin.geojson')
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.json();
      })
      .then(data => {
        console.log('✅ Counties loaded:', data.features?.length);
        setCounties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error loading counties:', err);
        setError(err.message);
        setLoading(false);
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

  // ⭐ CRITICAL: This connects the map to the dashboard
  const handleCountyClick = (feature: any) => {
    const props = feature.properties;
    const countyName = props.COUNTY || props.COUNTY_NAM || 'Unknown';
    
    console.log(`📍 County clicked: ${countyName}`);
    
    // 1. Highlight the county on the map
    setSelectedCounty(feature);
    
    // 2. Create region data for the dashboard
    const regionData = {
      id: countyName.toLowerCase().replace(/\s+/g, '-'),
      name: countyName,
      hazardType: "Flood",
      severity: "High",
      context: `${countyName} county analysis requested`,
    };
    
    // 3. ⭐ Update the dashboard (DecisionPanel)
    setActiveRegion(regionData);
    
    // 4. ⭐ Fetch recommendations for the dashboard
    fetchDecisionIntelligence(regionData);
  };

  const getCountyStyle = (feature: any) => {
    const isSelected = selectedCounty && 
      selectedCounty.properties?.COUNTY === feature.properties?.COUNTY;
    return isSelected ? selectedStyle : polygonStyle;
  };

  const onEachCounty = (feature: any, layer: any) => {
    layer.on({
      click: () => handleCountyClick(feature),
      mouseover: (e: any) => {
        e.target.setStyle(hoverStyle);
        e.target.bringToFront();
      },
      mouseout: (e: any) => {
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
        <p className="text-slate-400">Loading counties...</p>
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

      {/* Map Info Overlay */}
      <div className="pointer-events-none absolute left-4 top-4 max-w-sm rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
          Map Intelligence
        </p>
        <p className="mt-1 text-slate-200">
          {selectedCounty 
            ? `📍 ${selectedCounty.properties?.COUNTY || 'Selected'}`
            : 'Click a county to generate decision intelligence.'}
        </p>
      </div>
    </section>
  );
}