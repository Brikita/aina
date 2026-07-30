import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';

export default function RiversLayer({ visible = true }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!visible) {
      setData(null);
      return;
    }
    
    fetch('/data/kenya_rivers.geojson')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error loading rivers:', err));
  }, [visible]);

  if (!visible || !data) return null;

  const getRiverName = (feature) => {
    const props = feature.properties || {};
    return props.name || props.NAME || props.river || props.RIVER || 'Unnamed River';
  };

  return (
    <GeoJSON
      data={data}
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
  );
}