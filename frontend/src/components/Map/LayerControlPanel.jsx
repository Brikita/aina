import { useState, useEffect } from 'react';

export default function LayerControlPanel({ 
  layers, 
  setLayers, 
  onOpacityChange,
  onLayerSettings,
  isMobile = false 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('layers');
  const [allLayersOn, setAllLayersOn] = useState(false);

  useEffect(() => {
    if (isMobile && isExpanded) {
      const handleClickOutside = (e) => {
        const panel = document.getElementById('layer-control-panel');
        if (panel && !panel.contains(e.target)) {
          setIsExpanded(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isExpanded]);

  const layerConfigs = [
    // Basemaps
    { id: 'osm', label: 'OpenStreetMap', type: 'basemap', color: '#4CAF50' },
    { id: 'satellite', label: 'Satellite', type: 'basemap', color: '#2196F3' },
    { id: 'dark', label: 'Dark Matter', type: 'basemap', color: '#333333' },
    
    // Backend-Driven Layers
    { id: 'counties', label: 'Counties', type: 'data', color: '#1E90FF' },
    { id: 'subcounties', label: 'Sub-Counties', type: 'data', color: '#4CAF50' },
    { id: 'warnings', label: 'Warnings', type: 'data', color: '#FF0000' },
    { id: 'assets', label: 'Assets', type: 'data', color: '#2196F3' },
    
    // IGAD Countries
    { id: 'ethiopia', label: '🇪🇹 Ethiopia', type: 'data', color: '#FF6B35' },
    { id: 'sudan', label: '🇸🇩 Sudan', type: 'data', color: '#4CAF50' },
    { id: 'south_sudan', label: '🇸🇸 South Sudan', type: 'data', color: '#00BCD4' },
    { id: 'uganda', label: '🇺🇬 Uganda', type: 'data', color: '#9C27B0' },
    { id: 'somalia', label: '🇸🇴 Somalia', type: 'data', color: '#FF9800' },
    { id: 'djibouti', label: '🇩🇯 Djibouti', type: 'data', color: '#F44336' },
  ];

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleAllLayers = (checked) => {
    setAllLayersOn(checked);
    const newState = {};
    layerConfigs.forEach(layer => {
      newState[layer.id] = checked;
    });
    setLayers(prev => ({
      ...prev,
      ...newState
    }));
  };

  const toggleLayer = (layerId) => {
    setLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const handleOpacityChangeLocal = (layerId, value) => {
    if (onOpacityChange) {
      onOpacityChange(layerId, value);
    }
  };

  const handleSettingsClick = (layerId) => {
    if (onLayerSettings) {
      onLayerSettings(layerId);
    }
  };

  const getLayerOpacity = (layerId) => {
    return layers[`${layerId}_opacity`] || 1.0;
  };

  const visibleCount = layerConfigs.filter(l => layers[l.id]).length;

  const panelWidth = isMobile ? '90vw' : '300px';
  const maxHeight = isMobile ? '60vh' : '500px';
  const buttonSize = isMobile ? '48px' : '40px';
  const fontSize = isMobile ? '14px' : '13px';

  return (
    <div 
      id="layer-control-panel"
      style={{
        position: 'fixed',
        top: isMobile ? '60px' : '40px',
        right: isMobile ? '10px' : '15px',
        zIndex: 2000,
        maxWidth: isMobile ? '95vw' : '320px',
        maxHeight: 'calc(100vh - 80px)',
        overflow: 'visible',
      }}
    >
      {!isExpanded && (
        <button
          onClick={togglePanel}
          style={{
            width: buttonSize,
            height: buttonSize,
            background: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            cursor: 'pointer',
            fontSize: isMobile ? '22px' : '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            position: 'relative',
            touchAction: 'manipulation',
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)'}
          title="Layer Controls"
        >
          🔧
          {visibleCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#1E90FF',
              color: 'white',
              borderRadius: '50%',
              width: isMobile ? '22px' : '18px',
              height: isMobile ? '22px' : '18px',
              fontSize: isMobile ? '11px' : '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}>
              {visibleCount}
            </span>
          )}
        </button>
      )}

      {isExpanded && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
          width: panelWidth,
          maxHeight: maxHeight,
          overflow: 'auto',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: fontSize,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
            padding: '8px 12px',
            background: '#f8f9fa',
            borderRadius: '8px 8px 0 0',
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              gap: isMobile ? '12px' : '16px',
            }}>
              <div
                style={{
                  fontWeight: 'bold',
                  color: activeTab === 'layers' ? '#1E90FF' : '#666',
                  cursor: 'pointer',
                  padding: '4px 0',
                  borderBottom: activeTab === 'layers' ? '2px solid #1E90FF' : 'none',
                  fontSize: isMobile ? '13px' : '12px',
                }}
                onClick={() => setActiveTab('layers')}
              >
                📚 Layers
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  color: activeTab === 'settings' ? '#1E90FF' : '#666',
                  cursor: 'pointer',
                  padding: '4px 0',
                  borderBottom: activeTab === 'settings' ? '2px solid #1E90FF' : 'none',
                  fontSize: isMobile ? '13px' : '12px',
                }}
                onClick={() => setActiveTab('settings')}
              >
                ⚙️ Settings
              </div>
            </div>
            <button
              onClick={togglePanel}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: isMobile ? '20px' : '18px',
                color: '#666',
                padding: '0 4px',
                touchAction: 'manipulation',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: '10px 12px' }}>
            {activeTab === 'layers' && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #e0e0e0',
                  marginBottom: '8px',
                }}>
                  <input
                    type="checkbox"
                    checked={allLayersOn}
                    onChange={(e) => toggleAllLayers(e.target.checked)}
                    style={{ marginRight: '8px', cursor: 'pointer', width: isMobile ? '18px' : '16px', height: isMobile ? '18px' : '16px' }}
                  />
                  <span style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '12px', color: '#666' }}>
                    All layers on/off
                  </span>
                </div>

                {layerConfigs.map((layer) => (
                  <div
                    key={layer.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: isMobile ? '8px 0' : '6px 0',
                      borderBottom: '1px solid #f0f0f0',
                      flexWrap: isMobile ? 'wrap' : 'nowrap',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={layers[layer.id] || false}
                      onChange={() => toggleLayer(layer.id)}
                      style={{ marginRight: '8px', cursor: 'pointer', width: isMobile ? '18px' : '16px', height: isMobile ? '18px' : '16px' }}
                    />

                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: isMobile ? '13px' : '12px',
                        fontWeight: layers[layer.id] ? '500' : '400',
                        color: layers[layer.id] ? '#333' : '#999',
                        minWidth: isMobile ? '100px' : 'auto',
                      }}
                      onClick={() => toggleLayer(layer.id)}
                    >
                      <span style={{
                        display: 'inline-block',
                        width: isMobile ? '12px' : '10px',
                        height: isMobile ? '12px' : '10px',
                        backgroundColor: layer.color,
                        borderRadius: '2px',
                        marginRight: '6px',
                        opacity: layers[layer.id] ? 1 : 0.4,
                      }} />
                      {isMobile && layer.label.length > 15 ? layer.label.substring(0, 12) + '...' : layer.label}
                      <span style={{
                        fontSize: isMobile ? '9px' : '8px',
                        color: '#999',
                        marginLeft: '4px',
                        background: '#f0f0f0',
                        padding: '0 4px',
                        borderRadius: '2px',
                      }}>
                        {layer.type === 'basemap' ? 'Base' : 'Data'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSettingsClick(layer.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: isMobile ? '14px' : '12px',
                        color: '#888',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        touchAction: 'manipulation',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      ⚙️
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={getLayerOpacity(layer.id) * 100}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) / 100;
                        handleOpacityChangeLocal(layer.id, value);
                      }}
                      style={{
                        width: isMobile ? '40px' : '50px',
                        height: '3px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                        accentColor: layer.color,
                      }}
                    />
                  </div>
                ))}
              </>
            )}

            {activeTab === 'settings' && (
              <div style={{ padding: '8px 0', color: '#666', fontSize: isMobile ? '13px' : '12px' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#333' }}>
                  Layer Settings
                </p>
                <p style={{ margin: '0 0 4px 0' }}>
                  Click the gear icon (⚙️) next to any layer to adjust its settings.
                </p>
                <p style={{ margin: '0', fontSize: isMobile ? '12px' : '11px', color: '#999' }}>
                  • Change layer color<br />
                  • Adjust default opacity<br />
                  • Filter data<br />
                  • Export layer data
                </p>
              </div>
            )}
          </div>

          <div style={{
            padding: '6px 12px',
            borderTop: '1px solid #e0e0e0',
            fontSize: isMobile ? '11px' : '10px',
            color: '#999',
            textAlign: 'center',
            background: '#f8f9fa',
            borderRadius: '0 0 8px 8px',
          }}>
            {visibleCount} layer{visibleCount !== 1 ? 's' : ''} visible
          </div>
        </div>
      )}
    </div>
  );
}