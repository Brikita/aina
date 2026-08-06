import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';
import { getCounties } from '../../services/api';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

// 1. Define FeatureProperties FIRST
interface FeatureProperties {
  NAME?: string;
  name?: string;
  COUNTY?: string;
  ADMIN1?: string;
  DISTRICT?: string;
  country?: string;
  [key: string]: unknown;
}

// 2. Define CountryFeature using the interface above
type CountryFeature = Feature<Geometry, FeatureProperties>;

// 3. Define CountryConfig BEFORE using it
interface CountryConfig {
  color: string;
  label: string;
  emoji: string;
  level: string;
  adminLevel: string;
}

// 4. COUNTRY_CONFIG with proper typing
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

interface IGADCountryLayerProps {
  countryKey: string | null;
  visible: boolean;
  onHover?: (data: unknown) => void;
  selectedFeature?: CountryFeature | null;
  opacity?: number;
}

// 5. Define ApiCountryItem type
interface ApiCountryItem {
  id: number;
  name: string;
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

    getCounties()
      .then((response: { data: ApiCountryItem[] }) => {
        console.log(`✅ ${config.label} data loaded:`, response.data);

        const features: CountryFeature[] = response.data.map((item: ApiCountryItem, index: number) => ({
          type: "Feature",
          id: item.id,
          properties: {
            NAME: item.name,
            country: config.label,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [39 + (index % 10) * 0.3, -1.5 + Math.floor(index / 10) * 0.3],
                [39.3 + (index % 10) * 0.3, -1.5 + Math.floor(index / 10) * 0.3],
                [39.3 + (index % 10) * 0.3, -1.2 + Math.floor(index / 10) * 0.3],
                [39 + (index % 10) * 0.3, -1.2 + Math.floor(index / 10) * 0.3],
                [39 + (index % 10) * 0.3, -1.5 + Math.floor(index / 10) * 0.3],
              ],
            ],
          },
        }));

        // ✅ Add 'as FeatureCollection' to tell TypeScript this is valid GeoJSON
        setData({
          type: 'FeatureCollection',
          features: features,
        } as FeatureCollection);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error(`❌ Error loading ${config.label}:`, err);
        setError(err.message);
        setLoading(false);
      });
  }, [visible, config]);

  if (!visible || loading || !data || !config) {
    if (loading && visible) {
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
          🌍 Loading {config?.label || 'country'}...
        </div>
      );
    }
    return null;
  }

  const getDefaultStyle = () => ({
    fillColor: config.color,
    fillOpacity: 0.2,
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

    const featureName = feature.properties?.NAME || 
                        feature.properties?.name || 
                        feature.properties?.COUNTY || 
                        'Unknown';

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

  return (
    <div style={{ opacity: opacity }}>
      <GeoJSON
        data={data}
        style={getDefaultStyle}
        onEachFeature={onEachFeature}
      >
        <Tooltip sticky>
          {(feature: CountryFeature) => {
            const name = feature.properties?.NAME || 
                         feature.properties?.name || 
                         feature.properties?.COUNTY || 
                         'Unknown';
            return `
              <div style="font-size: 12px; max-width: 200px;">
                <strong>${config.emoji} ${config.label}</strong>
                <div style="color: #666; font-size: 11px;">${config.adminLevel}: ${name}</div>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}