import { useState, useEffect } from 'react';
import { getAllocations } from '../../../services/api';
import { mockAllocations } from '../../../mock/data';

const RESOURCE_ICONS = { ambulances: '🚑', rescue_boats: '🚤', food_trucks: '🚛', medical_staff: '👨‍⚕️', tents: '⛺', water_tanks: '💧', default: '📦' };
const RESOURCE_LABELS = { ambulances: 'Ambulances', rescue_boats: 'Rescue Boats', food_trucks: 'Food Trucks', medical_staff: 'Medical Staff', tents: 'Tents', water_tanks: 'Water Tanks' };

export default function ResourcesTab({ warning, onAction }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!warning || !warning.id) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAllocations(warning.id)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        console.warn('⚠️ API not reachable, using mock data');
        setData(mockAllocations);
        setLoading(false);
      });
  }, [warning]);

  if (!warning) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#9CA3AF', textAlign: 'center', fontSize: '14px' }}>
        Select a warning to view resources
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px 0' }}>
        <div className="skeleton skeleton-text-lg" style={{ width: '50%' }} />
        <div className="skeleton skeleton-rect" style={{ height: '60px' }} />
        <div className="skeleton skeleton-rect" style={{ height: '60px', marginTop: '8px' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
        No resource allocations available
      </div>
    );
  }

  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {entries.map(([key, value]) => {
          const icon = RESOURCE_ICONS[key] || RESOURCE_ICONS.default;
          const label = RESOURCE_LABELS[key] || key.replace(/_/g, ' ').toUpperCase();
          return (
            <div key={key} style={{ padding: '10px', background: '#F8FAFC', borderRadius: '6px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '20px' }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#FF6B35', marginTop: '2px' }}>{value}</div>
              <div style={{ fontSize: '9px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '10px 12px', background: '#F0F7FF', borderRadius: '6px', fontSize: '12px', color: '#4B5563', textAlign: 'center' }}>
        📦 Total resources allocated: <strong>{total}</strong>
      </div>

      {onAction && (
        <button
          onClick={() => onAction({ type: 'deploy', resources: data })}
          style={{ marginTop: '12px', width: '100%', padding: '10px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1D4ED8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
        >
          🚀 Deploy Resources
        </button>
      )}
    </div>
  );
}