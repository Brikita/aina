import { useState, useEffect } from 'react';

export default function AdminPanel({ 
  selectedCounty,
  selectedSubCounty,
  selectedWard,
  selectedVillage,
  onNavigate,
  onReset,
  isMobile = false 
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  const getBreadcrumb = () => {
    const crumbs = [];
    
    crumbs.push({ 
      level: 'root', 
      name: 'Kenya', 
      icon: '🌍',
      isActive: !selectedCounty && !selectedSubCounty && !selectedWard && !selectedVillage,
      isClickable: true,
      onClick: () => {
        if (onNavigate) onNavigate('root');
      }
    });

    if (selectedCounty) {
      crumbs.push({
        level: 'county',
        name: selectedCounty.name,
        icon: '🏛️',
        isActive: selectedCounty && !selectedSubCounty && !selectedWard && !selectedVillage,
        isClickable: true,
        onClick: () => {
          if (onNavigate) onNavigate('county', selectedCounty);
        },
        count: selectedCounty.subcountyCount || 0,
        countLabel: 'sub-counties',
      });
    }

    if (selectedSubCounty) {
      crumbs.push({
        level: 'subcounty',
        name: selectedSubCounty.name,
        icon: '📋',
        isActive: selectedSubCounty && !selectedWard && !selectedVillage,
        isClickable: true,
        onClick: () => {
          if (onNavigate) onNavigate('subcounty', selectedSubCounty);
        },
        count: selectedSubCounty.wardCount || 0,
        countLabel: 'wards',
      });
    }

    if (selectedWard) {
      crumbs.push({
        level: 'ward',
        name: selectedWard.name,
        icon: '📍',
        isActive: selectedWard && !selectedVillage,
        isClickable: true,
        onClick: () => {
          if (onNavigate) onNavigate('ward', selectedWard);
        },
        population: selectedWard.population || 0,
      });
    }

    if (selectedVillage) {
      crumbs.push({
        level: 'village',
        name: selectedVillage.name,
        icon: '🏠',
        isActive: true,
        isClickable: false,
        onClick: null,
      });
    }

    return crumbs;
  };

  const breadcrumb = getBreadcrumb();
  const hasSelection = selectedCounty || selectedSubCounty || selectedWard || selectedVillage;

  const getLevelColor = (level) => {
    switch(level) {
      case 'root': return '#666';
      case 'county': return '#1E90FF';
      case 'subcounty': return '#4CAF50';
      case 'ward': return '#FF9800';
      case 'village': return '#9C27B0';
      default: return '#666';
    }
  };

  const fontSize = isMobile ? '13px' : '14px';

  if (!isExpanded) {
    return (
      <button
        onClick={togglePanel}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          background: 'white',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          width: '48px',
          height: '48px',
          fontSize: '22px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)'}
        title="Show Administrative Levels"
      >
        🏛️
        {hasSelection && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#1E90FF',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}>
            {breadcrumb.length - 1}
          </span>
        )}
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2000,
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
      width: isMobile ? '95vw' : 'auto',
      maxWidth: isMobile ? '95vw' : '900px',
      minWidth: isMobile ? 'auto' : '450px',
      padding: '0',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
      }} onClick={togglePanel}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🏛️</span>
          <span style={{ fontWeight: 'bold', fontSize: fontSize, color: '#333' }}>
            Administrative Levels
          </span>
          {hasSelection && (
            <span style={{
              fontSize: '11px',
              color: '#1E90FF',
              background: '#e8f0fe',
              padding: '2px 10px',
              borderRadius: '12px',
            }}>
              {breadcrumb.length - 1} level{breadcrumb.length - 1 > 1 ? 's' : ''} deep
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hasSelection && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onReset) onReset();
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#FF6B35',
                padding: '4px 8px',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fff0e8'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              ✕ Reset
            </button>
          )}
          <span style={{ fontSize: '12px', color: '#999' }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      <div style={{
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        background: '#fafafa',
        borderBottom: '1px solid #eee',
        minHeight: '50px',
      }}>
        {breadcrumb.map((crumb, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 && (
              <span style={{ 
                color: '#ccc', 
                margin: '0 6px', 
                fontSize: '16px',
                fontWeight: '300',
              }}>›</span>
            )}
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: crumb.isActive ? getLevelColor(crumb.level) : 'transparent',
                color: crumb.isActive ? 'white' : '#333',
                borderRadius: '6px',
                padding: '4px 12px',
                cursor: crumb.isClickable ? 'pointer' : 'default',
                fontSize: isMobile ? '12px' : '13px',
                fontWeight: crumb.isActive ? 'bold' : 'normal',
                border: crumb.isActive ? 'none' : '1px solid transparent',
                transition: 'all 0.2s',
              }}
              onClick={crumb.onClick}
              onMouseEnter={(e) => {
                if (crumb.isClickable && !crumb.isActive) {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#ddd';
                }
              }}
              onMouseLeave={(e) => {
                if (crumb.isClickable && !crumb.isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '14px' }}>{crumb.icon}</span>
              <span>{crumb.name}</span>
              
              {crumb.count > 0 && !crumb.isActive && (
                <span style={{
                  fontSize: '9px',
                  color: '#999',
                  background: '#f0f0f0',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  marginLeft: '2px',
                }}>
                  {crumb.count}
                </span>
              )}
              
              {crumb.isActive && index === breadcrumb.length - 1 && (
                <span style={{
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.8)',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '1px 8px',
                  borderRadius: '10px',
                  marginLeft: '4px',
                }}>
                  ● here
                </span>
              )}
              
              {crumb.isClickable && !crumb.isActive && (
                <span style={{
                  fontSize: '9px',
                  color: '#ccc',
                  marginLeft: '2px',
                }}>
                  ↺
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '8px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        fontSize: isMobile ? '12px' : '13px',
        minHeight: '36px',
        background: '#fafafa',
      }}>
        {selectedCounty && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 10px',
            background: '#e8f0fe',
            borderRadius: '4px',
            fontSize: '11px',
          }}>
            <span>🏛️</span>
            <span><strong>{selectedCounty.name}</strong></span>
            <span style={{ color: '#666' }}>
              ({selectedCounty.subcountyCount || 0} sub-counties)
            </span>
          </div>
        )}

        {selectedSubCounty && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 10px',
            background: '#e8f5e9',
            borderRadius: '4px',
            fontSize: '11px',
          }}>
            <span>📋</span>
            <span><strong>{selectedSubCounty.name}</strong></span>
            <span style={{ color: '#666' }}>
              ({selectedSubCounty.wardCount || 0} wards)
            </span>
          </div>
        )}

        {selectedWard && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 10px',
            background: '#fff3e0',
            borderRadius: '4px',
            fontSize: '11px',
          }}>
            <span>📍</span>
            <span><strong>{selectedWard.name}</strong></span>
            {selectedWard.population > 0 && (
              <span style={{ color: '#666' }}>
                (pop: {selectedWard.population.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {selectedVillage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 10px',
            background: '#f3e5f5',
            borderRadius: '4px',
            fontSize: '11px',
          }}>
            <span>🏠</span>
            <span><strong>{selectedVillage.name}</strong></span>
          </div>
        )}

        {!hasSelection && (
          <div style={{ color: '#999', fontSize: '12px' }}>
            Click a county on the map to start exploring
          </div>
        )}
      </div>

      <div style={{
        padding: '3px 16px',
        borderTop: '1px solid #eee',
        fontSize: '9px',
        color: '#ccc',
        textAlign: 'center',
        background: '#fafafa',
      }}>
        Click breadcrumb to navigate • Click 🏛️ to collapse
      </div>
    </div>
  );
}