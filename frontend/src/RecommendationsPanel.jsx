import { useState, useEffect } from 'react';
import { getRecommendations } from '../../services/api';
import { mockRecommendations } from '../../mock/data';

export default function RecommendationsPanel({
  warningId = null,
  visible = true,
  onClose,
  isMobile = false,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible || !warningId) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    getRecommendations(warningId)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ API not reachable, using mock data');
        setData(mockRecommendations);
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
        💡 Loading recommendations...
      </div>
    );
  }

  if (error || data.length === 0) {
    return null;
  }

  // Priority colors
  const priorityColors = {
    1: { bg: '#FFEBEE', border: '#F44336', text: '#C62828' },
    2: { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
    3: { bg: '#E3F2FD', border: '#2196F3', text: '#0D47A1' },
  };

  const priorityLabels = {
    1: '🚨 High Priority',
    2: '⚠️ Medium Priority',
    3: 'ℹ️ Low Priority',
  };

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
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: '#f8f9fa',
        borderBottom: '2px solid #4CAF50',
        borderRadius: '12px 12px 0 0',
      }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '15px', color: '#1a1a2e' }}>
            💡 AI Recommendations
          </span>
          <div style={{ fontSize: '11px', color: '#999' }}>
            {data.length} recommendations
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

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {data.map((item, index) => {
          const priority = item.priority || 3;
          const colors = priorityColors[priority] || priorityColors[3];
          const label = priorityLabels[priority] || priorityLabels[3];

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
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}>
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  color: colors.text,
                }}>
                  {item.title || 'Recommendation'}
                </span>
                <span style={{
                  fontSize: '10px',
                  color: colors.text,
                  background: 'rgba(255,255,255,0.7)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}>
                  {label}
                </span>
              </div>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: '#555',
                lineHeight: '1.5',
              }}>
                {item.description || 'No description provided.'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #e0e0e0',
        fontSize: '10px',
        color: '#999',
        textAlign: 'center',
        background: '#f8f9fa',
        borderRadius: '0 0 12px 12px',
      }}>
        AI-generated recommendations based on impact analysis
      </div>
    </div>
  );
}