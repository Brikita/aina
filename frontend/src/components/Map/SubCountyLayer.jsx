import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';

export default function SubCountyLayer({ 
  visible = true, 
  countyName = null,
  onHover,
  selectedFeature = null,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible || !countyName) {
      setData(null);
      setLoading(false);
      return;
    }

    fetch('/data/kenya_subcounties.geojson')
      .then(res => res.json())
      .then(data => {
        const filtered = {
          ...data,
          features: data.features.filter(f => 
            f.properties.county && 
            f.properties.county.toLowerCase() === countyName.toLowerCase()
          )
        };
        console.log(`Loaded ${filtered.features.length} sub-counties for ${countyName}`);
        setData(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading sub-counties:', err);
        setLoading(false);
      });
  }, [visible, countyName]);

  if (!visible || !data || loading || data.features.length === 0) return null;

  const getDefaultStyle = () => ({
    fillColor: '#1E90FF',
    fillOpacity: 0.25,
    color: '#1E90FF',
    weight: 1.5,
    dashArray: '4',
  });

  const getHoverStyle = () => ({
    fillColor: 'yellow',
    fillOpacity: 0.4,
    color: 'yellow',
    weight: 3,
    dashArray: null,
  });

  const getSelectedStyle = () => ({
    fillColor: '#FFD700',
    fillOpacity: 0.5,
    color: '#FFD700',
    weight: 4,
    dashArray: null,
  });

  const onEachFeature = (feature, layer) => {
    if (!feature) return;

    const featureName = feature.properties.subcounty || 'Unknown';
    const isSelected = selectedFeature && 
      selectedFeature.properties && 
      selectedFeature.properties.subcounty === featureName;

    layer.on({
      mouseover: (e) => {
        layer.setStyle(getHoverStyle());
        layer.bringToFront();
        if (onHover) {
          const props = feature.properties || {};
          onHover({
            level: 'subcounty',
            name: props.subcounty || 'Unknown',
            county: props.county || 'Unknown',
          });
        }
      },
      mouseout: (e) => {
        if (isSelected) {
          layer.setStyle(getSelectedStyle());
        } else {
          layer.setStyle(getDefaultStyle());
        }
      },
      click: (e) => {
        if (onHover) {
          const props = feature.properties || {};
          onHover({
            level: 'subcounty',
            name: props.subcounty || 'Unknown',
            county: props.county || 'Unknown',
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
      data={data} 
      style={getDefaultStyle}
      onEachFeature={onEachFeature}
    />
  );
}