import L from 'leaflet';

/**
 * Zoom to the bounds of a GeoJSON feature
 * @param {Object} feature - GeoJSON feature with geometry
 * @param {Object} map - Leaflet map instance
 * @param {number} padding - Padding in pixels (default: 50)
 */
export const zoomToFeature = (feature, map, padding = 50) => {
  if (!feature || !map) return;

  try {
    // Create a GeoJSON layer from the feature
    const layer = L.geoJSON(feature);
    
    // Get the bounds
    const bounds = layer.getBounds();
    
    // Check if bounds are valid
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [padding, padding], maxZoom: 15 });
    } else {
      // Fallback: if bounds are invalid, use center of feature
      const center = L.geoJSON(feature).getBounds().getCenter();
      if (center.lat && center.lng) {
        map.setView(center, 10);
      }
    }
  } catch (error) {
    console.warn('Error zooming to feature:', error);
  }
};

/**
 * Zoom to a specific administrative level
 * @param {Object} selection - The selected feature data
 * @param {Object} map - Leaflet map instance
 */
export const zoomToSelection = (selection, map) => {
  if (!selection || !map) return;

  const { level, feature, name } = selection;

  // Zoom based on level
  let zoomLevel = 6;
  let padding = 50;

  switch(level) {
    case 'county':
      zoomLevel = 8;
      padding = 60;
      break;
    case 'subcounty':
      zoomLevel = 10;
      padding = 50;
      break;
    case 'ward':
      zoomLevel = 12;
      padding = 40;
      break;
    case 'village':
      zoomLevel = 14;
      padding = 30;
      break;
    default:
      zoomLevel = 6;
      padding = 50;
  }

  if (feature) {
    zoomToFeature(feature, map, padding);
  } else {
    // If no feature, just center on Kenya
    map.setView([0.5, 38], zoomLevel);
  }
};

/**
 * Zoom to full Kenya view
 * @param {Object} map - Leaflet map instance
 */
export const zoomToKenya = (map) => {
  if (!map) return;
  map.setView([0.5, 38], 6);
};

/**
 * Calculate zoom level based on area size
 * @param {Object} bounds - Leaflet bounds
 * @returns {number} - Appropriate zoom level
 */
export const calculateZoomLevel = (bounds) => {
  if (!bounds || !bounds.isValid()) return 6;
  
  const area = bounds.getArea ? bounds.getArea() : 0;
  
  // Rough zoom levels based on area
  if (area > 1000000) return 6;      // Very large (Kenya)
  if (area > 100000) return 8;       // County level
  if (area > 10000) return 10;       // Sub-county level
  if (area > 1000) return 12;        // Ward level
  if (area > 100) return 14;         // Village level
  return 15;                          // Very small
};