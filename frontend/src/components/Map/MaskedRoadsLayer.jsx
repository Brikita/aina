import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';

export default function MaskedRoadsLayer({ 
  visible = true, 
  selectedFeature = null,
  selectedLevel = null,
  opacity = 1.0,
}) {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) {
      setData(null);
      setFilteredData(null);
      setLoading(false);
      return;
    }

    fetch('/data/kenya_roads.geojson')
      .then(res => res.json())
      .then(data => {
        console.log('Loaded roads:', data.features?.length);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading roads:', err);
        setLoading(false);
      });
  }, [visible]);

  useEffect(() => {
    if (!data || !visible) {
      setFilteredData(null);
      return;
    }

    if (!selectedFeature || !selectedLevel) {
      setFilteredData(data);
      return;
    }

    try {
      const selectedGeometry = selectedFeature.geometry;
      
      const filtered = {
        ...data,
        features: data.features.filter(feature => {
          try {
            const roadGeom = feature.geometry;
            if (!roadGeom) return false;
            
            const roadBounds = L.geoJSON(feature).getBounds();
            const selectedBounds = L.geoJSON(selectedFeature).getBounds();
            
            if (!roadBounds.intersects(selectedBounds)) return false;
            return true;
          } catch (e) {
            return false;
          }
        })
      };
      
      console.log(`Filtered roads: ${filtered.features.length} (from ${data.features.length})`);
      setFilteredData(filtered);
    } catch (e) {
      console.error('Error filtering roads:', e);
      setFilteredData(data);
    }
  }, [data, selectedFeature, selectedLevel, visible]);

  if (!visible || loading || !filteredData) return null;
  if (filteredData.features.length === 0) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '140px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '12px',
      }}>
        🛣️ No roads found in this area
      </div>
    );
  }

  const getRoadName = (feature) => {
    const props = feature.properties || {};
    return props.name || props.NAME || props.road || props.ROAD || 'Unnamed Road';
  };

  return (
    <div style={{ opacity: opacity }}>
      <GeoJSON
        data={filteredData}
        style={{
          color: '#FF6B35',
          weight: 2,
          opacity: 0.8,
        }}
      >
        <Tooltip sticky>
          {(feature) => {
            const name = getRoadName(feature);
            return `
              <div style="font-size: 12px; max-width: 200px;">
                <strong>🛣️ ${name}</strong>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}