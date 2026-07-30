import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import dataManager from '../../services/DataManager';

export default function VillageLayer({ 
  visible = true, 
  wardName = null,
  wardId = null,
  onHover,
  selectedFeature = null,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !wardName) {
      setData(null);
      return;
    }

    const cacheKey = `villages_${wardName.toLowerCase()}`;

    if (dataManager.has(cacheKey)) {
      console.log(`[Cache] Villages for ${wardName} loaded from cache`);
      setData(dataManager.get(cacheKey));
      return;
    }

    if (dataManager.isLoading(cacheKey)) {
      return;
    }

    dataManager.setLoading(cacheKey, true);
    setLoading(true);

    setTimeout(() => {
      fetch('/data/kenya_villages.geojson')
        .then(res => res.json())
        .then(fullData => {
          const filtered = {
            ...fullData,
            features: fullData.features.filter(f => {
              const adminCode = f.properties.ADMINCODE || '';
              const name = f.properties.NAME || '';
              return name && name.toLowerCase().includes(wardName.toLowerCase());
            })
          };
          
          dataManager.set(cacheKey, filtered);
          dataManager.setLoading(cacheKey, false);
          setData(filtered);
          setLoading(false);
          console.log(`[Loaded] ${filtered.features.length} villages for ${wardName}`);
        })
        .catch(err => {
          console.error('Error loading villages:', err);
          dataManager.setLoading(cacheKey, false);
          setLoading(false);
        });
    }, 50);
  }, [visible, wardName, wardId]);

  if (!visible || !data || loading || data.features.length === 0) return null;

  const getDefaultStyle = () => ({
    fillColor: '#9C27B0',
    fillOpacity: 0.25,
    color: '#9C27B0',
    weight: 0.5,
  });

  const getHoverStyle = () => ({
    fillColor: 'yellow',
    fillOpacity: 0.4,
    color: 'yellow',
    weight: 2,
  });

  const getSelectedStyle = () => ({
    fillColor: '#FFD700',
    fillOpacity: 0.5,
    color: '#FFD700',
    weight: 3,
  });

  const onEachFeature = (feature, layer) => {
    if (!feature) return;

    const featureName = feature.properties.NAME || 'Unknown';
    const isSelected = selectedFeature && 
      selectedFeature.properties && 
      selectedFeature.properties.NAME === featureName;

    layer.on({
      mouseover: (e) => {
        layer.setStyle(getHoverStyle());
        layer.bringToFront();
        if (onHover) {
          const props = feature.properties || {};
          onHover({
            level: 'village',
            name: props.NAME || 'Unknown',
            adminCode: props.ADMINCODE || '',
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
            level: 'village',
            name: props.NAME || 'Unknown',
            adminCode: props.ADMINCODE || '',
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