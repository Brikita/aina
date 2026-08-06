// ============================================
// FALLBACK GEOJSON DATA
// Used when API is unavailable
// ============================================

export const FALLBACK_WARDS = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: 1,
      properties: {
        COUNTY_NAM: "Turkana",
        Total_Population19: 926976,
        Male_populatio_2019: 463488,
        Female_population_2019: 463488,
        Households: 185395,
        Av_HH_Size: 5.0,
        Shape_Area: 71600.5,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [34.5, 4.5], [36.0, 4.5], [36.0, 1.5], [34.5, 1.5], [34.5, 4.5]
        ]]
      }
    },
    {
      type: "Feature",
      id: 2,
      properties: {
        COUNTY_NAM: "Nairobi",
        Total_Population19: 4397073,
        Male_populatio_2019: 2198536,
        Female_population_2019: 2198537,
        Households: 879414,
        Av_HH_Size: 5.0,
        Shape_Area: 696.0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [36.7, -1.4], [37.0, -1.4], [37.0, -1.1], [36.7, -1.1], [36.7, -1.4]
        ]]
      }
    },
    {
      type: "Feature",
      id: 3,
      properties: {
        COUNTY_NAM: "Mombasa",
        Total_Population19: 1208333,
        Male_populatio_2019: 604166,
        Female_population_2019: 604167,
        Households: 241666,
        Av_HH_Size: 5.0,
        Shape_Area: 212.5,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [39.5, -4.2], [39.8, -4.2], [39.8, -3.9], [39.5, -3.9], [39.5, -4.2]
        ]]
      }
    },
    {
      type: "Feature",
      id: 4,
      properties: {
        COUNTY_NAM: "Kisumu",
        Total_Population19: 1155574,
        Male_populatio_2019: 577787,
        Female_population_2019: 577787,
        Households: 231114,
        Av_HH_Size: 5.0,
        Shape_Area: 2081.0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [34.5, -0.2], [35.0, -0.2], [35.0, 0.2], [34.5, 0.2], [34.5, -0.2]
        ]]
      }
    },
    {
      type: "Feature",
      id: 5,
      properties: {
        COUNTY_NAM: "Nakuru",
        Total_Population19: 2163202,
        Male_populatio_2019: 1081601,
        Female_population_2019: 1081601,
        Households: 432640,
        Av_HH_Size: 5.0,
        Shape_Area: 7495.0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [35.8, -0.8], [36.2, -0.8], [36.2, -0.2], [35.8, -0.2], [35.8, -0.8]
        ]]
      }
    },
    {
      type: "Feature",
      id: 6,
      properties: {
        COUNTY_NAM: "Kiambu",
        Total_Population19: 2417735,
        Male_populatio_2019: 1208867,
        Female_population_2019: 1208868,
        Households: 483547,
        Av_HH_Size: 5.0,
        Shape_Area: 2449.0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [36.5, -1.5], [37.0, -1.5], [37.0, -1.0], [36.5, -1.0], [36.5, -1.5]
        ]]
      }
    },
  ]
};

export default FALLBACK_WARDS;