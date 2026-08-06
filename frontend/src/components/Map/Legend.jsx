import { useState } from 'react';

export default function Legend() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleLegend = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleLegend}
        style={{
          position: 'absolute',
          bottom: '30px',
          right: '10px',
          zIndex: 1000,
          background: 'white',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          width: '36px',
          height: '36px',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Show Legend"
      >
        📍
      </button>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      right: '10px',
      zIndex: 1000,
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      fontSize: '12px',
      minWidth: '150px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 10px',
        background: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>📍 County Map</span>
        <button
          onClick={toggleLegend}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666',
            padding: '0 4px',
          }}
          title="Hide Legend"
        >
          ✕
        </button>
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#1E90FF', opacity: 0.2, marginRight: '8px', borderRadius: '2px', border: '2px solid #1E90FF' }} />
          <span style={{ fontSize: '11px' }}>County Boundary</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#FFD700', opacity: 0.4, marginRight: '8px', borderRadius: '2px', border: '2px solid #FFD700' }} />
          <span style={{ fontSize: '11px' }}>Selected County</span>
        </div>
        <hr style={{ margin: '4px 0', border: '0', borderTop: '1px solid #eee' }} />
        <div style={{ fontSize: '9px', color: '#999' }}>
          🖱️ Hover • 👆 Click to select
        </div>
      </div>
    </div>
  );
}