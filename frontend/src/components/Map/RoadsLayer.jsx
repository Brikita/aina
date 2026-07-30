import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';

export default function RoadsLayer({ visible = true }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!visible) {
      setData(null);
      return;
    }
    
    fetch('/data/kenya_roads.geojson')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error loading roads:', err));
  }, [visible]);

  if (!visible || !data) return null;

  const getRoadName = (feature) => {
    const props = feature.properties || {};
    return props.name || props.NAME || props.road || props.ROAD || 'Unnamed Road';
  };

  return (
    <GeoJSON
      data={data}
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
  );
}