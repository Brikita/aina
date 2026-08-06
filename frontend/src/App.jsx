import { useState, useRef, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import { useAppContext } from './context/AppContext';
import WardLayer from './components/Map/WardLayer';
import Legend from './components/Map/Legend';
import LayerControlPanel from './components/Map/LayerControlPanel';
import RoadsLayer from './components/Map/RoadsLayer';
import RiversLayer from './components/Map/RiversLayer';
import LivelihoodLayer from './components/Map/LivelihoodLayer';
import IGADCountryLayer from './components/Map/IGADCountryLayer';
import CustomDrawingsLayer from './components/Map/CustomDrawingsLayer';
import DrawControl from './components/Map/DrawControl';
import 'leaflet/dist/leaflet.css';
import './App.css';

export default function App() {
  // Get state and functions from AppContext
  const {
    // Selected state
    selectedCounty,
    setSelectedCounty,
    // Data
    counties,
    warnings,
    assets,
    // Decision intelligence
    recommendations,
    riskLevel,
    isAnalyzing,
    fetchDecisionIntelligence,
    // Loading states
    countiesLoading,
    warningsLoading,
    assetsLoading,
  } = useAppContext();

  const [layers, setLayers] = useState({
    osm: true,
    satellite: false,
    dark: false,
    counties: true,
    roads: false,
    rivers: false,
    livelihood: false,
    custom_drawings: false,
    ethiopia: true,
    sudan: true,
    south_sudan: true,
    uganda: true,
    somalia: true,
    djibouti: true,
  });
  const [drawnFeatures, setDrawnFeatures] = useState(null);
  const mapRef = useRef(null);

  // Handle county click from the map
  const handleCountyClick = (countyData) => {
    console.log('📍 County clicked:', countyData);
    
    // Update selected county in context
    setSelectedCounty(countyData);
    
    // Create region data for decision intelligence
    const regionData = {
      id: countyData.id || countyData.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
      name: countyData.name || countyData.properties?.COUNTY || 'Unknown',
      hazardType: 'Flood',
      severity: 'High',
      context: `${countyData.name || countyData.properties?.COUNTY || 'County'} analysis requested`,
    };
    
    // Fetch decision intelligence from API (or fallback)
    fetchDecisionIntelligence(regionData);
  };

  // Handle county hover
  const handleCountyHover = (countyData) => {
    // Just log for now - could show preview
    console.log('👆 Hovering:', countyData?.name);
  };

  const handleDrawCreate = (layer) => {
    const geoJSON = layer.toGeoJSON ? layer.toGeoJSON() : layer;
    setDrawnFeatures(geoJSON);
    setLayers(prev => ({
      ...prev,
      custom_drawings: true
    }));
  };

  const handleDrawEdit = (layers) => {
    console.log('Shape edited:', layers);
  };

  const handleDrawDelete = (layers) => {
    if (!layers) {
      setDrawnFeatures(null);
      setLayers(prev => ({
        ...prev,
        custom_drawings: false
      }));
    }
  };

  const handleOpacityChange = (layerId, value) => {
    setLayers(prev => ({
      ...prev,
      [`${layerId}_opacity`]: value
    }));
  };

  const handleLayerSettings = (layerId) => {
    console.log('Settings clicked for:', layerId);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
      {/* Map Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <LeafletMap
          center={[0.5, 38]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={mapRef}
        >
          {/* Basemap Tiles */}
          {layers.osm && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={layers.osm_opacity || 1.0}
            />
          )}
          {layers.satellite && (
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              opacity={layers.satellite_opacity || 1.0}
            />
          )}
          {layers.dark && (
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              opacity={layers.dark_opacity || 1.0}
            />
          )}

          {/* Data Layers */}
          <WardLayer
            visible={layers.counties}
            onHover={handleCountyHover}
            onCountyClick={handleCountyClick}
            selectedFeature={selectedCounty}
            opacity={layers.counties_opacity || 1.0}
          />
          
          <RoadsLayer visible={layers.roads} />
          <RiversLayer visible={layers.rivers} />
          <LivelihoodLayer visible={layers.livelihood} />

          {/* IGAD Countries */}
          <IGADCountryLayer
            countryKey="ethiopia"
            visible={layers.ethiopia}
          />
          <IGADCountryLayer
            countryKey="sudan"
            visible={layers.sudan}
          />
          <IGADCountryLayer
            countryKey="south_sudan"
            visible={layers.south_sudan}
          />
          <IGADCountryLayer
            countryKey="uganda"
            visible={layers.uganda}
          />
          <IGADCountryLayer
            countryKey="somalia"
            visible={layers.somalia}
          />
          <IGADCountryLayer
            countryKey="djibouti"
            visible={layers.djibouti}
          />

          <CustomDrawingsLayer data={drawnFeatures} visible={layers.custom_drawings} />

          {/* Controls */}
          <DrawControl
            onDrawCreate={handleDrawCreate}
            onDrawEdit={handleDrawEdit}
            onDrawDelete={handleDrawDelete}
          />

          <LayerControlPanel
            layers={layers}
            setLayers={setLayers}
            onOpacityChange={handleOpacityChange}
            onLayerSettings={handleLayerSettings}
          />

          <Legend />
        </LeafletMap>
      </div>

      {/* Decision Panel - Right Side */}
      <div style={{
        width: '380px',
        minWidth: '380px',
        height: '100vh',
        overflowY: 'auto',
        background: '#f8f9fa',
        borderLeft: '1px solid #e0e0e0',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>AINA v5.0</h2>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '-8px' }}>
          Decision Intelligence Platform
        </p>
        <hr style={{ border: '0', borderTop: '1px solid #e0e0e0' }} />

        {selectedCounty ? (
          <div>
            {/* County Header */}
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              marginBottom: '16px',
            }}>
              <h3 style={{ margin: 0, color: '#1a1a2e' }}>
                📍 {selectedCounty.name || selectedCounty.properties?.COUNTY || 'Selected County'}
              </h3>
              {selectedCounty.properties && (
                <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Population:</strong> {selectedCounty.properties.Total_Population19?.toLocaleString() || 'N/A'}
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Households:</strong> {selectedCounty.properties.Households?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              )}
            </div>

            {/* Decision Analysis */}
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <h4 style={{ margin: '0 0 12px', color: '#1a1a2e' }}>
                🧠 Decision Analysis
              </h4>

              {isAnalyzing ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{
                    display: 'inline-block',
                    width: '30px',
                    height: '30px',
                    border: '3px solid #e0e0e0',
                    borderTop: '3px solid #1E90FF',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <p style={{ color: '#666', marginTop: '10px' }}>Analyzing...</p>
                </div>
              ) : (
                <>
                  {/* Risk Level */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: riskLevel === 'High' ? '#fee' : 
                               riskLevel === 'Medium' ? '#fff3cd' : '#d4edda',
                    borderRadius: '6px',
                    marginBottom: '12px',
                  }}>
                    <span style={{ fontWeight: 'bold' }}>Risk Level</span>
                    <span style={{
                      fontWeight: 'bold',
                      color: riskLevel === 'High' ? '#dc3545' : 
                             riskLevel === 'Medium' ? '#856404' : '#155724',
                    }}>
                      {riskLevel || 'Medium'}
                    </span>
                  </div>

                  {/* Recommendations */}
                  <h5 style={{ margin: '12px 0 8px', color: '#333' }}>Recommendations</h5>
                  {recommendations && recommendations.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {recommendations.map((rec, index) => (
                        <li key={index} style={{ marginBottom: '6px', color: '#333', fontSize: '13px' }}>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#999', fontSize: '13px' }}>
                      No recommendations available. Click a county to generate.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#999',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
            <h3 style={{ color: '#666' }}>Select a County</h3>
            <p style={{ fontSize: '14px' }}>
              Click on any county on the map to generate decision intelligence.
            </p>
          </div>
        )}

        {/* Loading State */}
        {countiesLoading && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#e3f2fd',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#1565c0',
          }}>
            Loading counties...
          </div>
        )}

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}