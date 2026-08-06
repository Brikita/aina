import { useState, useEffect } from 'react';
import { getAllocations } from '../../services/api';
import { mockAllocations } from '../../mock/data';

export default function AllocationsPanel({
  warningId = null,
  visible = true,
  onClose,
  isMobile = false,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible || !warningId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    getAllocations(warningId)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ API not reachable, using mock data');
        setData(mockAllocations);
        setLoading(false);
        setError(null);
      });
  }, [visible, warningId]);

  if (!visible) return null;

  const panelWidth = isMobile ? '90vw' : '380px';
  const fontSize = isMobile ? '14px' : '13px';

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '140px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '12px',
      }}>
        🚚 Loading allocations...
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const resourceIcons = {
    ambulances: '🚑',
    rescue_boats: '🚤',
    food_trucks: '🚛',
    medical_staff: '👨‍⚕️',
    tents: '⛺',
    water_tanks: '💧',
    default: '📦',
  };

  const resourceLabels = {
    ambulances: 'Ambulances',
    rescue_boats: 'Rescue Boats',
    food_trucks: 'Food Trucks',
    medical_staff: 'Medical Staff',
    tents: 'Tents',
    water_tanks: 'Water Tanks',
  };

  const entries = Object.entries(data);

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '10px' : '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2000,
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      width: panelWidth,
      maxHeight: isMobile ? '70vh' : '60vh',
      overflow: 'auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: fontSize,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: '#f8f9fa',
        borderBottom: '2px solid #FF6B35',
        borderRadius: '12px 12px 0 0',
      }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '15px', color: '#1a1a2e' }}>
            🚚 Resource Allocations
          </span>
          <div style={{ fontSize: '11px', color: '#999' }}>
            {entries.length} resource types
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
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}>
          {entries.map(([key, value]) => {
            const icon = resourceIcons[key] || resourceIcons.default;
            const label = resourceLabels[key] || key.replace(/_/g, ' ').toUpperCase();

            return (
              <div
                key={key}
                style={{
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                }}
              >
                <div style={{ fontSize: '24px' }}>{icon}</div>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: '#FF6B35',
                  marginTop: '4px',
                }}>
                  {value}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '12px',
          padding: '10px 12px',
          background: '#f0f7ff',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#555',
          textAlign: 'center',
        }}>
          📦 Total resources allocated:{' '}
          <span style={{
            fontWeight: 'bold',
            color: '#FF6B35',
          }}>
            {entries.reduce((sum, [_, value]) => sum + value, 0)}
          </span>
        </div>
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
        Recommended resource allocations based on impact analysis
      </div>
    </div>
  );
}