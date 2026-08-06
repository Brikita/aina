import { useEffect, useState } from 'react';
import { GeoJSON, Tooltip } from 'react-leaflet';
import { getCounties } from '../../services/api';

export default function WardLayer({
  visible = true,
  onHover,
  selectedFeature = null,
  opacity = 1.0,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countyDataMap, setCountyDataMap] = useState({});

  useEffect(() => {
    if (!visible) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Step 1: Fetch API data first (population, stats, etc.)
    getCounties()
      .then(apiResponse => {
        console.log('✅ API Counties loaded:', apiResponse.data);
        
        // Create a lookup map: county_name -> API data
        const map = {};
        apiResponse.data.forEach(c => {
          map[c.name] = c;
        });
        setCountyDataMap(map);

        // Step 2: Load local GeoJSON for geometry
        return fetch('/data/kenya_counties_admin.geojson')
          .then(res => {
            if (!res.ok) throw new Error('GeoJSON file not found');
            return res.json();
          })
          .then(geoJsonData => {
            // Step 3: Enrich GeoJSON with API data
            const enrichedFeatures = geoJsonData.features.map(feature => {
              const countyName = feature.properties.COUNTY || feature.properties.COUNTY_NAM || '';
              const apiData = map[countyName] || {};
              
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  // API data (if available)
                  api_id: apiData.id || null,
                  total_population: apiData.population || apiData.total_population || feature.properties.Total_Population19 || 0,
                  male_population: apiData.male || apiData.male_population || feature.properties.Male_populatio_2019 || 0,
                  female_population: apiData.female || apiData.female_population || feature.properties.Female_population_2019 || 0,
                  households: apiData.households || feature.properties.Households || 0,
                  avg_hh_size: apiData.hh_size || apiData.avg_hh_size || feature.properties.Av_HH_Size || 0,
                  area: apiData.area || feature.properties.Shape_Area || 0,
                  // Keep original
                  county_name: countyName,
                }
              };
            });

            setData({
              type: 'FeatureCollection',
              features: enrichedFeatures,
            });
            setLoading(false);
          });
      })
      .catch(err => {
        console.error('❌ Error loading county data:', err.message);
        setError(err.message);
        setLoading(false);
        
        // Fallback: Just load GeoJSON without API data
        fetch('/data/kenya_counties_admin.geojson')
          .then(res => res.json())
          .then(geoJsonData => {
            console.log('⚠️ Using fallback GeoJSON without API data');
            setData(geoJsonData);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      });
  }, [visible]);

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
          🏛️ Loading counties from API...
        </div>
      );
    }
    return null;
  }

  const getDefaultStyle = (feature) => {
    const featureName = feature.properties?.COUNTY || feature.properties?.COUNTY_NAM || '';
    const isSelected = selectedFeature?.name === featureName;
    
    if (isSelected) {
      return {
        fillColor: '#FFD700',
        fillOpacity: 0.5,
        color: '#FFD700',
        weight: 4,
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
    fillColor: '#FFD700',
    fillOpacity: 0.35,
    color: '#FFD700',
    weight: 3,
  });

  const onEachFeature = (feature, layer) => {
    if (!feature) return;

    const props = feature.properties || {};
    const featureName = props.COUNTY || props.COUNTY_NAM || 'Unknown';
    const isSelected = selectedFeature?.name === featureName;

    layer.on({
      mouseover: (e) => {
        layer.setStyle(getHoverStyle());
        layer.bringToFront();
        if (onHover) {
          onHover({
            level: 'county',
            name: featureName,
            feature: feature,
            id: props.api_id,
            // Pass all data for the side panel
            properties: {
              COUNTY: featureName,
              Total_Population19: props.total_population || props.Total_Population19 || 0,
              Male_populatio_2019: props.male_population || props.Male_populatio_2019 || 0,
              Female_population_2019: props.female_population || props.Female_population_2019 || 0,
              Households: props.households || props.Households || 0,
              Av_HH_Size: props.avg_hh_size || props.Av_HH_Size || 0,
              Shape_Area: props.area || props.Shape_Area || 0,
            }
          });
        }
      },
      mouseout: (e) => {
        if (isSelected) {
          layer.setStyle({
            fillColor: '#FFD700',
            fillOpacity: 0.5,
            color: '#FFD700',
            weight: 4,
          });
        } else {
          layer.setStyle({
            fillColor: '#1E90FF',
            fillOpacity: 0.2,
            color: '#1E90FF',
            weight: 2,
          });
        }
      },
      click: (e) => {
        console.log(`📍 County clicked: ${featureName}`);
        if (onHover) {
          onHover({
            level: 'county',
            name: featureName,
            feature: feature,
            id: props.api_id,
            isSelected: true,
            // Pass all data for the side panel
            properties: {
              COUNTY: featureName,
              Total_Population19: props.total_population || props.Total_Population19 || 0,
              Male_populatio_2019: props.male_population || props.Male_populatio_2019 || 0,
              Female_population_2019: props.female_population || props.Female_population_2019 || 0,
              Households: props.households || props.Households || 0,
              Av_HH_Size: props.avg_hh_size || props.Av_HH_Size || 0,
              Shape_Area: props.area || props.Shape_Area || 0,
            }
          });
        }
      },
    });

    if (isSelected) {
      layer.setStyle({
        fillColor: '#FFD700',
        fillOpacity: 0.5,
        color: '#FFD700',
        weight: 4,
      });
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
          {(feature) => {
            const props = feature.properties || {};
            const name = props.COUNTY || props.COUNTY_NAM || 'Unknown';
            const pop = props.total_population || props.Total_Population19 || 0;
            return `
              <div style="font-size: 12px; max-width: 200px;">
                <strong>🏛️ ${name}</strong>
                <div style="color: #666; font-size: 11px;">
                  Population: ${pop.toLocaleString()}
                </div>
              </div>
            `;
          }}
        </Tooltip>
      </GeoJSON>
    </div>
  );
}