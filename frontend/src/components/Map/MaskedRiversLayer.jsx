import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';

export default function MaskedRiversLayer({ 
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

    fetch('/data/kenya_rivers.geojson')
      .then(res => res.json())
      .then(data => {
        console.log('Loaded rivers:', data.features?.length);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading rivers:', err);
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
            const riverGeom = feature.geometry;
            if (!riverGeom) return false;
            
            const riverBounds = L.geoJSON(feature).getBounds();
            const selectedBounds = L.geoJSON(selectedFeature).getBounds();
            
            if (!riverBounds.intersects(selectedBounds)) return false;
            return true;
          } catch (e) {
            return false;
          }
        })
      };
      
      console.log(`Filtered rivers: ${filtered.features.length} (from ${data.features.length})`);
      setFilteredData(filtered);
    } catch (e) {
      console.error('Error filtering rivers:', e);
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
        💧 No rivers found in this area
      </div>
    );
  }

  const getRiverName = (feature) => {
    const props = feature.properties || {};
    return props.name || props.NAME || props.river || props.RIVER || 'Unnamed River';
  };

  return (
    <div style={{ opacity: opacity }}>
      <GeoJSON
        data={filteredData}
        style={{
          color: '#2196F3',
          weight: 2,
          opacity: 0.7,
        }}
      >
        <Tooltip sticky>
          {(feature) => {
            const name = getRiverName(feature);
            return `
              <div style="font-size: 12px; max-width: 200px;">
                <strong>💧 ${name}</strong>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}