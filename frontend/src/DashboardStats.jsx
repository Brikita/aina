import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';

export default function DashboardStats({ visible = true, isMobile = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setLoading(true);
    setError(null);

    getDashboardStats()
      .then(response => {
        console.log('✅ Dashboard stats loaded:', response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error loading dashboard stats:', err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [visible]);

  if (!visible || loading || !data) {
    if (loading) {
      return (
        <div style={{
          position: 'fixed',
          top: isMobile ? '60px' : '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
        }}>
          📊 Loading dashboard...
        </div>
      );
    }
    return null;
  }

  const stats = [
    { id: 'active_warnings', label: 'Active Warnings', value: data.active_warnings || 0, icon: '⚠️', color: '#DC2626' },
    { id: 'high_risk_counties', label: 'High Risk Counties', value: data.high_risk_counties || 0, icon: '🔴', color: '#F59E0B' },
    { id: 'critical_assets', label: 'Critical Assets', value: data.critical_assets || 0, icon: '🏥', color: '#3B82F6' },
    { id: 'resources_available', label: 'Resources Available', value: data.resources_available || 0, icon: '🚚', color: '#22C55E' },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{
      position: 'fixed',
      top: isMobile ? '60px' : '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2000,
    }}>
      <button
        onClick={toggleDropdown}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          padding: isMobile ? '8px 16px' : '10px 24px',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.05)',
          cursor: 'pointer',
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: 500,
          color: '#1F2937',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'}
      >
        <span>📊 Dashboard</span>
        <span style={{ fontSize: '16px' }}>{isOpen ? '▲' : '▼'}</span>
        <span style={{
          fontSize: '10px',
          color: '#DC2626',
          background: '#FEF2F2',
          padding: '2px 8px',
          borderRadius: '10px',
          fontWeight: 600,
        }}>
          {data.active_warnings || 0}
        </span>
      </button>

      {isOpen && (
        <div style={{
          marginTop: '8px',
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          padding: '12px 16px',
          minWidth: isMobile ? '280px' : '380px',
          border: '1px solid rgba(0,0,0,0.05)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}>
          {stats.map((stat) => (
            <div
              key={stat.id}
              style={{
                padding: '10px',
                background: '#F8FAFC',
                borderRadius: '8px',
                textAlign: 'center',
                borderLeft: `3px solid ${stat.color}`,
              }}
            >
              <div style={{ fontSize: '16px' }}>{stat.icon}</div>
              <div style={{ fontWeight: 700, fontSize: isMobile ? '16px' : '18px', color: '#1F2937' }}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280', whiteSpace: 'nowrap' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}