import { useEffect, useState, useMemo } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useAppContext } from "../../context/AppContext";
import { getAssetsByCounty } from "../../services/api";
import "leaflet/dist/leaflet.css";

export function AinaMap() {
  const { setActiveRegion, fetchDecisionIntelligence, activeRegion } = useAppContext();
  
  const [counties, setCounties] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounty, setSelectedCounty] = useState(null);

  // Load county data from local GeoJSON
  useEffect(() => {
    fetch('/data/kenya_counties_admin.geojson')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Counties loaded:', data.features?.length);
        setCounties(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error loading counties:', err);
        setLoading(false);
      });
  }, []);

  // Load assets when a county is selected
  useEffect(() => {
    if (!selectedCounty) {
      setAssets([]);
      return;
    }

    const countyName = selectedCounty.properties?.COUNTY || selectedCounty.properties?.COUNTY_NAM;
    if (!countyName) return;

    getAssetsByCounty(countyName)
      .then(response => {
        console.log(`✅ Assets loaded for ${countyName}:`, response.data);
        setAssets(response.data);
      })
      .catch(err => {
        console.warn('⚠️ Assets not available:', err.message);
        setAssets([]);
      });
  }, [selectedCounty]);

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

  const handleCountyClick = (feature) => {
    const props = feature.properties;
    const countyName = props.COUNTY || props.COUNTY_NAM || 'Unknown';
    
    console.log(`📍 County clicked: ${countyName}`);
    setSelectedCounty(feature);
    
    // 1. Create region data for the context
    const regionData = {
      id: countyName.toLowerCase().replace(/\s+/g, '-'),
      name: countyName,
      hazardType: "Flood", // Default - will be updated by backend
      severity: "High",    // Default - will be updated by backend
      context: `${countyName} county analysis requested`,
    };
    
    // 2. Update AppContext (this triggers the DecisionPanel)
    setActiveRegion(regionData);
    
    // 3. Call the decision intelligence API
    fetchDecisionIntelligence(regionData);
  };

  const getCountyStyle = (feature) => {
    const isSelected = selectedCounty && 
      selectedCounty.properties?.COUNTY === feature.properties?.COUNTY;
    return isSelected ? selectedStyle : polygonStyle;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading map data...</p>
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
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        {/* All 47 Counties */}
        {counties && (
          <GeoJSON
            data={counties}
            style={getCountyStyle}
            onEachFeature={(feature, layer) => {
              layer.on({
                click: () => handleCountyClick(feature),
                mouseover: (e) => {
                  e.target.setStyle({
                    fillColor: '#FFD700',
                    fillOpacity: 0.35,
                    color: '#FFD700',
                    weight: 3,
                  });
                  e.target.bringToFront();
                },
                mouseout: (e) => {
                  const isSelected = selectedCounty && 
                    selectedCounty.properties?.COUNTY === feature.properties?.COUNTY;
                  if (!isSelected) {
                    e.target.setStyle({
                      fillColor: '#1E90FF',
                      fillOpacity: 0.2,
                      color: '#1E90FF',
                      weight: 2,
                    });
                  }
                },
              });
            }}
          />
        )}

        {/* Assets - Show when a county is selected */}
        {assets.length > 0 && assets.map((asset, index) => {
          const location = asset.location || {};
          const lat = location.latitude || asset.latitude || 0;
          const lon = location.longitude || asset.longitude || 0;
          
          if (!lat || !lon) return null;
          
          return (
            <Marker key={`${asset.id}-${index}`} position={[lat, lon]}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold">{asset.name || 'Unknown Asset'}</h4>
                  <p className="text-sm">Type: {asset.type || 'Unknown'}</p>
                  <p className="text-sm">County: {asset.county || 'Unknown'}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Info Overlay */}
      <div className="pointer-events-none absolute left-4 top-4 max-w-sm rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
          Map Intelligence
        </p>
        <p className="mt-1 text-slate-200">
          {selectedCounty 
            ? `📍 ${selectedCounty.properties.COUNTY || selectedCounty.properties.COUNTY_NAM || 'Selected'}`
            : 'Click a county polygon to generate decision intelligence.'}
        </p>
        {assets.length > 0 && (
          <p className="mt-1 text-xs text-emerald-400">
            {assets.length} asset{assets.length > 1 ? 's' : ''} found
          </p>
        )}
      </div>
    </section>
  );
}