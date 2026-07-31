import { useState, useEffect } from 'react';
import { getRecommendations } from '../../../services/api';
import { mockRecommendations } from '../../../mock/data';

export default function RecommendationsTab({ warning, onAction }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!warning || !warning.id) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getRecommendations(warning.id)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        console.warn('⚠️ API not reachable, using mock data');
        setData(mockRecommendations);
        setLoading(false);
      });
  }, [warning]);

  if (!warning) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: '#9CA3AF',
          textAlign: 'center',
          fontSize: '14px',
        }}
      >
        Select a warning to see recommendations
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px 0' }}>
        <div className="skeleton skeleton-text-lg" style={{ width: '50%' }} />
        <div className="skeleton skeleton-rect" style={{ height: '60px' }} />
        <div className="skeleton skeleton-rect" style={{ height: '60px', marginTop: '8px' }} />
        <div className="skeleton skeleton-rect" style={{ height: '60px', marginTop: '8px' }} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          padding: '16px',
          background: '#F8FAFC',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6B7280',
          fontSize: '14px',
        }}
      >
        No recommendations available
      </div>
    );
  }

  const priorityColors = {
    1: { bg: '#FEF2F2', border: '#DC2626', text: '#991B1B', label: '🚨 High' },
    2: { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', label: '⚠️ Medium' },
    3: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF', label: 'ℹ️ Low' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>{data.length} recommendations</span>
      </div>

      {data.map((item, index) => {
        const priority = item.priority || 3;
        const colors = priorityColors[priority] || priorityColors[3];

        return (
          <div
            key={index}
            style={{
              padding: '12px 14px',
              background: colors.bg,
              borderLeft: `4px solid ${colors.border}`,
              borderRadius: '6px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px', color: colors.text }}>
                {item.title || 'Recommendation'}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: colors.text,
                  background: 'rgba(255,255,255,0.7)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                {colors.label}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#4B5563', lineHeight: '1.5' }}>
              {item.description || 'No description provided.'}
            </p>
          </div>
        );
      })}
    </div>
  );
}