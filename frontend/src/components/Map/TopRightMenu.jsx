import { useState } from 'react';

const MENU_ITEMS = [
  // Row 1
  { id: 'basemap', icon: '🗺️', label: 'Change Basemap' },
  { id: 'xyz', icon: '🌍', label: 'Add XYZ/WMS' },
  { id: 'layers', icon: '🌗', label: 'Layer Manager' },
  // Row 2
  { id: 'load', icon: '📂', label: 'Load Data' },
  { id: 'whitebox', icon: '⚙️', label: 'Whitebox Tools' },
  { id: 'split', icon: '⏭️', label: 'Split Map Swipe' },
  // Row 3
  { id: 'clear', icon: '🧼', label: 'Clear Drawings' },
  { id: 'screenshot', icon: '📷', label: 'Save Image/Screenshot' },
  { id: 'filter', icon: '🌪️', label: 'Filter Attributes' },
  // Row 4
  { id: 'inspector', icon: 'ℹ️', label: 'Identify/Inspector' },
  { id: 'search', icon: '🔍', label: 'Search Places' },
  { id: 'download', icon: '📥', label: 'Download OSM' },
  // Row 5
  { id: 'cog', icon: '🖼️', label: 'COG Inspector' },
  { id: 'zoom', icon: '🎯', label: 'Zoom to Layer Extent' },
  { id: 'table', icon: '🗓️', label: 'Attribute Table' },
  // Row 6
  { id: 'edit', icon: '📝', label: 'Edit Vectors' },
  { id: 'legend', icon: '📊', label: 'Add Legend/Colorbar' },
  { id: 'fly', icon: '✈️', label: 'Fly to Location' },
];

export default function TopRightMenu({ onToolClick }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      padding: '8px',
      maxWidth: '220px',
    }}>
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        style={{
          width: '100%',
          padding: '6px 12px',
          background: '#f0f0f0',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: isOpen ? '8px' : '0',
        }}
      >
        {isOpen ? '▼ Tools' : '▶ Tools'}
      </button>

      {/* Menu Grid */}
      {isOpen && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
        }}>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onToolClick(item.id)}
              style={{
                padding: '6px',
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8f0fe';
                e.currentTarget.style.borderColor = '#1E90FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
              title={item.label}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '8px', color: '#666', marginTop: '2px' }}>
                {item.label.substring(0, 8)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}