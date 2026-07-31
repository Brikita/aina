import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';
import { getSubCounties } from '../../services/api';

export default function SubCountyLayer({
  visible = true,
  countyName = null,
  onHover,
  selectedFeature = null,
  opacity = 1.0,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible || !countyName) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getSubCounties()
      .then(response => {
        console.log('✅ Sub-counties loaded from API:', response.data);
        // Filter sub-counties by county name
        const subcounties = response.data;
        const filtered = subcounties.filter(s => s.name && s.name.includes(countyName));

        // Convert to GeoJSON
        const features = filtered.map((subcounty, index) => {
          const geometry = {
            type: 'Polygon',
            coordinates: [
              [
                [39 + (index % 10) * 0.2, -1.5 + Math.floor(index / 10) * 0.2],
                [39.2 + (index % 10) * 0.2, -1.5 + Math.floor(index / 10) * 0.2],
                [39.2 + (index % 10) * 0.2, -1.3 + Math.floor(index / 10) * 0.2],
                [39 + (index % 10) * 0.2, -1.3 + Math.floor(index / 10) * 0.2],
                [39 + (index % 10) * 0.2, -1.5 + Math.floor(index / 10) * 0.2],
              ],
            ],
          };

          return {
            type: 'Feature',
            id: subcounty.id,
            properties: {
              subcounty: subcounty.name,
              county: countyName,
            },
            geometry: geometry,
          };
        });

        setData({
          type: 'FeatureCollection',
          features: features,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error loading sub-counties:', err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [visible, countyName]);

  if (!visible || loading || !data || data.features.length === 0) {
    if (loading) {
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
          📋 Loading sub-counties...
        </div>
      );
    }
    return null;
  }

  const getDefaultStyle = (feature) => {
    const isSelected = selectedFeature?.name === feature?.properties?.subcounty;
    
    if (isSelected) {
      return {
        fillColor: '#FFD700',
        fillOpacity: 0.5,
        color: '#FFD700',
        weight: 4,
      };
    }
    
    return {
      fillColor: '#4CAF50',
      fillOpacity: 0.25,
      color: '#4CAF50',
      weight: 1.5,
      dashArray: '4',
    };
  };

  const getHoverStyle = () => ({
    fillColor: '#FFD700',
    fillOpacity: 0.35,
    color: '#FFD700',
    weight: 3,
  });

  const onEachFeature = (feature, layer) => {
    if (!feature) return;

    const featureName = feature.properties?.subcounty || 'Unknown';
    const isSelected = selectedFeature?.name === featureName;

    layer.on({
      mouseover: (e) => {
        layer.setStyle(getHoverStyle());
        layer.bringToFront();
        if (onHover) {
          onHover({
            level: 'subcounty',
            name: featureName,
            feature: feature,
            county: feature.properties?.county,
          });
        }
      },
      mouseout: (e) => {
        if (isSelected) {
          layer.setStyle({
            fillColor: '#FFD700',
            fillOpacity: 0.5,
            color: '#FFD700',
            weight: 4,
          });
        } else {
          layer.setStyle({
            fillColor: '#4CAF50',
            fillOpacity: 0.25,
            color: '#4CAF50',
            weight: 1.5,
            dashArray: '4',
          });
        }
      },
      click: (e) => {
        if (onHover) {
          onHover({
            level: 'subcounty',
            name: featureName,
            feature: feature,
            county: feature.properties?.county,
            isSelected: true,
          });
        }
      },
    });

    if (isSelected) {
      layer.setStyle({
        fillColor: '#FFD700',
        fillOpacity: 0.5,
        color: '#FFD700',
        weight: 4,
      });
      layer.bringToFront();
    }
  };

  return (
    <div style={{ opacity: opacity }}>
      <GeoJSON
        data={data}
        style={getDefaultStyle}
        onEachFeature={onEachFeature}
      >
        <Tooltip sticky>
          {(feature) => {
            const name = feature.properties?.subcounty || 'Unknown';
            return `
              <div style="font-size: 12px; max-width: 200px;">
                <strong>📋 ${name}</strong>
                <div style="color: #666; font-size: 11px;">Sub-County</div>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}