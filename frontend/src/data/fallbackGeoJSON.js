// ============================================
// AINA v5.0 — Fallback GeoJSON Data
// Used when backend API is unavailable
// ============================================

export const FALLBACK_WARDS = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: 1,
      properties: {
        name: "Turkana North",
        population: 125000,
        risk_level: 4,
        ndvi_anomaly: -0.41,
        failing_water_points: 3,
        total_water_points: 4,
        conflict_events_30d: 5
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [34.5, 4.5], [36.0, 4.5], [36.0, 5.5], [34.5, 5.5], [34.5, 4.5]
        ]]
      }
    },
    {
      type: "Feature",
      id: 2,
      properties: {
        name: "Turkana Central",
        population: 185000,
        risk_level: 2,
        ndvi_anomaly: -0.28,
        failing_water_points: 2,
        total_water_points: 5,
        conflict_events_30d: 3
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [35.0, 3.0], [36.0, 3.0], [36.0, 4.5], [35.0, 4.5], [35.0, 3.0]
        ]]
      }
    },
    {
      type: "Feature",
      id: 3,
      properties: {
        name: "Turkana South",
        population: 140000,
        risk_level: 1,
        ndvi_anomaly: -0.15,
        failing_water_points: 1,
        total_water_points: 3,
        conflict_events_30d: 1
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [35.0, 1.5], [36.0, 1.5], [36.0, 3.0], [35.0, 3.0], [35.0, 1.5]
        ]]
      }
    },
    {
      type: "Feature",
      id: 4,
      properties: {
        name: "Turkana East",
        population: 95000,
        risk_level: 3,
        ndvi_anomaly: -0.35,
        failing_water_points: 3,
        total_water_points: 4,
        conflict_events_30d: 4
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [36.0, 2.0], [36.5, 2.0], [36.5, 4.5], [36.0, 4.5], [36.0, 2.0]
        ]]
      }
    },
    {
      type: "Feature",
      id: 5,
      properties: {
        name: "Turkana West",
        population: 110000,
        risk_level: 2,
        ndvi_anomaly: -0.22,
        failing_water_points: 2,
        total_water_points: 4,
        conflict_events_30d: 2
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [34.5, 2.0], [35.0, 2.0], [35.0, 4.5], [34.5, 4.5], [34.5, 2.0]
        ]]
      }
    },
    {
      type: "Feature",
      id: 6,
      properties: {
        name: "Loima",
        population: 85000,
        risk_level: 1,
        ndvi_anomaly: -0.18,
        failing_water_points: 1,
        total_water_points: 2,
        conflict_events_30d: 1
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [35.0, 2.0], [35.8, 2.0], [35.8, 3.0], [35.0, 3.0], [35.0, 2.0]
        ]]
      }
    }
  ]
};

export const RISK_COLORS = {
  1: { fill: '#4CAF50', stroke: '#388E3C', label: 'Watch' },
  2: { fill: '#FFC107', stroke: '#FFA000', label: 'Alert' },
  3: { fill: '#FF9800', stroke: '#F57C00', label: 'Warning' },
  4: { fill: '#F44336', stroke: '#D32F2F', label: 'Emergency' }
};

export const FALLBACK_WATER_POINTS = [
  { id: 1, name: "Nakururum Borehole", lat: 4.8, lon: 35.2, capacity: 85, status: "functional", type: "borehole" },
  { id: 2, name: "Kibish Pan", lat: 5.0, lon: 35.5, capacity: 25, status: "at_risk", type: "pan" },
  { id: 3, name: "Lodwar Central", lat: 3.1, lon: 35.5, capacity: 90, status: "functional", type: "borehole" },
  { id: 4, name: "Kakuma Borehole", lat: 3.8, lon: 34.8, capacity: 80, status: "functional", type: "borehole" },
  { id: 5, name: "Lokori Borehole", lat: 2.5, lon: 36.2, capacity: 35, status: "at_risk", type: "borehole" },
  { id: 6, name: "Kapedo Pan", lat: 2.2, lon: 36.3, capacity: 5, status: "failed", type: "pan" },
  { id: 7, name: "Napusmoru Dam", lat: 3.5, lon: 35.8, capacity: 40, status: "at_risk", type: "dam" },
  { id: 8, name: "Lokitaung Well", lat: 4.7, lon: 35.6, capacity: 15, status: "at_risk", type: "well" },
];

export const FALLBACK_CONFLICTS = [
  { id: 1, title: "Cattle raid near Kibish", lat: 5.1, lon: 35.3, date: "2026-07-15", fatalities: 2, type: "cattle_raiding" },
  { id: 2, title: "Water dispute at Lokitaung", lat: 4.5, lon: 35.8, date: "2026-07-10", fatalities: 1, type: "resource_conflict" },
  { id: 3, title: "Cross-border incident", lat: 4.8, lon: 34.7, date: "2026-06-28", fatalities: 3, type: "border_dispute" },
  { id: 4, title: "Grazing dispute near Kakuma", lat: 3.9, lon: 34.6, date: "2026-07-20", fatalities: 0, type: "resource_conflict" },
  { id: 5, title: "Livestock theft at Lokichar", lat: 2.8, lon: 35.7, date: "2026-07-05", fatalities: 1, type: "cattle_raiding" },
];

export const FALLBACK_MARKETS = [
  { id: 1, name: "Lodwar Market", lat: 3.1, lon: 35.5, cattle_price: 8500, goat_price: 4500, day: "Friday" },
  { id: 2, name: "Kakuma Market", lat: 3.8, lon: 34.8, cattle_price: 7800, goat_price: 4200, day: "Tuesday" },
  { id: 3, name: "Lokichoggio Market", lat: 4.2, lon: 34.5, cattle_price: 7200, goat_price: 4000, day: "Thursday" },
];

export const FALLBACK_CORRIDORS = [
  { 
    id: 1, name: "Kibish Corridor", 
    coords: [[5.0, 34.8], [4.5, 35.2], [4.0, 35.5]], 
    status: "open", risk: "medium" 
  },
  { 
    id: 2, name: "Lodwar Central", 
    coords: [[3.5, 35.0], [3.2, 35.2], [3.1, 35.5], [3.0, 35.8]], 
    status: "open", risk: "low" 
  },
  { 
    id: 3, name: "Kerio Valley", 
    coords: [[2.5, 35.8], [2.0, 36.0], [1.8, 36.2]], 
    status: "restricted", risk: "high" 
  },
  { 
    id: 4, name: "Lake Turkana West", 
    coords: [[2.5, 35.0], [3.0, 35.0], [3.5, 35.0], [4.0, 35.0]], 
    status: "open", risk: "low" 
  },
  { 
    id: 5, name: "Southern Route", 
    coords: [[2.0, 35.5], [1.8, 35.8], [1.6, 36.0]], 
    status: "open", risk: "medium" 
  },
];