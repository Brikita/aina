import { useEffect, useState, useRef } from 'react';
import { GeoJSON } from 'react-leaflet';

export default function WardLayer({ 
  visible = true, 
  onHover, 
  selectedFeature = null,
  onLayerReady,
  hasChildSelected = false,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      setLoading(false);
      return;
    }

    fetch('/data/kenya_counties_admin.geojson')
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.json();
      })
      .then(data => {
        console.log('Loaded Kenya counties (admin):', data.features?.length);
        setData(data);
        setLoading(false);
        if (onLayerReady) {
          onLayerReady(data);
        }
      })
      .catch((err) => {
        console.error('Error loading county data:', err);
        setLoading(false);
      });
  }, [visible, onLayerReady]);

  if (!visible || loading) return null;
  if (!data) return null;

  const getDefaultStyle = (feature) => {
    const isSelected = selectedFeature && 
      selectedFeature.properties && 
      selectedFeature.properties.COUNTY === feature.properties.COUNTY;
    
    if (hasChildSelected && !isSelected) {
      return {
        fillColor: '#1E90FF',
        fillOpacity: 0.08,
        color: '#1E90FF',
        weight: 0.5,
        opacity: 0.3,
      };
    }
    
    return {
      fillColor: '#1E90FF',
      fillOpacity: 0.2,
      color: '#1E90FF',
      weight: 2,
    };
  };

  const getHoverStyle = () => ({
    fillColor: 'yellow',
    fillOpacity: 0.4,
    color: 'yellow',
    weight: 3,
  });

  const getSelectedStyle = () => ({
    fillColor: '#FFD700',
    fillOpacity: 0.5,
    color: '#FFD700',
    weight: 4,
  });

  const onEachFeature = (feature, layer) => {
    if (!feature) return;

    const featureName = feature.properties.COUNTY || 'Unknown';
    const isSelected = selectedFeature && 
      selectedFeature.properties && 
      selectedFeature.properties.COUNTY === featureName;

    layer.on({
      mouseover: (e) => {
        if (!hasChildSelected || isSelected) {
          layer.setStyle(getHoverStyle());
          layer.bringToFront();
        }
        
        if (onHover) {
          const props = feature.properties || {};
          onHover({
            level: 'county',
            name: props.COUNTY || 'Unknown',
            area: props.Shape_Area || 0,
            perimeter: props.Shape_Leng || 0,
          });
        }
      },
      mouseout: (e) => {
        if (isSelected) {
          layer.setStyle(getSelectedStyle());
        } else {
          layer.setStyle(getDefaultStyle(feature));
        }
      },
      click: (e) => {
        if (onHover) {
          const props = feature.properties || {};
          onHover({
            level: 'county',
            name: props.COUNTY || 'Unknown',
            area: props.Shape_Area || 0,
            perimeter: props.Shape_Leng || 0,
            isSelected: true,
            feature: feature,
          });
        }
      }
    });

    if (isSelected) {
      layer.setStyle(getSelectedStyle());
      layer.bringToFront();
    }
  };

  return (
    <GeoJSON 
      ref={layerRef}
      data={data} 
      style={getDefaultStyle}
      onEachFeature={onEachFeature}
    />
  );
}