import { useEffect, useState } from 'react';
import { CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { getWaterPoints } from '../../services/api';
import { FALLBACK_WATER_POINTS } from '../../data/fallbackGeoJSON';

const STATUS_CONFIG = {
  functional: { color: '#4CAF50', label: 'Functional' },
  at_risk: { color: '#FFC107', label: 'At Risk' },
  failed: { color: '#F44336', label: 'Failed' }
};

export default function WaterPointLayer() {
  const [waterPoints, setWaterPoints] = useState([]);

  useEffect(() => {
    getWaterPoints()
      .then(res => {
        const features = res.data.features || [];
        setWaterPoints(features.map(f => ({
          id: f.id || f.properties.id,
          name: f.properties.name,
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
          capacity: f.properties.capacity_percent || 50,
          status: f.properties.status || 'functional',
          type: f.properties.type || 'borehole'
        })));
      })
      .catch(() => {
        console.log('Using fallback water point data');
        setWaterPoints(FALLBACK_WATER_POINTS);
      });
  }, []);

  if (waterPoints.length === 0) return null;

  return waterPoints.map(wp => (
    <CircleMarker
      key={wp.id}
      center={[wp.lat, wp.lon]}
      radius={6 + (wp.capacity / 100) * 8}
      fillColor={STATUS_CONFIG[wp.status]?.color || '#999'}
      color="#333"
      weight={1}
      fillOpacity={0.8}
    >
      <Tooltip>
        {wp.name} ({wp.capacity}%)
      </Tooltip>
      <Popup>
        <div style={{ minWidth: '200px' }}>
          <h3 style={{ margin: '0 0 8px' }}>{wp.name}</h3>
          <p><strong>Type:</strong> {wp.type}</p>
          <p><strong>Status:</strong>{' '}
            <span style={{ color: STATUS_CONFIG[wp.status]?.color, fontWeight: 'bold' }}>
              {STATUS_CONFIG[wp.status]?.label}
            </span>
          </p>
          <p><strong>Capacity:</strong> {wp.capacity}%</p>
          {wp.status === 'at_risk' && (
            <p style={{ color: '#FF9800' }}>⚠ May require action within 14 days</p>
          )}
          {wp.status === 'failed' && (
            <p style={{ color: '#F44336' }}>❌ Water source unavailable</p>
          )}
        </div>
      </Popup>
    </CircleMarker>
  ));
}