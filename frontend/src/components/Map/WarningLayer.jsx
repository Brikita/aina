import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';
import { getWarnings } from '../../services/api';

// Hazard colors
const HAZARD_COLORS = {
  Flood: { fill: '#DC2626', border: '#991B1B', label: 'Flood' },
  Drought: { fill: '#F59E0B', border: '#92400E', label: 'Drought' },
  Landslide: { fill: '#8B4513', border: '#5D2E0C', label: 'Landslide' },
};

export default function WarningLayer({ visible = true, onWarningClick }) {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!visible) {
      setWarnings([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    setError(null);

    getWarnings()
      .then(response => {
        console.log('✅ Warnings loaded from API:', response.data);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setWarnings(data);
        setStatus('success');
      })
      .catch(err => {
        console.error('❌ API Error:', err.message);
        setError(err.message);
        setStatus('error');
      });
  }, [visible]);

  if (!visible) return null;

  if (status === 'loading') {
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
        ⚠️ Loading warnings from server...
      </div>
    );
  }

  if (status === 'error') {
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
        ❌ Server Error: {error || 'Unable to load warnings'}
        <div style={{ fontSize: '10px', marginTop: '4px', color: '#F59E0B' }}>
          Please check with your teammate to fix the /warnings/ endpoint
        </div>
      </div>
    );
  }

  if (warnings.length === 0) {
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
        ℹ️ No warnings in the database
      </div>
    );
  }

  const createGeoJSON = () => {
    const features = warnings.map((warning, index) => {
      const hazardColor = HAZARD_COLORS[warning.hazard] || { fill: '#999', border: '#666' };

      const geometry = {
        type: 'Polygon',
        coordinates: [
          [
            [39 + index * 0.3, -1.5 + index * 0.3],
            [39.3 + index * 0.3, -1.5 + index * 0.3],
            [39.3 + index * 0.3, -1.2 + index * 0.3],
            [39 + index * 0.3, -1.2 + index * 0.3],
            [39 + index * 0.3, -1.5 + index * 0.3],
          ],
        ],
      };

      return {
        type: 'Feature',
        id: warning.id,
        properties: {
          ...warning,
          hazard_color: hazardColor.fill,
        },
        geometry: geometry,
      };
    });

    return {
      type: 'FeatureCollection',
      features: features,
    };
  };

  const geoJSONData = createGeoJSON();

  const getStyle = (feature) => {
    const props = feature.properties || {};
    const fillColor = props.hazard_color || '#999';

    return {
      fillColor: fillColor,
      fillOpacity: 0.4,
      color: fillColor,
      weight: 2,
      dashArray: '5,5',
    };
  };

  const getHoverStyle = () => ({
    fillColor: 'yellow',
    fillOpacity: 0.5,
    color: 'yellow',
    weight: 3,
  });

  const onEachFeature = (feature, layer) => {
    if (!feature) return;

    const props = feature.properties || {};

    layer.on({
      mouseover: (e) => {
        layer.setStyle(getHoverStyle());
        layer.bringToFront();
      },
      mouseout: (e) => {
        layer.setStyle(getStyle(feature));
      },
      click: (e) => {
        if (onWarningClick) {
          onWarningClick({
            id: props.id,
            county: props.county,
            subcounty: props.subcounty,
            hazard: props.hazard,
            severity: props.severity,
            status: props.status,
            issued_at: props.issued_at,
          });
        }
      },
    });
  };

  return (
    <div style={{ opacity: 1 }}>
      <div style={{
        position: 'fixed',
        top: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        background: 'rgba(0,0,0,0.7)',
        color: '#22C55E',
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '10px',
      }}>
        ✅ {warnings.length} warning(s) loaded from server
      </div>
      <GeoJSON
        data={geoJSONData}
        style={getStyle}
        onEachFeature={onEachFeature}
      >
        <Tooltip sticky>
          {(feature) => {
            const props = feature.properties || {};
            return `
              <div style="font-size: 12px; max-width: 220px;">
                <strong>⚠️ ${props.hazard || 'Warning'}</strong>
                <div style="color: #666; font-size: 11px;">
                  County: ${props.county || 'Unknown'}<br/>
                  Severity: ${props.severity || 'Unknown'}<br/>
                  Status: ${props.status || 'Unknown'}<br/>
                  Issued: ${props.issued_at ? new Date(props.issued_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}