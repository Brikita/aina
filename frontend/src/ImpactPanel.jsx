import { useState, useEffect } from 'react';
import { getImpact } from '../../services/api';
import { mockImpact } from '../../mock/data';

export default function ImpactPanel({ 
  warningId = null,
  county = null,
  hazard = null,
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

    getImpact(warningId)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('⚠️ API not reachable, using mock data');
        setData(mockImpact);
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
        📊 Loading impact analysis...
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const severityColors = {
    Extreme: '#FF0000',
    High: '#FF6600',
    Medium: '#FFC107',
    Low: '#4CAF50',
  };

  const severityColor = severityColors[data.severity] || '#999';

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
        borderBottom: `3px solid ${severityColor}`,
        borderRadius: '12px 12px 0 0',
      }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '15px', color: '#1a1a2e' }}>
            📊 Impact Analysis
          </span>
          <div style={{ fontSize: '11px', color: '#999' }}>
            {data.county} • {data.hazard}
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
        {/* Severity Badge */}
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          background: severityColor,
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '12px',
        }}>
          {data.severity} Severity
        </div>

        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <div style={{
            padding: '10px',
            background: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#999' }}>Total Assets</div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>
              {data.summary?.total_assets || 0}
            </div>
          </div>
          <div style={{
            padding: '10px',
            background: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#999' }}>Exposure Score</div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: severityColor }}>
              {data.exposure?.exposure_score || 0}
            </div>
          </div>
          <div style={{
            padding: '10px',
            background: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#999' }}>Critical Assets</div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#F44336' }}>
              {data.exposure?.critical_assets || 0}
            </div>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div style={{
          padding: '12px',
          background: '#f0f7ff',
          borderRadius: '6px',
          marginBottom: '12px',
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
            Asset Breakdown
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            {data.summary?.asset_counts && Object.entries(data.summary.asset_counts).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 8px',
                background: 'white',
                borderRadius: '4px',
                fontSize: '12px',
              }}>
                <span>{key}</span>
                <span style={{ fontWeight: 'bold' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Assets List */}
        {data.critical_assets && data.critical_assets.length > 0 && (
          <div style={{
            padding: '12px',
            background: '#fff3e0',
            borderRadius: '6px',
            marginBottom: '12px',
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
              🚨 Critical Assets
            </div>
            {data.critical_assets.slice(0, 5).map((asset, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 8px',
                background: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                marginBottom: '4px',
              }}>
                <span>{asset.name}</span>
                <span style={{ fontWeight: 'bold', color: '#F44336' }}>{asset.type}</span>
              </div>
            ))}
            {data.critical_assets.length > 5 && (
              <div style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '4px' }}>
                +{data.critical_assets.length - 5} more
              </div>
            )}
          </div>
        )}

        {/* Exposure Details */}
        {data.exposure && (
          <div style={{
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '6px',
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
              Exposure Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {Object.entries(data.exposure).map(([key, value]) => {
                if (key === 'exposure_score' || key === 'critical_assets') return null;
                return (
                  <div key={key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    background: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}>
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span style={{ fontWeight: 'bold' }}>{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
        Impact analysis based on current warning data
      </div>
    </div>
  );
}