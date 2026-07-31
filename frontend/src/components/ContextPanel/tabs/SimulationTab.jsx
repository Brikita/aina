import { useState, useEffect } from 'react';
import { getSimulation } from '../../../services/api';
import { mockSimulation } from '../../../mock/data';

export default function SimulationTab({ warning }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!warning || !warning.id) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getSimulation(warning.id)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        console.warn('⚠️ API not reachable, using mock data');
        setData(mockSimulation);
        setLoading(false);
      });
  }, [warning]);

  if (!warning) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#9CA3AF', textAlign: 'center', fontSize: '14px' }}>
        Select a warning to view simulation
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px 0' }}>
        <div className="skeleton skeleton-text-lg" style={{ width: '40%' }} />
        <div className="skeleton skeleton-rect" style={{ height: '80px' }} />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" style={{ width: '70%' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
        No simulation data available
      </div>
    );
  }

  const confidenceColor = data.confidence > 0.8 ? '#22C55E' : data.confidence > 0.5 ? '#F59E0B' : '#DC2626';

  return (
    <div>
      <div style={{ display: 'inline-block', padding: '4px 12px', background: confidenceColor, color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
        Confidence: {(data.confidence * 100).toFixed(0)}%
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{ padding: '12px', background: '#FEF2F2', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>People Affected</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#DC2626' }}>{data.estimated_people_affected?.toLocaleString() || 'N/A'}</div>
        </div>
        <div style={{ padding: '12px', background: '#FFFBEB', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Buildings Affected</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#F59E0B' }}>{data.estimated_buildings_affected?.toLocaleString() || 'N/A'}</div>
        </div>
        <div style={{ padding: '12px', background: '#EFF6FF', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Roads Blocked</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#3B82F6' }}>{data.estimated_roads_blocked || 'N/A'}</div>
        </div>
        <div style={{ padding: '12px', background: '#ECFDF5', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Crop Loss</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#22C55E' }}>{data.estimated_crop_loss_percentage || 'N/A'}%</div>
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '6px', fontSize: '12px', color: '#4B5563', textAlign: 'center' }}>
        📊 Estimated impact level:{' '}
        <span style={{ fontWeight: 600, color: data.estimated_people_affected > 50000 ? '#DC2626' : data.estimated_people_affected > 20000 ? '#F59E0B' : '#22C55E' }}>
          {data.estimated_people_affected > 50000 ? 'High' : data.estimated_people_affected > 20000 ? 'Moderate' : 'Low'}
        </span>
      </div>

      <div style={{ marginTop: '8px', fontSize: '11px', color: '#9CA3AF', textAlign: 'center' }}>Status: {data.status || 'Completed'}</div>
    </div>
  );
}