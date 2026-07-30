import { useState, useEffect } from 'react';

export default function InfoPanel({ 
  data, 
  onClose,
  isMobile = false 
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isMobile && isVisible) {
      const handleClickOutside = (e) => {
        const panel = document.getElementById('info-panel');
        if (panel && !panel.contains(e.target)) {
          // Don't auto-close, user must click ✕
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isVisible]);

  if (!isVisible || !data) return null;

  const panelWidth = isMobile ? '85vw' : '320px';
  const fontSize = isMobile ? '14px' : '13px';

  const getLevelIcon = (level) => {
    switch(level?.toLowerCase()) {
      case 'county': return '🏛️';
      case 'subcounty': return '📋';
      case 'ward': return '📍';
      case 'village': return '🏠';
      case 'health_facility': return '🏥';
      case 'borehole': return '💧';
      default: return 'ℹ️';
    }
  };

  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'county': return '#1E90FF';
      case 'subcounty': return '#4CAF50';
      case 'ward': return '#FF9800';
      case 'village': return '#9C27B0';
      case 'health_facility': return '#F44336';
      case 'borehole': return '#FFC107';
      default: return '#666';
    }
  };

  const levelIcon = getLevelIcon(data.level);
  const levelColor = getLevelColor(data.level);
  const levelLabel = data.level ? data.level.charAt(0).toUpperCase() + data.level.slice(1) : 'Unknown';

  return (
    <div 
      id="info-panel"
      style={{
        position: 'fixed',
        top: isMobile ? '60px' : '80px',
        right: isMobile ? '10px' : '20px',
        zIndex: 2000,
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        width: panelWidth,
        maxHeight: 'calc(100vh - 120px)',
        overflow: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: fontSize,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: '#f8f9fa',
        borderBottom: `3px solid ${levelColor}`,
        borderRadius: '12px 12px 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>{levelIcon}</span>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '15px', color: '#1a1a2e' }}>
              {data.name || 'Unknown'}
            </div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              {levelLabel}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#999',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        {data.county && (
          <div style={{
            padding: '8px 12px',
            background: '#f0f7ff',
            borderRadius: '6px',
            marginBottom: '12px',
            fontSize: '12px',
            color: '#555',
          }}>
            📍 Part of: <strong>{data.county}</strong>
            {data.subcounty && (
              <span> › <strong>{data.subcounty}</strong></span>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {data.area && (
            <div style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#999' }}>Area</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                {data.area.toFixed(2)}
              </div>
              <div style={{ fontSize: '10px', color: '#999' }}>sq km</div>
            </div>
          )}

          {data.population && (
            <div style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#999' }}>Population</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                {data.population.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#999' }}>people</div>
            </div>
          )}

          {data.subcountyCount && (
            <div style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#999' }}>Sub-Counties</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                {data.subcountyCount}
              </div>
            </div>
          )}

          {data.wardCount && (
            <div style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#999' }}>Wards</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                {data.wardCount}
              </div>
            </div>
          )}

          {data.type && (
            <div style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#999' }}>Type</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                {data.type}
              </div>
            </div>
          )}

          {data.ownership && (
            <div style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#999' }}>Ownership</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                {data.ownership}
              </div>
            </div>
          )}

          {data.status && (
            <div style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#999' }}>Status</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: data.status === 'Functional' ? '#4CAF50' : data.status === 'Semi-Functional' ? '#FFC107' : '#F44336' }}>
                {data.status}
              </div>
            </div>
          )}

          {data.well_depth && data.well_depth !== 'Unknown' && (
            <div style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#999' }}>Depth</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                {data.well_depth} m
              </div>
            </div>
          )}

          {data.yield && data.yield !== 'Unknown' && (
            <div style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#999' }}>Yield</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                {data.yield} m³/hr
              </div>
            </div>
          )}
        </div>

        {data.level === 'ward' && data.population && data.area && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: '#e8f5e9',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#2e7d32',
          }}>
            📊 Population density: {(data.population / data.area).toFixed(0)} people/km²
          </div>
        )}

        {data.level === 'health_facility' && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: '#fce4ec',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#c62828',
            textAlign: 'center',
          }}>
            🏥 Health facility • {data.county || 'Unknown county'}
          </div>
        )}

        {data.level === 'borehole' && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: '#fff3e0',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#e65100',
            textAlign: 'center',
          }}>
            💧 Borehole • {data.county || 'Unknown county'}
          </div>
        )}

        {data.level === 'county' && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: '#fff3e0',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#e65100',
            textAlign: 'center',
          }}>
            👆 Click a sub-county to drill down
          </div>
        )}

        {data.level === 'subcounty' && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: '#fff3e0',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#e65100',
            textAlign: 'center',
          }}>
            👆 Click a ward to drill down
          </div>
        )}

        {data.level === 'ward' && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: '#e3f2fd',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#0d47a1',
            textAlign: 'center',
          }}>
            🔍 Click a village to see more details
          </div>
        )}
      </div>

      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #e0e0e0',
        fontSize: '10px',
        color: '#999',
        textAlign: 'center',
        background: '#f8f9fa',
        borderRadius: '0 0 12px 12px',
      }}>
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}