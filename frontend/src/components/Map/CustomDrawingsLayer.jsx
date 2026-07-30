import { GeoJSON, Tooltip } from 'react-leaflet';

export default function CustomDrawingsLayer({ data, visible = true, opacity = 1.0 }) {
  if (!visible || !data) return null;

  return (
    <div style={{ opacity: opacity }}>
      <GeoJSON
        data={data}
        style={{
          color: '#FF6B35',
          fillColor: '#FF6B35',
          fillOpacity: 0.3,
          weight: 2,
        }}
      >
        <Tooltip sticky>
          {() => {
            return `
              <div style="font-size: 12px; max-width: 200px;">
                <strong>✏️ Custom Drawing</strong>
                <div style="color: #666; font-size: 10px;">Click to select</div>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}