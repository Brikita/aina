import { useState, useRef, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import WardLayer from './components/Map/WardLayer';
import SubCountyLayer from './components/Map/SubCountyLayer';
import LayerControlPanel from './components/Map/LayerControlPanel';
import InfoPanel from './components/Map/InfoPanel';
import AdminPanel from './components/Map/AdminPanel';
import DrawControl from './components/Map/DrawControl';
import WarningLayer from './components/Map/WarningLayer';
import AssetLayer from './components/Map/AssetLayer';
import DashboardStats from './components/Map/DashboardStats';
import IGADCountryLayer from './components/Map/IGADCountryLayer';
import ContextPanel from './components/ContextPanel';
import ImpactPanel from './components/Map/ImpactPanel';
import RecommendationsPanel from './components/Map/RecommendationsPanel';
import SimulationPanel from './components/Map/SimulationPanel';
import AllocationsPanel from './components/Map/AllocationsPanel';
import dataManager from './services/DataManager';
import { zoomToFeature, zoomToKenya } from './utils/zoomUtils';
import 'leaflet/dist/leaflet.css';
import './App.css';

export default function App() {
  const [layers, setLayers] = useState({
    osm: true,
    satellite: false,
    dark: false,
    counties: true,
    subcounties: false,
    warnings: false,
    assets: false,
    ethiopia: true,
    sudan: true,
    south_sudan: true,
    uganda: true,
    somalia: true,
    djibouti: true,
    osm_opacity: 1.0,
    satellite_opacity: 1.0,
    dark_opacity: 1.0,
    counties_opacity: 1.0,
    subcounties_opacity: 1.0,
    warnings_opacity: 1.0,
    assets_opacity: 1.0,
  });
  const [drawnFeatures, setDrawnFeatures] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedSubCounty, setSelectedSubCounty] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showImpact, setShowImpact] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showAllocations, setShowAllocations] = useState(false);
  const [warningId, setWarningId] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrawCreate = (layer) => {
    const geoJSON = layer.toGeoJSON ? layer.toGeoJSON() : layer;
    setDrawnFeatures(geoJSON);
  };

  const handleDrawEdit = (layers) => {
    console.log('Shape edited:', layers);
  };

  const handleDrawDelete = (layers) => {
    if (!layers) {
      setDrawnFeatures(null);
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

  const closeInfoPanel = () => {
    setIsInfoPanelVisible(false);
    setInfoData(null);
  };

  const openInfoPanel = () => {
    setIsInfoPanelVisible(true);
  };

  const handleCountyHover = (data) => {
    if (data) {
      setInfoData(data);
      setIsInfoPanelVisible(true);
    }
    if (data && data.isSelected) {
      setSelectedCounty({
        name: data.name,
        feature: data.feature,
        id: data.id,
      });
      setSelectedSubCounty(null);
      setLayers(prev => ({
        ...prev,
        subcounties: true,
      }));
      
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 60);
      }
    }
  };

  const handleSubCountyHover = (data) => {
    if (data) {
      setInfoData(data);
      setIsInfoPanelVisible(true);
    }
    if (data && data.isSelected) {
      setSelectedSubCounty(data);
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 50);
      }
    }
  };

  const handleWarningClick = (warning) => {
    setInfoData({
      level: 'warning',
      name: `${warning.hazard} - ${warning.county}`,
      hazard: warning.hazard,
      severity: warning.severity,
      county: warning.county,
      status: warning.status,
      issued_at: warning.issued_at,
    });
    setIsInfoPanelVisible(true);
    setWarningId(warning.id);
    setShowImpact(true);
    setShowRecommendations(true);
    setShowSimulation(true);
    setShowAllocations(true);
  };

  const handleAssetClick = (asset) => {
    setInfoData({
      level: 'asset',
      name: asset.name || 'Unknown Asset',
      type: asset.type || 'Unknown',
      county: asset.county || 'Unknown',
      capacity: asset.capacity || 'N/A',
    });
    setIsInfoPanelVisible(true);
  };

  const handleCountryHover = (data) => {
    if (data) {
      setInfoData({
        level: 'country',
        name: data.name,
        country: data.country,
        adminLevel: data.adminLevel || 'Region',
        isSelected: data.isSelected || false,
      });
      setIsInfoPanelVisible(true);
      
      if (data.isSelected && data.feature && mapRef.current) {
        zoomToFeature(data.feature, mapRef.current, 40);
      }
    }
  };

  const handleReset = () => {
    setSelectedCounty(null);
    setSelectedSubCounty(null);
    setInfoData(null);
    setIsInfoPanelVisible(false);
    setShowImpact(false);
    setShowRecommendations(false);
    setShowSimulation(false);
    setShowAllocations(false);
    setWarningId(null);
    setLayers(prev => ({
      ...prev,
      subcounties: false,
    }));
    
    if (mapRef.current) {
      zoomToKenya(mapRef.current);
    }
  };

  const handleNavigate = (level, data) => {
    if (level === 'root') {
      handleReset();
    } else if (level === 'county') {
      setSelectedCounty(data);
      setSelectedSubCounty(null);
      setLayers(prev => ({
        ...prev,
        subcounties: true,
      }));
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 60);
      }
    } else if (level === 'subcounty') {
      setSelectedSubCounty(data);
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 50);
      }
    }
  };

  const getSelectedFeature = () => {
    if (selectedSubCounty) return selectedSubCounty.feature;
    if (selectedCounty) return selectedCounty.feature;
    return null;
  };

  const getSelectedLevel = () => {
    if (selectedSubCounty) return 'subcounty';
    if (selectedCounty) return 'county';
    return null;
  };

  return (
    <div className="app-container">
      <div className="map-wrapper">
        <LeafletMap
          center={[5, 38]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={mapRef}
        >
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

          <WardLayer 
            visible={layers.counties} 
            onHover={handleCountyHover}
            selectedFeature={selectedCounty}
            opacity={layers.counties_opacity || 1.0}
          />

          <SubCountyLayer 
            visible={layers.subcounties}
            countyName={selectedCounty?.name}
            onHover={handleSubCountyHover}
            selectedFeature={selectedSubCounty}
            opacity={layers.subcounties_opacity || 1.0}
          />

          <WarningLayer 
            visible={layers.warnings}
            onWarningClick={handleWarningClick}
          />

          <AssetLayer 
            visible={layers.assets}
            countyFilter={selectedCounty?.name}
            onAssetClick={handleAssetClick}
          />

          <IGADCountryLayer 
            countryKey="ethiopia"
            visible={layers.ethiopia}
            onHover={handleCountryHover}
          />
          <IGADCountryLayer 
            countryKey="sudan"
            visible={layers.sudan}
            onHover={handleCountryHover}
          />
          <IGADCountryLayer 
            countryKey="south_sudan"
            visible={layers.south_sudan}
            onHover={handleCountryHover}
          />
          <IGADCountryLayer 
            countryKey="uganda"
            visible={layers.uganda}
            onHover={handleCountryHover}
          />
          <IGADCountryLayer 
            countryKey="somalia"
            visible={layers.somalia}
            onHover={handleCountryHover}
          />
          <IGADCountryLayer 
            countryKey="djibouti"
            visible={layers.djibouti}
            onHover={handleCountryHover}
          />

          <DrawControl 
            onDrawCreate={handleDrawCreate}
            onDrawEdit={handleDrawEdit}
            onDrawDelete={handleDrawDelete}
          />
        </LeafletMap>
      </div>

      <div className="ui-overlay">
        <DashboardStats visible={true} isMobile={isMobile} />

        <LayerControlPanel 
          layers={layers}
          setLayers={setLayers}
          onOpacityChange={handleOpacityChange}
          onLayerSettings={handleLayerSettings}
          isMobile={isMobile}
        />

        <ContextPanel 
          county={selectedCounty}
          warning={infoData?.level === 'warning' ? infoData : null}
          onAction={(action) => console.log('Action:', action)}
          isMobile={isMobile}
        />

        <InfoPanel 
          data={infoData}
          isMobile={isMobile}
          onClose={closeInfoPanel}
        />

        {!isInfoPanelVisible && (
          <button
            onClick={openInfoPanel}
            style={{
              position: 'fixed',
              right: '20px',
              top: '145px',
              zIndex: 2000,
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
              width: '44px',
              height: '44px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)'}
            title="Open Info Panel"
          >
            ℹ️
          </button>
        )}

        <AdminPanel 
          selectedCounty={selectedCounty}
          selectedSubCounty={selectedSubCounty}
          onNavigate={handleNavigate}
          onReset={handleReset}
          isMobile={isMobile}
        />

        <ImpactPanel 
          visible={showImpact}
          warningId={warningId}
          onClose={() => setShowImpact(false)}
          isMobile={isMobile}
        />

        <RecommendationsPanel
          visible={showRecommendations}
          warningId={warningId}
          onClose={() => setShowRecommendations(false)}
          isMobile={isMobile}
        />

        <SimulationPanel
          visible={showSimulation}
          warningId={warningId}
          onClose={() => setShowSimulation(false)}
          isMobile={isMobile}
        />

        <AllocationsPanel
          visible={showAllocations}
          warningId={warningId}
          onClose={() => setShowAllocations(false)}
          isMobile={isMobile}
        />

        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          zIndex: 2000,
          fontSize: '9px',
          color: '#999',
          background: 'rgba(255,255,255,0.8)',
          padding: '4px 8px',
          borderRadius: '4px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}>
          Cache: {dataManager.size()}/{dataManager.MAX_CACHE_SIZE}
        </div>
      </div>
    </div>
  );
}