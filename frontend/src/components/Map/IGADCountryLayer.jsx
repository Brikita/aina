import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';

const COUNTRY_CONFIG = {
  kenya: {
    path: '/data/kenya_counties_admin.geojson',
    color: '#1E90FF',
    label: 'Kenya',
    emoji: '🇰🇪',
    level: 'county',
    adminLevel: 'County',
  },
  ethiopia: {
    path: '/data/eth_admin1.geojson',
    color: '#FF6B35',
    label: 'Ethiopia',
    emoji: '🇪🇹',
    level: 'region',
    adminLevel: 'Region',
  },
  sudan: {
    path: '/data/sdn_admin1.geojson',
    color: '#4CAF50',
    label: 'Sudan',
    emoji: '🇸🇩',
    level: 'state',
    adminLevel: 'State',
  },
  south_sudan: {
    path: '/data/ssd_admin1.geojson',
    color: '#00BCD4',
    label: 'South Sudan',
    emoji: '🇸🇸',
    level: 'state',
    adminLevel: 'State',
  },
  uganda: {
    path: '/data/uganda_districts.geojson',
    color: '#9C27B0',
    label: 'Uganda',
    emoji: '🇺🇬',
    level: 'district',
    adminLevel: 'District',
  },
  somalia: {
    path: '/data/som_admin1.geojson',
    color: '#FF9800',
    label: 'Somalia',
    emoji: '🇸🇴',
    level: 'region',
    adminLevel: 'Region',
  },
  djibouti: {
    path: '/data/djibouti_adm1.geojson',
    color: '#F44336',
    label: 'Djibouti',
    emoji: '🇩🇯',
    level: 'region',
    adminLevel: 'Region',
  },
  eritrea: {
    path: null,
    color: '#8BC34A',
    label: 'Eritrea',
    emoji: '🇪🇷',
    level: 'region',
    adminLevel: 'Region',
  },
};

export default function IGADCountryLayer({ 
  countryKey = null,
  visible = true,
  onHover,
  selectedFeature = null,
  opacity = 1.0,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const config = COUNTRY_CONFIG[countryKey];
  const dataPath = config?.path;

  useEffect(() => {
    if (!visible || !dataPath) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(dataPath)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.features && data.features.length > 0) {
          console.log(`✅ Loaded ${config.label}: ${data.features.length} features`);
          setData(data);
        } else {
          console.warn(`⚠️ ${config.label}: No features found`);
          setData(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(`❌ Error loading ${config.label}:`, err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [visible, dataPath, config]);

  if (!visible || loading) {
    if (loading && visible) {
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
          🌍 Loading {config?.label || 'country'}...
        </div>
      );
    }
    return null;
  }

  if (error || !data || !config) {
    return null;
  }

  const getDefaultStyle = (feature) => {
    const isSelected = selectedFeature?.properties?.NAME === feature?.properties?.NAME ||
                       selectedFeature?.properties?.name === feature?.properties?.name;
    
    if (isSelected) {
      return {
        fillColor: '#FFD700',
        fillOpacity: 0.35,
        color: '#FFD700',
        weight: 4,
      };
    }
    
    return {
      fillColor: config.color,
      fillOpacity: 0.2,
      color: config.color,
      weight: 2,
    };
  };

  const getHoverStyle = () => ({
    fillColor: '#FFD700',
    fillOpacity: 0.2,
    color: '#FFD700',
    weight: 3,
  });

  const onEachFeature = (feature, layer) => {
    if (!feature) return;

    const featureName = feature.properties?.NAME || 
                        feature.properties?.name || 
                        feature.properties?.COUNTY || 
                        feature.properties?.ADMIN1 || 
                        feature.properties?.DISTRICT ||
                        'Unknown';

    const isSelected = selectedFeature?.properties?.NAME === featureName ||
                       selectedFeature?.properties?.name === featureName;

    layer.on({
      mouseover: (e) => {
        layer.setStyle(getHoverStyle());
        layer.bringToFront();
        if (onHover) {
          onHover({
            country: config.label,
            name: featureName,
            feature: feature,
            adminLevel: config.adminLevel,
          });
        }
      },
      mouseout: (e) => {
        if (isSelected) {
          layer.setStyle({
            fillColor: '#FFD700',
            fillOpacity: 0.35,
            color: '#FFD700',
            weight: 4,
          });
        } else {
          layer.setStyle({
            fillColor: config.color,
            fillOpacity: 0.2,
            color: config.color,
            weight: 2,
          });
        }
      },
      click: (e) => {
        if (onHover) {
          onHover({
            country: config.label,
            name: featureName,
            feature: feature,
            adminLevel: config.adminLevel,
            isSelected: true,
          });
        }
      },
    });

    if (isSelected) {
      layer.setStyle({
        fillColor: '#FFD700',
        fillOpacity: 0.35,
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
            const name = feature.properties?.NAME || 
                         feature.properties?.name || 
                         feature.properties?.COUNTY || 
                         'Unknown';
            return `
              <div style="font-size: 12px; max-width: 200px;">
                <strong>${config.emoji} ${config.label}</strong>
                <div style="color: #666; font-size: 11px;">${config.adminLevel}: ${name}</div>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}