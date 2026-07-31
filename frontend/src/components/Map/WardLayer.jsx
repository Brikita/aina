import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';
import { getCounties } from '../../services/api';

export default function WardLayer({
  visible = true,
  onHover,
  selectedFeature = null,
  opacity = 1.0,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Load local GeoJSON for geometry
    fetch('/data/kenya_counties_admin.geojson')
      .then(res => {
        if (!res.ok) throw new Error('GeoJSON file not found');
        return res.json();
      })
      .then(geoJsonData => {
        // Then fetch county data from API to get IDs and any additional info
        return getCounties()
          .then(apiResponse => {
            console.log('✅ API Counties:', apiResponse.data);
            
            // Create a lookup map of county names to IDs
            const countyMap = {};
            apiResponse.data.forEach(c => {
              countyMap[c.name] = c.id;
            });

            // Add API data to GeoJSON features
            const enrichedFeatures = geoJsonData.features.map(feature => {
              const countyName = feature.properties.COUNTY || feature.properties.COUNTY_NAM || '';
              const apiId = countyMap[countyName] || null;
              
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  api_id: apiId,
                  county_name: countyName,
                }
              };
            });

            setData({
              type: 'FeatureCollection',
              features: enrichedFeatures,
            });
            setLoading(false);
          });
      })
      .catch(err => {
        console.error('❌ Error loading county data:', err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [visible]);

  if (!visible || loading || !data) {
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
          🏛️ Loading counties...
        </div>
      );
    }
    return null;
  }

  const getDefaultStyle = (feature) => {
    const featureName = feature.properties?.COUNTY || feature.properties?.COUNTY_NAM || '';
    const isSelected = selectedFeature?.name === featureName;
    
    if (isSelected) {
      return {
        fillColor: '#FFD700',
        fillOpacity: 0.5,
        color: '#FFD700',
        weight: 4,
      };
    }
    
    return {
      fillColor: '#1E90FF',
      fillOpacity: 0.2,
      color: '#1E90FF',
      weight: 2,
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

    const featureName = feature.properties?.COUNTY || feature.properties?.COUNTY_NAM || 'Unknown';
    const isSelected = selectedFeature?.name === featureName;

    layer.on({
      mouseover: (e) => {
        layer.setStyle(getHoverStyle());
        layer.bringToFront();
        if (onHover) {
          onHover({
            level: 'county',
            name: featureName,
            feature: feature,
            id: feature.properties?.api_id,
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
            fillColor: '#1E90FF',
            fillOpacity: 0.2,
            color: '#1E90FF',
            weight: 2,
          });
        }
      },
      click: (e) => {
        if (onHover) {
          onHover({
            level: 'county',
            name: featureName,
            feature: feature,
            id: feature.properties?.api_id,
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
            const name = feature.properties?.COUNTY || feature.properties?.COUNTY_NAM || 'Unknown';
            return `
              <div style="font-size: 12px; max-width: 200px;">
                <strong>🏛️ ${name}</strong>
                <div style="color: #666; font-size: 11px;">County</div>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}