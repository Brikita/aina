import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';

export default function DrawControl({ onDrawCreate, onDrawEdit, onDrawDelete }) {
  const map = useMap();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const featureGroupRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (typeof L.Control.Draw === 'undefined') {
      console.error('Leaflet Draw not loaded properly');
      return;
    }

    const featureGroup = new L.FeatureGroup();
    featureGroupRef.current = featureGroup;

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: '#FF6B35',
            fillColor: '#FF6B35',
            fillOpacity: 0.3,
            weight: 2,
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#FF6B35',
            fillColor: '#FF6B35',
            fillOpacity: 0.3,
            weight: 2,
          }
        },
        circle: {
          shapeOptions: {
            color: '#FF6B35',
            fillColor: '#FF6B35',
            fillOpacity: 0.3,
            weight: 2,
          }
        },
        polyline: {
          shapeOptions: {
            color: '#FF6B35',
            weight: 3,
          }
        },
        marker: true,
        circlemarker: false,
      },
      edit: {
        featureGroup: featureGroup,
        remove: true,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      featureGroup.addLayer(layer);
      setIsEditing(true);
      setSelectedLayer(layer);
      if (onDrawCreate) {
        onDrawCreate(layer);
      }
    });

    map.on(L.Draw.Event.EDITED, (event) => {
      const layers = event.layers;
      setIsEditing(true);
      if (onDrawEdit) {
        onDrawEdit(layers);
      }
    });

    map.on(L.Draw.Event.DELETED, (event) => {
      const layers = event.layers;
      if (onDrawDelete) {
        onDrawDelete(layers);
      }
    });

    map.on(L.Draw.Event.DRAWSTART, () => {
      setIsEditing(true);
    });

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.EDITED);
      map.off(L.Draw.Event.DELETED);
      map.off(L.Draw.Event.DRAWSTART);
    };
  }, [map, onDrawCreate, onDrawEdit, onDrawDelete]);

  const handleSave = () => {
    if (selectedLayer) {
      if (selectedLayer.editing) {
        selectedLayer.editing.disable();
      }
      setIsEditing(false);
      setSelectedLayer(null);
      if (onDrawCreate && featureGroupRef.current) {
        const geoJSON = featureGroupRef.current.toGeoJSON();
        onDrawCreate(geoJSON);
      }
    }
  };

  const handleCancel = () => {
    if (selectedLayer && featureGroupRef.current) {
      featureGroupRef.current.removeLayer(selectedLayer);
      setSelectedLayer(null);
      setIsEditing(false);
    }
  };

  const handleClearAll = () => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
      setSelectedLayer(null);
      setIsEditing(false);
      if (onDrawDelete) {
        onDrawDelete(null);
      }
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '75px',
      left: '10px',
      zIndex: 1000,
      background: '#f0f0f0',
      borderRadius: '4px',
      padding: '6px 10px',
      display: isEditing ? 'flex' : 'none',
      gap: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      fontSize: '13px',
    }}>
      <button
        onClick={handleSave}
        style={{
          padding: '4px 12px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '12px',
        }}
      >
        Save
      </button>
      <button
        onClick={handleCancel}
        style={{
          padding: '4px 12px',
          background: '#FF9800',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '12px',
        }}
      >
        Cancel
      </button>
      <button
        onClick={handleClearAll}
        style={{
          padding: '4px 12px',
          background: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '12px',
        }}
      >
        Clear All
      </button>
    </div>
  );
}