export default function OverviewTab({ county, warning }) {
  const metrics = {
    risk_score: 87,
    population: 820000,
    affected: 412000,
    hospitals: 17,
    water_points: 46,
  };

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
        Select a county to view overview
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '8px',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk Score</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#1F2937' }}>{metrics.risk_score}</div>
        </div>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `conic-gradient(#DC2626 ${metrics.risk_score}%, #E5E7EB ${metrics.risk_score}%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: '#DC2626',
          }}>
            {metrics.risk_score}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px' }}>👥</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937' }}>{metrics.population.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Population</div>
        </div>
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px' }}>⚠️</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937' }}>{metrics.affected.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Affected</div>
        </div>
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px' }}>🏥</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937' }}>{metrics.hospitals}</div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Hospitals</div>
        </div>
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px' }}>💧</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937' }}>{metrics.water_points}</div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>Water Points</div>
        </div>
      </div>

      {county && (
        <div style={{ padding: '12px', background: '#F0F7FF', borderRadius: '6px', fontSize: '13px', color: '#1F2937' }}>
          <strong>📍 {county.name}</strong>
          {warning && (
            <div style={{ marginTop: '4px', fontSize: '12px', color: '#6B7280' }}>
              Current {warning.hazard} warning • {warning.severity} severity
            </div>
          )}
        </div>
      )}
    </div>
  );
}