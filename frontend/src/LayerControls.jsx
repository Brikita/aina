export default function LayerControls({ layers, setLayers }) {
  const toggleLayer = (layerId) => {
    setLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '100px',
      left: '10px',
      zIndex: 1000,
      background: 'white',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      fontSize: '13px',
      minWidth: '150px',
    }}>
      <h4 style={{ margin: '0 0 8px', fontWeight: 'bold' }}>Layers</h4>
      
      <label style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={layers.roads}
          onChange={() => toggleLayer('roads')}
          style={{ marginRight: '8px' }}
        />
        <span style={{ color: '#FF6B35', fontWeight: 'bold' }}>━</span> Roads
      </label>

      <label style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={layers.rivers}
          onChange={() => toggleLayer('rivers')}
          style={{ marginRight: '8px' }}
        />
        <span style={{ color: '#2196F3', fontWeight: 'bold' }}>━</span> Rivers
      </label>

      <label style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={layers.livelihood}
          onChange={() => toggleLayer('livelihood')}
          style={{ marginRight: '8px' }}
        />
        <span style={{ color: '#4ECDC4', fontWeight: 'bold' }}>▣</span> Livelihood Zones
      </label>

      <hr style={{ margin: '6px 0', border: '0', borderTop: '1px solid #eee' }} />

      <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={layers.custom_drawings}
          onChange={() => toggleLayer('custom_drawings')}
          style={{ marginRight: '8px' }}
        />
        <span style={{ color: '#FF6B35', fontWeight: 'bold' }}>✏️</span> Custom Drawings
      </label>
    </div>
  );
}