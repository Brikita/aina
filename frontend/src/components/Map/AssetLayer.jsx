import { useEffect, useState } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { getAssetsByCounty, getAssets } from '../../services/api';

// Asset type icons and colors
const ASSET_ICONS = {
  Hospital: '🏥',
  School: '🏫',
  Shelter: '🏠',
  Village: '🏘️',
  Road: '🛣️',
  Bridge: '🌉',
  DEFAULT: '📍',
};

const ASSET_COLORS = {
  Hospital: '#DC2626',
  School: '#3B82F6',
  Shelter: '#F59E0B',
  Village: '#22C55E',
  Road: '#6B7280',
  Bridge: '#8B4513',
  DEFAULT: '#999',
};

const createAssetIcon = (type) => {
  const emoji = ASSET_ICONS[type] || ASSET_ICONS.DEFAULT;
  const color = ASSET_COLORS[type] || ASSET_COLORS.DEFAULT;

  return L.divIcon({
    className: 'asset-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 50%;
      border: 3px solid ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = 40;
  let color = '#4CAF50';
  
  if (count > 100) {
    size = 50;
    color = '#DC2626';
  } else if (count > 50) {
    size = 46;
    color = '#F59E0B';
  } else if (count > 20) {
    size = 42;
    color = '#3B82F6';
  }
  
  return L.divIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      color: white;
      border-radius: 50%;
      display: flex;
      alignItems: 'center';
      justify-content: 'center';
      font-weight: bold;
      font-size: ${count > 99 ? '12px' : '14px'};
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      border: 2px solid rgba(255,255,255,0.8);
    ">${count}</div>`,
    className: 'cluster-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

export default function AssetLayer({
  visible = true,
  countyFilter = null,
  onAssetClick,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible) {
      setAssets([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Try to get assets by county first
    const fetchAssets = countyFilter 
      ? getAssetsByCounty(countyFilter)
      : getAssets();

    fetchAssets
      .then(response => {
        console.log(`✅ Assets loaded:`, response.data);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setAssets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error loading assets:', err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [visible, countyFilter]);

  if (!visible) return null;

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
        📍 Loading assets...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '140px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        background: 'rgba(0,0,0,0.7)',
        color: '#F59E0B',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '12px',
      }}>
        ⚠️ Asset data unavailable: {error}
      </div>
    );
  }

  if (assets.length === 0) {
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
        📍 No assets found {countyFilter ? `in ${countyFilter}` : 'in the database'}
      </div>
    );
  }

  const getTypeBreakdown = () => {
    const breakdown = {};
    assets.forEach(asset => {
      const type = asset.type || 'DEFAULT';
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    return breakdown;
  };

  console.log(`📍 Assets breakdown:`, getTypeBreakdown());

  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterIcon}
      showCoverageOnHover={true}
      maxClusterRadius={80}
      spiderfyOnMaxZoom={true}
      zoomToBoundsOnClick={true}
      disableClusteringAtZoom={14}
    >
      {assets.map((asset, index) => {
        const location = asset.location || {};
        const lat = location.latitude || asset.latitude || 0;
        const lon = location.longitude || asset.longitude || 0;

        if (!lat || !lon) {
          console.warn('Asset missing coordinates:', asset);
          return null;
        }

        const icon = createAssetIcon(asset.type);

        return (
          <Marker
            key={`${asset.id}-${index}`}
            position={[lat, lon]}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onAssetClick) {
                  onAssetClick(asset);
                }
              },
            }}
          >
            <Tooltip sticky>
              <div style={{ fontSize: '12px', maxWidth: '200px' }}>
                <strong>{asset.name || 'Unknown Asset'}</strong>
                <div style={{ color: '#666', fontSize: '11px' }}>
                  {asset.type || 'Unknown'} • {asset.county || 'Unknown'}
                </div>
              </div>
            </Tooltip>
            <Popup>
              <div style={{ minWidth: '220px', padding: '4px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#1a1a2e' }}>
                  {asset.name || 'Unknown Asset'}
                </h4>
                <hr style={{ margin: '4px 0', border: '0', borderTop: '1px solid #eee' }} />
                <p style={{ margin: '4px 0', fontSize: '13px' }}>
                  <strong>Type:</strong> {asset.type || 'Unknown'}
                </p>
                <p style={{ margin: '4px 0', fontSize: '13px' }}>
                  <strong>County:</strong> {asset.county || 'Unknown'}
                </p>
                {asset.capacity && (
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>Capacity:</strong> {asset.capacity}
                  </p>
                )}
                <hr style={{ margin: '4px 0', border: '0', borderTop: '1px solid #eee' }} />
                <p style={{ margin: '4px 0', fontSize: '11px', color: '#999' }}>
                  📍 {lat.toFixed(4)}, {lon.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
}