import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';

export default function WardLayerNew({ 
  visible = true, 
  subCountyName = null,
  onHover,
  selectedFeature = null,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible || !subCountyName) {
      setData(null);
      setLoading(false);
      return;
    }

    fetch('/data/kenya_wards.geojson')
      .then(res => res.json())
      .then(data => {
        const filtered = {
          ...data,
          features: data.features.filter(f => 
            f.properties.subcounty && 
            f.properties.subcounty.toLowerCase() === subCountyName.toLowerCase()
          )
        };
        console.log(`Loaded ${filtered.features.length} wards for ${subCountyName}`);
        setData(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading wards:', err);
        setLoading(false);
      });
  }, [visible, subCountyName]);

  if (!visible || !data || loading || data.features.length === 0) return null;

  const getDefaultStyle = () => ({
    fillColor: '#1E90FF',
    fillOpacity: 0.3,
    color: '#1E90FF',
    weight: 1,
    dashArray: '3',
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

    const featureName = feature.properties.ward || 'Unknown';
    const isSelected = selectedFeature && 
      selectedFeature.properties && 
      selectedFeature.properties.ward === featureName;

    layer.on({
      mouseover: (e) => {
        layer.setStyle(getHoverStyle());
        layer.bringToFront();
        if (onHover) {
          const props = feature.properties || {};
          onHover({
            level: 'ward',
            name: props.ward || 'Unknown',
            subcounty: props.subcounty || 'Unknown',
            county: props.county || 'Unknown',
            population: props.pop2009 || 0,
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
            level: 'ward',
            name: props.ward || 'Unknown',
            subcounty: props.subcounty || 'Unknown',
            county: props.county || 'Unknown',
            population: props.pop2009 || 0,
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