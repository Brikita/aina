import { useState, useRef, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import WardLayer from './components/Map/WardLayer';
import SubCountyLayer from './components/Map/SubCountyLayer';
import WardLayerNew from './components/Map/WardLayerNew';
import VillageLayer from './components/Map/VillageLayer';
import Legend from './components/Map/Legend';
import LayerControlPanel from './components/Map/LayerControlPanel';
import InfoPanel from './components/Map/InfoPanel';
import AdminPanel from './components/Map/AdminPanel';
import MaskedRoadsLayer from './components/Map/MaskedRoadsLayer';
import MaskedRiversLayer from './components/Map/MaskedRiversLayer';
import LivelihoodLayer from './components/Map/LivelihoodLayer';
import CustomDrawingsLayer from './components/Map/CustomDrawingsLayer';
import DrawControl from './components/Map/DrawControl';
import ClusteredHealthFacilitiesLayer from './components/Map/ClusteredHealthFacilitiesLayer';
import BoreholeLayer from './components/Map/BoreholeLayer';
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
    wards: false,
    villages: false,
    roads: false,
    rivers: false,
    livelihood: false,
    health: false,
    boreholes: false,
    custom_drawings: false,
    // Opacity values
    osm_opacity: 1.0,
    satellite_opacity: 1.0,
    dark_opacity: 1.0,
    counties_opacity: 1.0,
    subcounties_opacity: 1.0,
    wards_opacity: 1.0,
    villages_opacity: 1.0,
    roads_opacity: 1.0,
    rivers_opacity: 1.0,
    livelihood_opacity: 1.0,
    health_opacity: 1.0,
    boreholes_opacity: 1.0,
    custom_drawings_opacity: 1.0,
  });
  const [drawnFeatures, setDrawnFeatures] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedSubCounty, setSelectedSubCounty] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [infoData, setInfoData] = useState(null);
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  const closeInfoPanel = () => {
    setIsInfoPanelVisible(false);
    setInfoData(null);
  };

  const openInfoPanel = () => {
    setIsInfoPanelVisible(true);
  };

  const handleCountyHover = (data) => {
    if (data) {
      const enhancedData = {
        ...data,
        subcountyCount: data.subcountyCount || 0,
      };
      setInfoData(enhancedData);
      setIsInfoPanelVisible(true);
    }
    if (data && data.isSelected) {
      setSelectedCounty(data);
      setSelectedSubCounty(null);
      setSelectedWard(null);
      setSelectedVillage(null);
      setLayers(prev => ({
        ...prev,
        subcounties: true,
        wards: false,
        villages: false
      }));
      
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 60);
      }
    }
  };

  const handleSubCountyHover = (data) => {
    if (data) {
      const enhancedData = {
        ...data,
        wardCount: data.wardCount || 0,
      };
      setInfoData(enhancedData);
      setIsInfoPanelVisible(true);
    }
    if (data && data.isSelected) {
      setSelectedSubCounty(data);
      setSelectedWard(null);
      setSelectedVillage(null);
      setLayers(prev => ({
        ...prev,
        wards: true,
        villages: false
      }));
      
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 50);
      }
    }
  };

  const handleWardHover = (data) => {
    if (data) {
      setInfoData(data);
      setIsInfoPanelVisible(true);
    }
    if (data && data.isSelected) {
      setSelectedWard(data);
      setSelectedVillage(null);
      setLayers(prev => ({
        ...prev,
        villages: true
      }));
      
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 40);
      }
    }
  };

  const handleVillageHover = (data) => {
    if (data) {
      setInfoData(data);
      setIsInfoPanelVisible(true);
    }
    if (data && data.isSelected) {
      setSelectedVillage(data);
      
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 30);
      }
    }
  };

  const handleHealthFacilityClick = (facility) => {
    setInfoData({
      level: 'health_facility',
      name: facility.name || 'Unknown',
      type: facility.type || 'Unknown',
      ownership: facility.ownership || 'Unknown',
      county: facility.county || 'Unknown',
    });
    setIsInfoPanelVisible(true);
  };

  const handleBoreholeClick = (borehole) => {
    setInfoData({
      level: 'borehole',
      name: borehole.name || 'Unknown Borehole',
      status: borehole.status || 'Unknown',
      county: borehole.county || 'Unknown',
      well_depth: borehole.well_depth || 'Unknown',
      yield: borehole.yield || 'Unknown',
    });
    setIsInfoPanelVisible(true);
  };

  const handleReset = () => {
    setSelectedCounty(null);
    setSelectedSubCounty(null);
    setSelectedWard(null);
    setSelectedVillage(null);
    setInfoData(null);
    setIsInfoPanelVisible(false);
    setLayers(prev => ({
      ...prev,
      subcounties: false,
      wards: false,
      villages: false
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
      setSelectedWard(null);
      setSelectedVillage(null);
      setLayers(prev => ({
        ...prev,
        subcounties: true,
        wards: false,
        villages: false
      }));
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 60);
      }
    } else if (level === 'subcounty') {
      setSelectedSubCounty(data);
      setSelectedWard(null);
      setSelectedVillage(null);
      setLayers(prev => ({
        ...prev,
        wards: true,
        villages: false
      }));
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 50);
      }
    } else if (level === 'ward') {
      setSelectedWard(data);
      setSelectedVillage(null);
      setLayers(prev => ({
        ...prev,
        villages: true
      }));
      if (mapRef.current && data.feature) {
        zoomToFeature(data.feature, mapRef.current, 40);
      }
    }
  };

  const hasChildSelected = !!(selectedSubCounty || selectedWard || selectedVillage);

  const getSelectedFeature = () => {
    if (selectedVillage) return selectedVillage.feature;
    if (selectedWard) return selectedWard.feature;
    if (selectedSubCounty) return selectedSubCounty.feature;
    if (selectedCounty) return selectedCounty.feature;
    return null;
  };

  const getSelectedLevel = () => {
    if (selectedVillage) return 'village';
    if (selectedWard) return 'ward';
    if (selectedSubCounty) return 'subcounty';
    if (selectedCounty) return 'county';
    return null;
  };

  return (
    <div className="app-container">
      <div className="map-wrapper">
        <LeafletMap
          center={[0.5, 38]}
          zoom={6}
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

          <div style={{ opacity: layers.counties_opacity || 1.0 }}>
            <WardLayer 
              visible={layers.counties} 
              onHover={handleCountyHover}
              selectedFeature={selectedCounty}
              hasChildSelected={hasChildSelected}
            />
          </div>

          <div style={{ opacity: layers.subcounties_opacity || 1.0 }}>
            <SubCountyLayer 
              visible={layers.subcounties}
              countyName={selectedCounty?.name}
              onHover={handleSubCountyHover}
              selectedFeature={selectedSubCounty}
            />
          </div>

          <div style={{ opacity: layers.wards_opacity || 1.0 }}>
            <WardLayerNew 
              visible={layers.wards}
              subCountyName={selectedSubCounty?.name}
              onHover={handleWardHover}
              selectedFeature={selectedWard}
            />
          </div>

          <div style={{ opacity: layers.villages_opacity || 1.0 }}>
            <VillageLayer 
              visible={layers.villages && selectedWard !== null}
              wardName={selectedWard?.name}
              wardId={selectedWard?.id}
              onHover={handleVillageHover}
              selectedFeature={selectedVillage}
            />
          </div>

          <MaskedRoadsLayer 
            visible={layers.roads}
            selectedFeature={getSelectedFeature()}
            selectedLevel={getSelectedLevel()}
            opacity={layers.roads_opacity || 1.0}
          />

          <MaskedRiversLayer 
            visible={layers.rivers}
            selectedFeature={getSelectedFeature()}
            selectedLevel={getSelectedLevel()}
            opacity={layers.rivers_opacity || 1.0}
          />

          <LivelihoodLayer 
            visible={layers.livelihood}
            opacity={layers.livelihood_opacity || 1.0}
          />
          
          {/* Health Facilities */}
          <ClusteredHealthFacilitiesLayer 
            visible={layers.health && selectedCounty !== null}
            countyFilter={selectedCounty?.name}
            onFacilityClick={handleHealthFacilityClick}
            opacity={layers.health_opacity || 1.0}
          />

          <BoreholeLayer 
            visible={layers.boreholes && selectedCounty !== null}
            dataPath="/data/turkana_boreholes.geojson"
            countyFilter={selectedCounty?.name}
            onBoreholeClick={handleBoreholeClick}
            opacity={layers.boreholes_opacity || 1.0}
          />

          <BoreholeLayer 
            visible={layers.boreholes && selectedCounty !== null}
            dataPath="/data/marsabit_boreholes.geojson"
            countyFilter={selectedCounty?.name}
            onBoreholeClick={handleBoreholeClick}
            opacity={layers.boreholes_opacity || 1.0}
          />

          <CustomDrawingsLayer 
            data={drawnFeatures} 
            visible={layers.custom_drawings}
            opacity={layers.custom_drawings_opacity || 1.0}
          />

          <DrawControl 
            onDrawCreate={handleDrawCreate}
            onDrawEdit={handleDrawEdit}
            onDrawDelete={handleDrawDelete}
          />
        </LeafletMap>
      </div>

      <div className="ui-overlay">
        <Legend />
        
        <LayerControlPanel 
          layers={layers}
          setLayers={setLayers}
          onOpacityChange={handleOpacityChange}
          onLayerSettings={handleLayerSettings}
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
              top: '80px',
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
          selectedWard={selectedWard}
          selectedVillage={selectedVillage}
          onNavigate={handleNavigate}
          onReset={handleReset}
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