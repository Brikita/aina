export default function HistoryTab({ county }) {
  const events = [
    { date: 'July 12', event: 'Alert Issued', status: 'warning' },
    { date: 'July 13', event: 'Assessment Started', status: 'info' },
    { date: 'July 14', event: 'Deployment Initiated', status: 'success' },
    { date: 'July 15', event: 'Recovery Phase', status: 'info' },
  ];

  if (!county) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#9CA3AF', textAlign: 'center', fontSize: '14px' }}>
        Select a county to view history
      </div>
    );
  }

  const statusColors = { warning: '#F59E0B', info: '#3B82F6', success: '#22C55E', error: '#DC2626' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', color: '#1F2937', fontWeight: 500 }}>{county.name} - Timeline</span>
      </div>

      <div style={{ position: 'relative', paddingLeft: '20px' }}>
        <div style={{ position: 'absolute', left: '4px', top: '0', bottom: '0', width: '2px', background: '#E5E7EB' }} />

        {events.map((event, index) => (
          <div key={index} style={{ position: 'relative', paddingBottom: '20px' }}>
            <div style={{ position: 'absolute', left: '-14px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: statusColors[event.status] || '#6B7280', border: '2px solid white', boxShadow: '0 0 0 2px #E5E7EB' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px' }}>
              <span style={{ fontSize: '13px', color: '#1F2937' }}>{event.event}</span>
              <span style={{ fontSize: '11px', color: '#6B7280', background: 'white', padding: '2px 8px', borderRadius: '10px' }}>{event.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}