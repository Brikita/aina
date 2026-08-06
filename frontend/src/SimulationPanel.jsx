import { useState, useEffect } from 'react';
import { getSimulation } from '../../services/api';
import { mockSimulation } from '../../mock/data';

export default function SimulationPanel({
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

    getSimulation(warningId)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ API not reachable, using mock data');
        setData(mockSimulation);
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
        📈 Loading simulation...
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const confidenceColor = data.confidence > 0.8 ? '#4CAF50' : data.confidence > 0.5 ? '#FFC107' : '#F44336';

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
        borderBottom: '2px solid #9C27B0',
        borderRadius: '12px 12px 0 0',
      }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '15px', color: '#1a1a2e' }}>
            📈 Simulation Results
          </span>
          <div style={{ fontSize: '11px', color: '#999' }}>
            Status: {data.status || 'Completed'}
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
          display: 'inline-block',
          padding: '4px 12px',
          background: confidenceColor,
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '12px',
        }}>
          Confidence: {(data.confidence * 100).toFixed(0)}%
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}>
          <div style={{
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#999' }}>People Affected</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#F44336' }}>
              {data.estimated_people_affected?.toLocaleString() || 'N/A'}
            </div>
          </div>

          <div style={{
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#999' }}>Buildings Affected</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#FF9800' }}>
              {data.estimated_buildings_affected?.toLocaleString() || 'N/A'}
            </div>
          </div>

          <div style={{
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#999' }}>Roads Blocked</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#2196F3' }}>
              {data.estimated_roads_blocked || 'N/A'}
            </div>
          </div>

          <div style={{
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#999' }}>Crop Loss</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#4CAF50' }}>
              {data.estimated_crop_loss_percentage || 'N/A'}%
            </div>
          </div>
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
          📊 Estimated impact level:{' '}
          <span style={{
            fontWeight: 'bold',
            color: data.estimated_people_affected > 50000 ? '#F44336' : '#FF9800',
          }}>
            {data.estimated_people_affected > 50000 ? 'High' :
             data.estimated_people_affected > 20000 ? 'Moderate' : 'Low'}
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
        Simulation based on hazard modeling and historical data
      </div>
    </div>
  );
}