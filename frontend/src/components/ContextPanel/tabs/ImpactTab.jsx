import { useState, useEffect } from 'react';
import { getImpact } from '../../../services/api';
import { mockImpact } from '../../../mock/data';

export default function ImpactTab({ county, warning }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!warning || !warning.id) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getImpact(warning.id)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        console.warn('⚠️ API not reachable, using mock data');
        setData(mockImpact);
        setLoading(false);
      });
  }, [warning]);

  if (!county) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        color: '#9CA3AF',
        textAlign: 'center',
        fontSize: '14px',
      }}>
        Select a county to view impact analysis
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px 0' }}>
        <div className="skeleton skeleton-text-lg" style={{ width: '60%' }} />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" style={{ width: '80%' }} />
        <div className="skeleton skeleton-rect" style={{ marginTop: '12px' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6B7280',
        fontSize: '14px',
      }}>
        No impact data available for this area
      </div>
    );
  }

  const severityColors = {
    Extreme: '#DC2626',
    High: '#F59E0B',
    Medium: '#EAB308',
    Low: '#22C55E',
  };

  const severityColor = severityColors[data.severity] || '#6B7280';

  return (
    <div>
      <div style={{
        display: 'inline-block',
        padding: '4px 12px',
        background: severityColor,
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        marginBottom: '12px',
      }}>
        {data.severity} Severity
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <div style={{
          padding: '12px',
          background: '#F8FAFC',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Total Assets</div>
          <div style={{ fontWeight: 700, fontSize: '20px', color: '#1F2937' }}>
            {data.summary?.total_assets || 0}
          </div>
        </div>
        <div style={{
          padding: '12px',
          background: '#F8FAFC',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Exposure Score</div>
          <div style={{ fontWeight: 700, fontSize: '20px', color: severityColor }}>
            {data.exposure?.exposure_score || 0}
          </div>
        </div>
        <div style={{
          padding: '12px',
          background: '#F8FAFC',
          borderRadius: '6px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Critical Assets</div>
          <div style={{ fontWeight: 700, fontSize: '20px', color: '#DC2626' }}>
            {data.exposure?.critical_assets || 0}
          </div>
        </div>
      </div>

      {data.summary?.asset_counts && (
        <div style={{
          padding: '12px',
          background: '#F0F7FF',
          borderRadius: '6px',
          marginBottom: '12px',
        }}>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', color: '#1F2937' }}>
            Asset Breakdown
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            {Object.entries(data.summary.asset_counts).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 8px',
                background: 'white',
                borderRadius: '4px',
                fontSize: '12px',
              }}>
                <span style={{ color: '#6B7280' }}>{key}</span>
                <span style={{ fontWeight: 600, color: '#1F2937' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.exposure && (
        <div style={{
          padding: '12px',
          background: '#F8FAFC',
          borderRadius: '6px',
        }}>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', color: '#1F2937' }}>
            Exposure Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            {Object.entries(data.exposure).map(([key, value]) => {
              if (key === 'exposure_score' || key === 'critical_assets') {
                return null;
              }
              return (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  background: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}>
                  <span style={{ color: '#6B7280' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span style={{ fontWeight: 600, color: '#1F2937' }}>{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}