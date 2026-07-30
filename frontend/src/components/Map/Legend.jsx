import { useState, useEffect } from 'react';

export default function Legend() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLegend = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleLegend}
        style={{
          position: 'fixed',
          bottom: isMobile ? '20px' : '50px',
          right: isMobile ? '10px' : '20px',
          zIndex: 2000,
          background: 'white',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
          width: isMobile ? '44px' : '40px',
          height: isMobile ? '44px' : '40px',
          fontSize: isMobile ? '20px' : '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          touchAction: 'manipulation',
        }}
        title="Show Legend"
      >
        📍
      </button>
    );
  }

  const legendWidth = isMobile ? '160px' : '180px';
  const fontSize = isMobile ? '11px' : '12px';

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '20px' : '50px',
      right: isMobile ? '10px' : '20px',
      zIndex: 2000,
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      fontSize: fontSize,
      width: legendWidth,
      padding: '0',
      overflow: 'hidden',
      maxWidth: '90vw',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '6px 10px' : '8px 12px',
        background: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <span style={{ fontWeight: 'bold', fontSize: isMobile ? '11px' : '12px', color: '#333' }}>
          📍 County Map
        </span>
        <button
          onClick={toggleLegend}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: isMobile ? '16px' : '14px',
            color: '#999',
            padding: '0 4px',
            touchAction: 'manipulation',
          }}
          title="Hide Legend"
        >
          ✕
        </button>
      </div>

      <div style={{ padding: isMobile ? '8px 10px 10px' : '10px 12px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ 
            width: isMobile ? '14px' : '18px', 
            height: isMobile ? '14px' : '18px', 
            backgroundColor: '#1E90FF', 
            opacity: 0.25, 
            marginRight: isMobile ? '8px' : '10px', 
            borderRadius: '3px', 
            border: '2px solid #1E90FF',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#333' }}>County Boundary</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ 
            width: isMobile ? '14px' : '18px', 
            height: isMobile ? '14px' : '18px', 
            backgroundColor: '#FFD700', 
            opacity: 0.5, 
            marginRight: isMobile ? '8px' : '10px', 
            borderRadius: '3px', 
            border: '2px solid #FFD700',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#333' }}>Hover / Selected</span>
        </div>
        <hr style={{ margin: '4px 0', border: '0', borderTop: '1px solid #eee' }} />
        <div style={{ fontSize: isMobile ? '8px' : '9px', color: '#999', textAlign: 'center' }}>
          🖱️ Hover for data • 👆 Click to pin
        </div>
      </div>
    </div>
  );
}