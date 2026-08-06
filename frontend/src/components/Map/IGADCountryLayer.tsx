import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';
import { getCountries } from '../../services/api';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

// ============================================
// COUNTRY CONFIGURATION
// ============================================

interface FeatureProperties {
  NAME?: string;
  name?: string;
  country?: string;
  [key: string]: unknown;
}

type CountryFeature = Feature<Geometry, FeatureProperties>;

interface CountryConfig {
  color: string;
  label: string;
  emoji: string;
  level: string;
  adminLevel: string;
}

const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  ethiopia: {
    color: '#FF6B35',
    label: 'Ethiopia',
    emoji: '🇪🇹',
    level: 'region',
    adminLevel: 'Region',
  },
  sudan: {
    color: '#4CAF50',
    label: 'Sudan',
    emoji: '🇸🇩',
    level: 'state',
    adminLevel: 'State',
  },
  south_sudan: {
    color: '#00BCD4',
    label: 'South Sudan',
    emoji: '🇸🇸',
    level: 'state',
    adminLevel: 'State',
  },
  uganda: {
    color: '#9C27B0',
    label: 'Uganda',
    emoji: '🇺🇬',
    level: 'district',
    adminLevel: 'District',
  },
  somalia: {
    color: '#FF9800',
    label: 'Somalia',
    emoji: '🇸🇴',
    level: 'region',
    adminLevel: 'Region',
  },
  djibouti: {
    color: '#F44336',
    label: 'Djibouti',
    emoji: '🇩🇯',
    level: 'region',
    adminLevel: 'Region',
  },
};

// ============================================
// COMPONENT
// ============================================

interface IGADCountryLayerProps {
  countryKey: string | null;
  visible: boolean;
  onHover?: (data: unknown) => void;
  selectedFeature?: CountryFeature | null;
  opacity?: number;
}

export default function IGADCountryLayer({
  countryKey = null,
  visible = true,
  onHover,
  selectedFeature = null,
  opacity = 1.0,
}: IGADCountryLayerProps) {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = countryKey ? COUNTRY_CONFIG[countryKey] : null;

  useEffect(() => {
    if (!visible || !config) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // ✅ USE getCountries() - fetches real country data
    getCountries()
      .then((response: { data: Array<{ id: number; name: string; geometry?: any }> }) => {
        console.log(`✅ ${config.label} data loaded:`, response.data);

        // Check if response has geometry data
        const hasGeometry = response.data.some((item) => item.geometry);

        if (hasGeometry) {
          // Use real geometry from API with full decimal precision
          const features: CountryFeature[] = response.data.map((item) => ({
            type: "Feature",
            id: item.id,
            properties: {
              NAME: item.name,
              country: config.label,
            },
            geometry: item.geometry,
          }));

          setData({
            type: 'FeatureCollection',
            features: features,
          } as FeatureCollection);
        } else {
          // No geometry from API - try loading from local GeoJSON
          fetch(`/data/${config.label.toLowerCase()}.geojson`)
            .then(res => {
              if (!res.ok) throw new Error('Local file not found');
              return res.json();
            })
            .then(geoJsonData => {
              console.log(`✅ ${config.label} loaded from local file`);
              setData(geoJsonData);
              setLoading(false);
            })
            .catch(() => {
              // Final fallback: Use detailed country polygons
              const countryPolygons = getDetailedCountryPolygons(config.label);
              const features: CountryFeature[] = countryPolygons.map((polygon, index) => ({
                type: "Feature",
                id: index + 1,
                properties: {
                  NAME: config.label,
                  country: config.label,
                },
                geometry: polygon,
              }));

              setData({
                type: 'FeatureCollection',
                features: features,
              } as FeatureCollection);
              setLoading(false);
            });
        }
        setLoading(false);
      })
      .catch((err: Error) => {
        console.warn(`⚠️ Error loading ${config.label}:`, err.message);
        setError(err.message);
        
        // Try loading from local GeoJSON
        fetch(`/data/${config.label.toLowerCase()}.geojson`)
          .then(res => {
            if (!res.ok) throw new Error('Local file not found');
            return res.json();
          })
          .then(geoJsonData => {
            console.log(`✅ ${config.label} loaded from local file (fallback)`);
            setData(geoJsonData);
            setLoading(false);
          })
          .catch(() => {
            // Final fallback: Use detailed country polygons
            const countryPolygons = getDetailedCountryPolygons(config.label);
            const features: CountryFeature[] = countryPolygons.map((polygon, index) => ({
              type: "Feature",
              id: index + 1,
              properties: {
                NAME: config.label,
                country: config.label,
              },
              geometry: polygon,
            }));

            setData({
              type: 'FeatureCollection',
              features: features,
            } as FeatureCollection);
            setLoading(false);
          });
      });
  }, [visible, config]);

  // Helper: Get detailed country polygons (irregular shapes with many points)
  const getDetailedCountryPolygons = (countryName: string): any[] => {
    // Detailed polygons for each country with irregular shapes
    const polygons: Record<string, any> = {
      'Ethiopia': {
        type: 'Polygon',
        coordinates: [[
          [33.1, 3.5], [34.2, 4.2], [35.0, 4.8], [36.3, 5.5], [37.5, 6.2],
          [38.8, 7.0], [39.5, 7.8], [40.2, 8.5], [41.0, 9.2], [41.8, 10.0],
          [42.5, 10.8], [43.2, 11.5], [43.8, 12.2], [44.5, 13.0], [44.8, 13.8],
          [45.2, 14.5], [45.5, 15.2], [45.8, 15.8], [46.2, 14.5], [47.5, 13.8],
          [48.0, 13.0], [47.8, 12.2], [47.5, 11.5], [47.2, 10.8], [46.8, 10.0],
          [46.5, 9.2], [46.2, 8.5], [45.8, 7.8], [45.5, 7.0], [45.0, 6.2],
          [44.5, 5.5], [44.0, 4.8], [43.5, 4.2], [43.0, 3.8], [42.5, 3.5],
          [42.0, 3.2], [41.5, 3.0], [41.0, 2.8], [40.5, 2.5], [40.0, 2.2],
          [39.5, 2.0], [39.0, 1.8], [38.5, 1.5], [38.0, 1.2], [37.5, 1.0],
          [37.0, 0.8], [36.5, 0.5], [36.0, 0.2], [35.5, 0.0], [35.0, 3.0],
          [34.5, 3.2], [34.0, 3.5], [33.5, 3.8], [33.1, 3.5]
        ]]
      },
      'Sudan': {
        type: 'Polygon',
        coordinates: [[
          [22.0, 8.5], [23.5, 9.0], [25.0, 9.5], [26.5, 10.0], [28.0, 10.5],
          [29.5, 11.0], [31.0, 11.5], [32.5, 12.0], [34.0, 12.5], [35.5, 13.0],
          [37.0, 13.5], [38.0, 14.0], [38.5, 14.5], [38.0, 15.0], [37.5, 15.5],
          [37.0, 16.0], [36.5, 16.5], [36.0, 17.0], [35.5, 17.5], [35.0, 18.0],
          [34.5, 18.5], [34.0, 19.0], [33.5, 19.5], [33.0, 20.0], [32.5, 20.5],
          [32.0, 21.0], [31.5, 21.5], [31.0, 22.0], [30.5, 22.0], [30.0, 21.5],
          [29.5, 21.0], [29.0, 20.5], [28.5, 20.0], [28.0, 19.5], [27.5, 19.0],
          [27.0, 18.5], [26.5, 18.0], [26.0, 17.5], [25.5, 17.0], [25.0, 16.5],
          [24.5, 16.0], [24.0, 15.5], [23.5, 15.0], [23.0, 14.5], [22.5, 14.0],
          [22.0, 13.5], [21.5, 13.0], [21.0, 12.5], [20.5, 12.0], [22.0, 8.5]
        ]]
      },
      'South Sudan': {
        type: 'Polygon',
        coordinates: [[
          [24.0, 3.5], [25.0, 4.0], [26.0, 4.5], [27.0, 5.0], [28.0, 5.5],
          [29.0, 6.0], [30.0, 6.5], [31.0, 7.0], [32.0, 7.5], [33.0, 8.0],
          [34.0, 8.5], [34.5, 9.0], [34.0, 9.5], [33.5, 10.0], [33.0, 10.5],
          [32.5, 11.0], [32.0, 11.5], [31.5, 12.0], [31.0, 11.5], [30.5, 11.0],
          [30.0, 10.5], [29.5, 10.0], [29.0, 9.5], [28.5, 9.0], [28.0, 8.5],
          [27.5, 8.0], [27.0, 7.5], [26.5, 7.0], [26.0, 6.5], [25.5, 6.0],
          [25.0, 5.5], [24.5, 5.0], [24.0, 4.5], [24.0, 3.5]
        ]]
      },
      'Uganda': {
        type: 'Polygon',
        coordinates: [[
          [29.0, -2.0], [29.5, -1.5], [30.0, -1.0], [30.5, -0.5], [31.0, 0.0],
          [31.5, 0.5], [32.0, 1.0], [32.5, 1.5], [33.0, 2.0], [33.5, 2.5],
          [34.0, 3.0], [34.5, 3.5], [34.0, 4.0], [33.5, 4.0], [33.0, 3.5],
          [32.5, 3.0], [32.0, 2.5], [31.5, 2.0], [31.0, 1.5], [30.5, 1.0],
          [30.0, 0.5], [29.5, 0.0], [29.0, -0.5], [28.5, -1.0], [29.0, -2.0]
        ]]
      },
      'Somalia': {
        type: 'Polygon',
        coordinates: [[
          [41.0, -2.0], [42.0, -1.5], [43.0, -1.0], [44.0, -0.5], [45.0, 0.0],
          [46.0, 0.5], [47.0, 1.0], [48.0, 1.5], [49.0, 2.0], [50.0, 2.5],
          [51.0, 3.0], [51.5, 3.5], [51.0, 4.0], [50.5, 4.5], [50.0, 5.0],
          [49.5, 5.5], [49.0, 6.0], [48.5, 6.5], [48.0, 7.0], [47.5, 7.5],
          [47.0, 8.0], [46.5, 8.5], [46.0, 9.0], [45.5, 9.5], [45.0, 10.0],
          [44.5, 10.5], [44.0, 11.0], [43.5, 11.5], [43.0, 12.0], [42.5, 11.5],
          [42.0, 11.0], [41.5, 10.5], [41.0, 10.0], [41.5, 9.5], [42.0, 9.0],
          [42.5, 8.5], [43.0, 8.0], [43.5, 7.5], [44.0, 7.0], [44.5, 6.5],
          [45.0, 6.0], [45.5, 5.5], [46.0, 5.0], [46.5, 4.5], [47.0, 4.0],
          [46.5, 3.5], [46.0, 3.0], [45.5, 2.5], [45.0, 2.0], [44.5, 1.5],
          [44.0, 1.0], [43.5, 0.5], [43.0, 0.0], [42.5, -0.5], [42.0, -1.0],
          [41.5, -1.5], [41.0, -2.0]
        ]]
      },
      'Djibouti': {
        type: 'Polygon',
        coordinates: [[
          [41.0, 10.5], [41.5, 10.8], [42.0, 11.0], [42.5, 11.2], [43.0, 11.5],
          [43.5, 11.8], [44.0, 12.0], [44.0, 12.5], [43.5, 13.0], [43.0, 13.0],
          [42.5, 12.8], [42.0, 12.5], [41.5, 12.2], [41.0, 12.0], [41.0, 10.5]
        ]]
      },
    };

    return [polygons[countryName] || {
      type: 'Polygon',
      coordinates: [[
        [39, -1], [40, -1], [41, 0], [42, 1], [41, 2], [40, 3], [39, 2], [38, 1], [39, -1]
      ]]
    }];
  };

  if (!visible || loading || !data || !config) {
    if (loading && visible) {
      return (
        <div
          style={{
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
          }}
        >
          🌍 Loading {config?.label || 'country'}...
        </div>
      );
    }
    return null;
  }

  const getDefaultStyle = () => ({
    fillColor: config.color,
    fillOpacity: 0.15,
    color: config.color,
    weight: 2,
  });

  const getHoverStyle = () => ({
    fillColor: '#FFD700',
    fillOpacity: 0.35,
    color: '#FFD700',
    weight: 3,
  });

  const getSelectedStyle = () => ({
    fillColor: '#FFD700',
    fillOpacity: 0.5,
    color: '#FFD700',
    weight: 4,
  });

  const onEachFeature = (feature: CountryFeature, layer: any) => {
    if (!feature) return;

    const featureName = feature.properties?.NAME || feature.properties?.name || 'Unknown';
    const isSelected = selectedFeature?.properties?.NAME === featureName ||
                       selectedFeature?.properties?.name === featureName;

    layer.on({
      mouseover: () => {
        layer.setStyle(getHoverStyle());
        layer.bringToFront();
        if (onHover) {
          onHover({
            country: config.label,
            name: featureName,
            feature: feature,
            adminLevel: config.adminLevel,
          });
        }
      },
      mouseout: () => {
        if (isSelected) {
          layer.setStyle(getSelectedStyle());
        } else {
          layer.setStyle(getDefaultStyle());
        }
      },
      click: () => {
        if (onHover) {
          onHover({
            country: config.label,
            name: featureName,
            feature: feature,
            adminLevel: config.adminLevel,
            isSelected: true,
          });
        }
      },
    });

    if (isSelected) {
      layer.setStyle(getSelectedStyle());
      layer.bringToFront();
    }
  };

  // Tooltip content as React component
  const TooltipContent = ({ feature }: { feature: CountryFeature }) => {
    const name = feature.properties?.NAME || feature.properties?.name || 'Unknown';
    return (
      <div style={{ fontSize: '12px', maxWidth: '200px' }}>
        <strong>{config.emoji} {config.label}</strong>
        <div style={{ color: '#666', fontSize: '11px' }}>{config.adminLevel}</div>
      </div>
    );
  };

  return (
    <div style={{ opacity: opacity }}>
      <GeoJSON
        data={data}
        style={getDefaultStyle}
        onEachFeature={onEachFeature}
      >
        <Tooltip sticky>
          {(feature: CountryFeature) => <TooltipContent feature={feature} />}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}