import { useEffect, useState, useRef } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

const FACILITY_PRIORITY = {
  'National Referral Hospital': 1,
  'Provincial General Hospital': 2,
  'County Referral Hospital': 3,
  'District Hospital': 4,
  'Sub-District Hospital': 5,
  'Mission Hospital': 6,
  'Hospital': 7,
  'Health Centre': 8,
  'Clinic': 9,
  'Dispensary': 10,
};

const getIcon = (type) => {
  const colors = {
    'Dispensary': '#4CAF50',
    'Health Centre': '#2196F3',
    'Clinic': '#FF9800',
    'Sub-District Hospital': '#FFC107',
    'District Hospital': '#F44336',
    'Mission Hospital': '#9C27B0',
    'Hospital': '#F44336',
    'Provincial General Hospital': '#F44336',
    'County Referral Hospital': '#F44336',
    'National Referral Hospital': '#F44336',
  };
  
  const color = colors[type] || '#999';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 14px;
      height: 14px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = 40;
  let color = '#4CAF50';
  
  if (count > 100) {
    size = 50;
    color = '#F44336';
  } else if (count > 50) {
    size = 46;
    color = '#FF9800';
  } else if (count > 20) {
    size = 42;
    color = '#FFC107';
  }
  
  return L.divIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
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

export default function ClusteredHealthFacilitiesLayer({ 
  visible = true, 
  countyFilter = null,
  onFacilityClick,
  opacity = 1.0,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dataRef = useRef(null);
  const currentCountyRef = useRef(null);

  useEffect(() => {
    // Clear data when county changes or layer is turned off
    if (!visible || !countyFilter) {
      setData(null);
      dataRef.current = null;
      currentCountyRef.current = null;
      setLoading(false);
      return;
    }

    // If county changed, clear old data
    if (currentCountyRef.current !== countyFilter) {
      setData(null);
      dataRef.current = null;
      currentCountyRef.current = countyFilter;
    }

    // Check cache
    const cacheKey = `health_${countyFilter.toLowerCase()}`;
    if (dataRef.current && dataRef.current.cacheKey === cacheKey) {
      setData(dataRef.current.data);
      return;
    }

    setLoading(true);

    fetch('/data/kenya_health_facilities.geojson')
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.json();
      })
      .then(fullData => {
        let filtered = fullData.features.filter(f => 
          f.properties.county && 
          f.properties.county.toLowerCase() === countyFilter.toLowerCase()
        );
        
        filtered.sort((a, b) => {
          const priorityA = FACILITY_PRIORITY[a.properties.type] || 99;
          const priorityB = FACILITY_PRIORITY[b.properties.type] || 99;
          return priorityA - priorityB;
        });
        
        // Limit to 50 facilities for performance
        const limited = filtered.slice(0, 50);
        
        console.log(`✅ Loaded ${limited.length} health facilities in ${countyFilter}`);
        
        const result = {
          ...fullData,
          features: limited
        };
        
        dataRef.current = {
          cacheKey: cacheKey,
          data: result
        };
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading health facilities:', err);
        setLoading(false);
      });
  }, [visible, countyFilter]);

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
        🏥 Loading health facilities...
      </div>
    );
  }

  if (!data || data.features.length === 0) {
    return null;
  }

  return (
    <div style={{ opacity: opacity }}>
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterIcon}
        showCoverageOnHover={true}
        maxClusterRadius={80}
        spiderfyOnMaxZoom={true}
        zoomToBoundsOnClick={true}
        disableClusteringAtZoom={14}
      >
        {data.features.map((feature, index) => {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;
          const lat = coords[1];
          const lon = coords[0];
          
          if (!lat || !lon) return null;
          
          const icon = getIcon(props.type);
          
          return (
            <Marker
              key={`${index}-${countyFilter}`}
              position={[lat, lon]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onFacilityClick) {
                    onFacilityClick(props);
                  }
                }
              }}
            >
              <Tooltip sticky>
                <div style={{ fontSize: '12px', maxWidth: '200px' }}>
                  <strong>{props.name || 'Unknown'}</strong>
                  <div style={{ color: '#666', fontSize: '11px' }}>
                    {props.type || 'Unknown'} • {props.ownership || 'Unknown'}
                  </div>
                </div>
              </Tooltip>
              <Popup>
                <div style={{ minWidth: '220px', padding: '4px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#1a1a2e' }}>
                    {props.name || 'Unknown'}
                  </h4>
                  <hr style={{ margin: '4px 0', border: '0', borderTop: '1px solid #eee' }} />
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>Type:</strong> {props.type || 'Unknown'}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>Ownership:</strong> {props.ownership || 'Unknown'}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>County:</strong> {props.county || 'Unknown'}
                  </p>
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
    </div>
  );
}