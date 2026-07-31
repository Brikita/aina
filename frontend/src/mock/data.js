// Mock data based on API contract

export const mockWarnings = [
  {
    id: 1,
    county: 'Garissa',
    hazard: 'Flood',
    severity: 'High',
    status: 'ACTIVE',
    issued_at: '2026-07-30T14:36:12Z',
  },
  {
    id: 2,
    county: 'Turkana',
    hazard: 'Drought',
    severity: 'Medium',
    status: 'ACTIVE',
    issued_at: '2026-07-29T09:12:44Z',
  },
  {
    id: 3,
    county: 'Marsabit',
    hazard: 'Drought',
    severity: 'High',
    status: 'ACTIVE',
    issued_at: '2026-07-28T16:20:00Z',
  },
];

export const mockAssets = [
  {
    id: 801,
    name: 'Garissa County Referral Hospital',
    type: 'HOSPITAL',
    county: 'GARISSA',
    capacity: 250,
    source: 'OpenStreetMap',
    location: { latitude: -0.4531, longitude: 39.6524 },
  },
  {
    id: 802,
    name: 'Garissa Primary School',
    type: 'SCHOOL',
    county: 'GARISSA',
    capacity: 900,
    source: 'OpenStreetMap',
    location: { latitude: -0.4612, longitude: 39.6611 },
  },
  {
    id: 803,
    name: 'Lodwar District Hospital',
    type: 'HOSPITAL',
    county: 'TURKANA',
    capacity: 180,
    source: 'OpenStreetMap',
    location: { latitude: 3.1196, longitude: 35.5977 },
  },
  {
    id: 804,
    name: 'Lodwar Primary School',
    type: 'SCHOOL',
    county: 'TURKANA',
    capacity: 600,
    source: 'OpenStreetMap',
    location: { latitude: 3.1124, longitude: 35.5899 },
  },
];

export const mockHazard = {
  county: 'Garissa',
  hazard: 'Flood',
  severity: 'High',
  risk_level: 'Extreme',
  affected_area: {
    type: 'Polygon',
    coordinates: [
      [
        [39.5, -0.6],
        [39.8, -0.6],
        [39.8, -0.2],
        [39.5, -0.2],
        [39.5, -0.6],
      ],
    ],
  },
};

export const mockImpact = {
  county: 'Garissa',
  hazard: 'Flood',
  severity: 'Extreme',
  summary: {
    total_assets: 376,
    asset_counts: {
      HOSPITAL: 23,
      SCHOOL: 353,
    },
  },
  critical_assets: [
    {
      id: 801,
      name: 'Garissa County Referral Hospital',
      type: 'HOSPITAL',
      county: 'GARISSA',
      capacity: 250,
      source: 'OpenStreetMap',
      location: { latitude: -0.4531, longitude: 39.6524 },
    },
    {
      id: 802,
      name: 'Garissa Primary School',
      type: 'SCHOOL',
      county: 'GARISSA',
      capacity: 900,
      source: 'OpenStreetMap',
      location: { latitude: -0.4612, longitude: 39.6611 },
    },
  ],
  exposure: {
    hospitals: 23,
    schools: 353,
    shelters: 0,
    bridges: 0,
    critical_assets: 376,
    exposure_score: 821,
  },
};

export const mockRecommendations = [
  {
    priority: 1,
    title: 'Immediate evacuation',
    description: 'Evacuate residents living along the Tana River within the next six hours.',
  },
  {
    priority: 2,
    title: 'Deploy emergency medical teams',
    description: 'Deploy ambulances and trauma teams to Garissa County Referral Hospital.',
  },
  {
    priority: 3,
    title: 'Open emergency shelters',
    description: 'Activate schools identified as emergency shelters.',
  },
];

export const mockSimulation = {
  status: 'Completed',
  estimated_people_affected: 38400,
  estimated_buildings_affected: 2700,
  estimated_roads_blocked: 21,
  estimated_crop_loss_percentage: 17,
  confidence: 0.92,
};

export const mockAllocations = {
  ambulances: 6,
  rescue_boats: 8,
  food_trucks: 12,
  medical_staff: 48,
  tents: 300,
  water_tanks: 15,
};

export const mockDashboardStats = {
  active_warnings: 8,
  high_risk_counties: 5,
  critical_assets: 842,
  people_at_risk: 185000,
  resources_deployed: 241,
};

export const mockAssetStats = {
  HOSPITAL: 534,
  SCHOOL: 12872,
  SHELTER: 348,
  BRIDGE: 427,
  WATER_POINT: 950,
};

export const mockHazardStats = {
  Flood: 12,
  Drought: 5,
  Landslide: 3,
};