import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';

const LIVELIHOOD_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8A5C2', '#74B9FF', '#55EFC4', '#FDCB6E', '#E17055',
  '#00CEC9', '#6C5CE7', '#FD79A8', '#00B894', '#E17055',
];

export default function LivelihoodLayer({ visible = true, opacity = 1.0 }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!visible) {
      setData(null);
      return;
    }
    
    fetch('/data/kenya_livelihood.geojson')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error loading livelihood zones:', err));
  }, [visible]);

  if (!visible || !data) return null;

  const getStyle = (feature) => {
    const index = feature.id || 0;
    return {
      fillColor: LIVELIHOOD_COLORS[index % LIVELIHOOD_COLORS.length],
      color: '#333',
      weight: 1,
      fillOpacity: 0.5,
    };
  };

  const getLivelihoodName = (feature) => {
    const props = feature.properties || {};
    return props.LHZ_NAME || props.Name || props.ZONE || 'Unknown Zone';
  };

  return (
    <div style={{ opacity: opacity }}>
      <GeoJSON
        data={data}
        style={getStyle}
      >
        <Tooltip sticky>
          {(feature) => {
            const name = getLivelihoodName(feature);
            return `
              <div style="font-size: 12px; max-width: 200px;">
                <strong>🌾 ${name}</strong>
                <div style="color: #666; font-size: 10px;">Livelihood Zone</div>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}