// ============================================
// FALLBACK DATA - Complete Mock Dataset
// Used when API is unavailable
// ============================================

// ============================================
// 1. COUNTIES (47 Kenya Counties - Sample)
// ============================================

export const FALLBACK_COUNTIES = [
  { id: 1, name: "Turkana", population: 926976, male: 463488, female: 463488, households: 185395, hh_size: 5.0, area: 71600.5 },
  { id: 2, name: "Nairobi", population: 4397073, male: 2198536, female: 2198537, households: 879414, hh_size: 5.0, area: 696.0 },
  { id: 3, name: "Mombasa", population: 1208333, male: 604166, female: 604167, households: 241666, hh_size: 5.0, area: 212.5 },
  { id: 4, name: "Kisumu", population: 1155574, male: 577787, female: 577787, households: 231114, hh_size: 5.0, area: 2081.0 },
  { id: 5, name: "Nakuru", population: 2163202, male: 1081601, female: 1081601, households: 432640, hh_size: 5.0, area: 7495.0 },
  { id: 6, name: "Kiambu", population: 2417735, male: 1208867, female: 1208868, households: 483547, hh_size: 5.0, area: 2449.0 },
  { id: 7, name: "Machakos", population: 1421932, male: 710966, female: 710966, households: 284386, hh_size: 5.0, area: 5952.0 },
  { id: 8, name: "Uasin Gishu", population: 1163186, male: 581593, female: 581593, households: 232637, hh_size: 5.0, area: 3345.0 },
  { id: 9, name: "Meru", population: 1545714, male: 772857, female: 772857, households: 309142, hh_size: 5.0, area: 6936.0 },
  { id: 10, name: "Kakamega", population: 1867579, male: 933789, female: 933790, households: 373515, hh_size: 5.0, area: 3051.0 },
  { id: 11, name: "Bungoma", population: 1670570, male: 835285, female: 835285, households: 334114, hh_size: 5.0, area: 2206.0 },
  { id: 12, name: "Garissa", population: 841353, male: 420676, female: 420677, households: 168270, hh_size: 5.0, area: 44753.0 },
  { id: 13, name: "Mandera", population: 867457, male: 433728, female: 433729, households: 173491, hh_size: 5.0, area: 25797.0 },
  { id: 14, name: "Wajir", population: 781263, male: 390631, female: 390632, households: 156252, hh_size: 5.0, area: 56795.0 },
  { id: 15, name: "Marsabit", population: 459785, male: 229892, female: 229893, households: 91957, hh_size: 5.0, area: 66797.0 },
  { id: 16, name: "Tana River", population: 315943, male: 157971, female: 157972, households: 63188, hh_size: 5.0, area: 35512.0 },
  { id: 17, name: "Lamu", population: 143920, male: 71960, female: 71960, households: 28784, hh_size: 5.0, area: 6496.0 },
  { id: 18, name: "Kwale", population: 866820, male: 433410, female: 433410, households: 173364, hh_size: 5.0, area: 8270.0 },
  { id: 19, name: "Kilifi", population: 1453787, male: 726893, female: 726894, households: 290757, hh_size: 5.0, area: 12245.0 },
  { id: 20, name: "Taita Taveta", population: 340671, male: 170335, female: 170336, households: 68134, hh_size: 5.0, area: 17043.0 },
  { id: 21, name: "Makueni", population: 987653, male: 493826, female: 493827, households: 197530, hh_size: 5.0, area: 8008.0 },
  { id: 22, name: "Kitui", population: 1136187, male: 568093, female: 568094, households: 227237, hh_size: 5.0, area: 24173.0 },
  { id: 23, name: "Embu", population: 608599, male: 304299, female: 304300, households: 121719, hh_size: 5.0, area: 2555.0 },
  { id: 24, name: "Tharaka Nithi", population: 393177, male: 196588, female: 196589, households: 78635, hh_size: 5.0, area: 2609.0 },
  { id: 25, name: "Isiolo", population: 268002, male: 134001, female: 134001, households: 53600, hh_size: 5.0, area: 25336.0 },
  { id: 26, name: "Laikipia", population: 518560, male: 259280, female: 259280, households: 103712, hh_size: 5.0, area: 9462.0 },
  { id: 27, name: "Nyeri", population: 759164, male: 379582, female: 379582, households: 151832, hh_size: 5.0, area: 2361.0 },
  { id: 28, name: "Kirinyaga", population: 610411, male: 305205, female: 305206, households: 122082, hh_size: 5.0, area: 1478.0 },
  { id: 29, name: "Murang'a", population: 1049654, male: 524827, female: 524827, households: 209930, hh_size: 5.0, area: 2558.0 },
  { id: 30, name: "Nandi", population: 885711, male: 442855, female: 442856, households: 177142, hh_size: 5.0, area: 2884.0 },
  { id: 31, name: "Kericho", population: 901777, male: 450888, female: 450889, households: 180355, hh_size: 5.0, area: 2454.0 },
  { id: 32, name: "Bomet", population: 875689, male: 437844, female: 437845, households: 175137, hh_size: 5.0, area: 1997.0 },
  { id: 33, name: "Narok", population: 1150862, male: 575431, female: 575431, households: 230172, hh_size: 5.0, area: 17921.0 },
  { id: 34, name: "Kajiado", population: 1117340, male: 558670, female: 558670, households: 223468, hh_size: 5.0, area: 21901.0 },
  { id: 35, name: "Samburu", population: 310327, male: 155163, female: 155164, households: 62065, hh_size: 5.0, area: 20682.0 },
  { id: 36, name: "Baringo", population: 665018, male: 332509, female: 332509, households: 133003, hh_size: 5.0, area: 11075.0 },
  { id: 37, name: "West Pokot", population: 621241, male: 310620, female: 310621, households: 124248, hh_size: 5.0, area: 9089.0 },
  { id: 38, name: "Elgeyo Marakwet", population: 454480, male: 227240, female: 227240, households: 90896, hh_size: 5.0, area: 3029.0 },
  { id: 39, name: "Trans Nzoia", population: 990341, male: 495170, female: 495171, households: 198068, hh_size: 5.0, area: 2495.0 },
  { id: 40, name: "Bungoma", population: 1670570, male: 835285, female: 835285, households: 334114, hh_size: 5.0, area: 2206.0 },
  { id: 41, name: "Busia", population: 893681, male: 446840, female: 446841, households: 178736, hh_size: 5.0, area: 1695.0 },
  { id: 42, name: "Siaya", population: 993183, male: 496591, female: 496592, households: 198636, hh_size: 5.0, area: 2522.0 },
  { id: 43, name: "Homa Bay", population: 1131950, male: 565975, female: 565975, households: 226390, hh_size: 5.0, area: 3154.0 },
  { id: 44, name: "Migori", population: 1116436, male: 558218, female: 558218, households: 223287, hh_size: 5.0, area: 2589.0 },
  { id: 45, name: "Kisii", population: 1266326, male: 633163, female: 633163, households: 253265, hh_size: 5.0, area: 1318.0 },
  { id: 46, name: "Nyamira", population: 605576, male: 302788, female: 302788, households: 121115, hh_size: 5.0, area: 912.0 },
  { id: 47, name: "Vihiga", population: 590013, male: 295006, female: 295007, households: 118002, hh_size: 5.0, area: 531.0 },
];

// ============================================
// 2. WARNINGS
// ============================================

export const FALLBACK_WARNINGS = [
  {
    id: 1,
    county: "Turkana",
    subcounty: "Turkana North",
    hazard: "Flood",
    severity: "High",
    status: "Active",
    issued_at: "2026-08-03T10:00:00Z",
  },
  {
    id: 2,
    county: "Garissa",
    subcounty: "Garissa Township",
    hazard: "Drought",
    severity: "High",
    status: "Active",
    issued_at: "2026-08-02T14:30:00Z",
  },
  {
    id: 3,
    county: "Nairobi",
    subcounty: "Westlands",
    hazard: "Landslide",
    severity: "Medium",
    status: "Monitoring",
    issued_at: "2026-08-01T08:15:00Z",
  },
  {
    id: 4,
    county: "Mombasa",
    subcounty: "Kisauni",
    hazard: "Flood",
    severity: "High",
    status: "Active",
    issued_at: "2026-08-03T06:00:00Z",
  },
  {
    id: 5,
    county: "Kisumu",
    subcounty: "Kisumu Central",
    hazard: "Flood",
    severity: "Medium",
    status: "Monitoring",
    issued_at: "2026-08-02T16:00:00Z",
  },
  {
    id: 6,
    county: "Mandera",
    subcounty: "Mandera East",
    hazard: "Drought",
    severity: "High",
    status: "Active",
    issued_at: "2026-08-01T12:00:00Z",
  },
];

// ============================================
// 3. ASSETS
// ============================================

export const FALLBACK_ASSETS = [
  { id: 1, name: "Lodwar Hospital", type: "health", county: "Turkana", subcounty: "Turkana North", status: "Functional", capacity: 200, location: { latitude: 3.1, longitude: 35.5 } },
  { id: 2, name: "Kakuma Refugee Camp", type: "shelter", county: "Turkana", subcounty: "Turkana West", status: "Functional", capacity: 50000, location: { latitude: 3.8, longitude: 34.8 } },
  { id: 3, name: "Garissa Water Treatment", type: "water", county: "Garissa", subcounty: "Garissa Township", status: "Functional", capacity: 10000, location: { latitude: -0.5, longitude: 39.7 } },
  { id: 4, name: "Nairobi Emergency Center", type: "emergency", county: "Nairobi", subcounty: "Westlands", status: "Functional", capacity: 500, location: { latitude: -1.3, longitude: 36.8 } },
  { id: 5, name: "Mombasa Port Warehouse", type: "logistics", county: "Mombasa", subcounty: "Kisauni", status: "Functional", capacity: 5000, location: { latitude: -4.0, longitude: 39.7 } },
  { id: 6, name: "Kisumu Food Distribution", type: "food", county: "Kisumu", subcounty: "Kisumu Central", status: "At Risk", capacity: 2000, location: { latitude: -0.1, longitude: 34.8 } },
  { id: 7, name: "Mandera Mobile Clinic", type: "health", county: "Mandera", subcounty: "Mandera East", status: "Functional", capacity: 100, location: { latitude: 3.9, longitude: 41.8 } },
];

// ============================================
// 4. SUB-COUNTIES
// ============================================

export const FALLBACK_SUBCOUNTIES = [
  { id: 1, name: "Turkana North", county_id: 1, county: "Turkana", population: 125000, area: 8500.0 },
  { id: 2, name: "Turkana Central", county_id: 1, county: "Turkana", population: 185000, area: 4500.0 },
  { id: 3, name: "Turkana South", county_id: 1, county: "Turkana", population: 140000, area: 5200.0 },
  { id: 4, name: "Garissa Township", county_id: 12, county: "Garissa", population: 165000, area: 1200.0 },
  { id: 5, name: "Westlands", county_id: 2, county: "Nairobi", population: 320000, area: 85.0 },
  { id: 6, name: "Kisauni", county_id: 3, county: "Mombasa", population: 250000, area: 45.0 },
];

// ============================================
// 5. IGAD COUNTRIES
// ============================================

export const FALLBACK_IGAD_COUNTRIES = [
  { id: 1, name: "Ethiopia", population: 120000000, capital: "Addis Ababa", area: 1104300 },
  { id: 2, name: "Sudan", population: 45000000, capital: "Khartoum", area: 1861484 },
  { id: 3, name: "South Sudan", population: 11000000, capital: "Juba", area: 644329 },
  { id: 4, name: "Uganda", population: 45741000, capital: "Kampala", area: 241550 },
  { id: 5, name: "Somalia", population: 15893000, capital: "Mogadishu", area: 637657 },
  { id: 6, name: "Djibouti", population: 988000, capital: "Djibouti City", area: 23200 },
  { id: 7, name: "Kenya", population: 53771000, capital: "Nairobi", area: 580367 },
];

// ============================================
// 6. DASHBOARD STATS
// ============================================

export const FALLBACK_DASHBOARD_STATS = {
  total_counties: 47,
  total_subcounties: 290,
  total_wards: 1450,
  active_warnings: 6,
  total_assets: 7,
  at_risk_wards: 12,
  last_updated: "2026-08-03T10:00:00Z",
};

// ============================================
// 7. GEOJSON FOR COUNTIES (Fallback Geometry)
// ============================================

export const FALLBACK_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: 1,
      properties: { COUNTY_NAM: "Turkana", Total_Population19: 926976 },
      geometry: {
        type: "Polygon",
        coordinates: [[[34.5, 4.5], [36.0, 4.5], [36.0, 1.5], [34.5, 1.5], [34.5, 4.5]]]
      }
    },
    {
      type: "Feature",
      id: 2,
      properties: { COUNTY_NAM: "Nairobi", Total_Population19: 4397073 },
      geometry: {
        type: "Polygon",
        coordinates: [[[36.7, -1.4], [37.0, -1.4], [37.0, -1.1], [36.7, -1.1], [36.7, -1.4]]]
      }
    },
    {
      type: "Feature",
      id: 3,
      properties: { COUNTY_NAM: "Mombasa", Total_Population19: 1208333 },
      geometry: {
        type: "Polygon",
        coordinates: [[[39.5, -4.2], [39.8, -4.2], [39.8, -3.9], [39.5, -3.9], [39.5, -4.2]]]
      }
    },
    {
      type: "Feature",
      id: 4,
      properties: { COUNTY_NAM: "Kisumu", Total_Population19: 1155574 },
      geometry: {
        type: "Polygon",
        coordinates: [[[34.5, -0.2], [35.0, -0.2], [35.0, 0.2], [34.5, 0.2], [34.5, -0.2]]]
      }
    },
    {
      type: "Feature",
      id: 5,
      properties: { COUNTY_NAM: "Nakuru", Total_Population19: 2163202 },
      geometry: {
        type: "Polygon",
        coordinates: [[[35.8, -0.8], [36.2, -0.8], [36.2, -0.2], [35.8, -0.2], [35.8, -0.8]]]
      }
    },
    {
      type: "Feature",
      id: 6,
      properties: { COUNTY_NAM: "Garissa", Total_Population19: 841353 },
      geometry: {
        type: "Polygon",
        coordinates: [[[39.0, -1.0], [40.0, -1.0], [40.0, 0.5], [39.0, 0.5], [39.0, -1.0]]]
      }
    },
  ]
};

// ============================================
// 8. DECISION INTELLIGENCE RESPONSE
// ============================================

export const FALLBACK_DECISION_RESPONSE = {
  recommendations: [
    "Pre-position water treatment supplies in affected areas",
    "Run evacuation readiness drill in high-risk wards",
    "Issue early warning to communities along water bodies",
    "Coordinate with humanitarian partners for rapid response",
    "Activate emergency shelter protocols in displacement areas",
  ],
  riskLevel: "High",
  impactSummary: "Flood exposure rising in 3 wards. 2,500 households at risk. Water levels expected to peak in 48 hours.",
  simulation: {
    scenario: "Flood +50cm",
    affected_population: 15000,
    displaced: 2000,
  },
  allocations: {
    food: "500 tonnes",
    water: "10,000 litres",
    shelter: "2,000 tents",
  },
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  FALLBACK_COUNTIES,
  FALLBACK_WARNINGS,
  FALLBACK_ASSETS,
  FALLBACK_SUBCOUNTIES,
  FALLBACK_IGAD_COUNTRIES,
  FALLBACK_DASHBOARD_STATS,
  FALLBACK_GEOJSON,
  FALLBACK_DECISION_RESPONSE,
};