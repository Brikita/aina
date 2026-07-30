import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';

// Import Leaflet plugins
import 'leaflet-draw';
import 'leaflet-fullscreen';

// Import leaflet-search differently
import 'leaflet-search';

// Import geocoder
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

export default function Toolbar() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Fullscreen control
    L.control.fullscreen({
      position: 'topleft'
    }).addTo(map);

    // Search/Geocoder control
    L.Control.geocoder({
      position: 'topleft',
      defaultMarkGeocode: false,
    }).addTo(map);

    // Draw control with all tools
    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        rectangle: true,
        polygon: true,
        circle: true,
        polyline: true,
        marker: true,
        circlemarker: false,
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
        remove: true,
      },
    });
    map.addControl(drawControl);

    // Cleanup
    return () => {
      map.removeControl(drawControl);
    };
  }, [map]);

  return null;
}