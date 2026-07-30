import { useEffect, useState } from 'react';
import { CircleMarker, Tooltip, Popup } from 'react-leaflet';

// Comprehensive status colors based on actual data
const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || 'unknown';
  
  if (['y', 'yes', 'operational', 'functional', 'working', 'hand pump installed', 'pump installed'].includes(statusLower)) {
    return '#4CAF50';
  }
  
  if (['semi functional', 'semi-operational', 'semi operational', 'limited', 'partial'].includes(statusLower)) {
    return '#FFC107';
  }
  
  if (['non functional', 'non-functional', 'not operational', 'failed', 'dry', 'dry well', 'dry hole', 
       'blocked', 'no water', 'insufficient water', 'abandoned', 'salty-abandoned', 'salty abandoned'].includes(statusLower)) {
    return '#F44336';
  }
  
  return '#9E9E9E';
};

const getStatusLabel = (status) => {
  const statusLower = status?.toLowerCase() || 'unknown';
  
  if (['y', 'yes', 'operational', 'functional', 'working', 'hand pump installed', 'pump installed'].includes(statusLower)) {
    return '✅ Operational';
  }
  
  if (['semi functional', 'semi-operational', 'semi operational', 'limited', 'partial'].includes(statusLower)) {
    return '⚠️ Semi-Operational';
  }
  
  if (['non functional', 'non-functional', 'not operational', 'failed', 'dry', 'dry well', 'dry hole', 
       'blocked', 'no water', 'insufficient water', 'abandoned', 'salty-abandoned', 'salty abandoned'].includes(statusLower)) {
    return '❌ Non-Operational';
  }
  
  return '❓ Unknown Status';
};

export default function BoreholeLayer({ 
  visible = true, 
  dataPath = null,
  countyFilter = null,
  onBoreholeClick,
  opacity = 1.0,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !dataPath) {
      setData(null);
      return;
    }

    setLoading(true);

    fetch(dataPath)
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.json();
      })
      .then(data => {
        console.log(`Loaded boreholes: ${data.features?.length}`);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading boreholes:', err);
        setLoading(false);
      });
  }, [visible, dataPath]);

  const getFilteredData = () => {
    if (!data) return null;
    
    let features = data.features;
    
    if (countyFilter) {
      features = features.filter(f => 
        f.properties.county && 
        f.properties.county.toLowerCase() === countyFilter.toLowerCase()
      );
    }
    
    return {
      ...data,
      features: features
    };
  };

  if (!visible || loading || !data) {
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
          💧 Loading boreholes...
        </div>
      );
    }
    return null;
  }

  const filteredData = getFilteredData();
  if (!filteredData || filteredData.features.length === 0) {
    if (countyFilter) {
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
          💧 No boreholes found in {countyFilter}
        </div>
      );
    }
    return null;
  }

  const statusCounts = {};
  filteredData.features.forEach(f => {
    const status = f.properties.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  console.log('Boreholes by status:', statusCounts);

  return (
    <div style={{ opacity: opacity }}>
      {filteredData.features.map((feature, index) => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;
        const lat = coords[1];
        const lon = coords[0];
        
        if (!lat || !lon) return null;
        
        const status = props.status || 'Unknown';
        const color = getStatusColor(status);
        const label = getStatusLabel(status);
        
        let radius = 6;
        if (color === '#4CAF50') radius = 10;
        else if (color === '#FFC107') radius = 8;
        else if (color === '#F44336') radius = 6;
        else radius = 5;
        
        return (
          <CircleMarker
            key={index}
            center={[lat, lon]}
            radius={radius}
            fillColor={color}
            color={color}
            weight={2}
            opacity={1}
            fillOpacity={0.85}
            eventHandlers={{
              click: () => {
                if (onBoreholeClick) {
                  onBoreholeClick(props);
                }
              }
            }}
          >
            <Tooltip sticky>
              <div style={{ fontSize: '12px', maxWidth: '220px' }}>
                <strong>{props.name || 'Unknown Borehole'}</strong>
                <div style={{ color: color, fontWeight: 'bold', marginTop: '2px' }}>
                  {label}
                </div>
                {props.county && (
                  <div style={{ color: '#666', fontSize: '11px' }}>
                    📍 {props.county}
                  </div>
                )}
                {props.yield && props.yield !== 'Unknown' && (
                  <div style={{ color: '#666', fontSize: '11px' }}>
                    💧 Yield: {props.yield} m³/hr
                  </div>
                )}
              </div>
            </Tooltip>
            <Popup>
              <div style={{ minWidth: '220px', padding: '4px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#1a1a2e' }}>
                  {props.name || 'Unknown Borehole'}
                </h4>
                <hr style={{ margin: '4px 0', border: '0', borderTop: '1px solid #eee' }} />
                <p style={{ margin: '4px 0', fontSize: '13px' }}>
                  <strong>Status:</strong> 
                  <span style={{ color: color, fontWeight: 'bold', marginLeft: '6px' }}>
                    {label}
                  </span>
                </p>
                {props.well_depth && props.well_depth !== 'Unknown' && (
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>Depth:</strong> {props.well_depth} m
                  </p>
                )}
                {props.yield && props.yield !== 'Unknown' && (
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>Yield:</strong> {props.yield} m³/hr
                  </p>
                )}
                {props.county && (
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>County:</strong> {props.county}
                  </p>
                )}
                <hr style={{ margin: '4px 0', border: '0', borderTop: '1px solid #eee' }} />
                <p style={{ margin: '4px 0', fontSize: '11px', color: '#999' }}>
                  📍 {lat.toFixed(4)}, {lon.toFixed(4)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </div>
  );
}