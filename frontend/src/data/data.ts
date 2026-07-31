export interface HazardLocation {
  warning_id: number;
  county: string;
  subcounty: string;
  country: string;
  coordinates: { lat: number; lng: number };
  hazard: string;
  severity: string;
  impact: {
    total_assets: number;
    asset_counts: Record<string, number>;
  };
  exposure: {
    exposure_score: number;
    critical_assets: number;
  };
  critical_assets: Array<{ name: string; type: string }>;
  active_playbooks: string[];
}

export const MOCK_HAZARD_DATA: Record<string, HazardLocation> = {
  // 1. Pastoralist Drought - Turkana, Kenya
  "KE-TUR-01": {
    warning_id: 101,
    county: "Turkana",
    subcounty: "Loima",
    country: "Kenya",
    coordinates: { lat: 3.1166, lng: 35.6 },
    hazard: "Drought",
    severity: "Critical",
    impact: {
      total_assets: 150,
      asset_counts: { BOREHOLE: 45, LIVESTOCK_MARKET: 5, SCHOOL: 100 },
    },
    exposure: { exposure_score: 95, critical_assets: 50 },
    critical_assets: [
      { name: "Lorugum Livestock Market", type: "MARKET" },
      { name: "Namoruputh Community Borehole", type: "BOREHOLE" },
    ],
    active_playbooks: ["PB-DROUGHT-LIVESTOCK-V1", "PB-WASH-EMERGENCY"],
  },

  // 2. Flood & Displacement - Jonglei, South Sudan
  "SS-JON-02": {
    warning_id: 102,
    county: "Jonglei",
    subcounty: "Bor South",
    country: "South Sudan",
    coordinates: { lat: 6.2089, lng: 31.5547 },
    hazard: "Flood",
    severity: "High",
    impact: {
      total_assets: 85,
      asset_counts: { HOSPITAL: 2, ROAD_SEGMENT: 15, SCHOOL: 68 },
    },
    exposure: { exposure_score: 88, critical_assets: 17 },
    critical_assets: [
      { name: "Bor State Hospital", type: "HOSPITAL" },
      { name: "Juba-Bor Primary Road", type: "ROAD_SEGMENT" },
    ],
    active_playbooks: ["PB-FLOOD-EVACUATION-V2"],
  },

  // 3. Agricultural Drought - Somali Region, Ethiopia
  "ET-SOM-03": {
    warning_id: 103,
    county: "Somali",
    subcounty: "Gode",
    country: "Ethiopia",
    coordinates: { lat: 5.95, lng: 43.55 },
    hazard: "Drought",
    severity: "High",
    impact: {
      total_assets: 210,
      asset_counts: { IRRIGATION_CANAL: 12, GRAIN_STORE: 8, VILLAGE: 190 },
    },
    exposure: { exposure_score: 75, critical_assets: 20 },
    critical_assets: [
      { name: "Gode Central Grain Reserve", type: "GRAIN_STORE" },
      { name: "Wabe Shebelle Irrigation Intake", type: "IRRIGATION_CANAL" },
    ],
    active_playbooks: ["PB-DROUGHT-AGRI-V1"],
  },

  // 4. Urban Flash Flood - Djibouti City, Djibouti
  "DJ-DJI-04": {
    warning_id: 104,
    county: "Djibouti Region",
    subcounty: "Balbala",
    country: "Djibouti",
    coordinates: { lat: 11.589, lng: 43.145 },
    hazard: "Flood",
    severity: "Moderate",
    impact: {
      total_assets: 340,
      asset_counts: { POWER_SUBSTATION: 3, CLINIC: 12, URBAN_BLOCK: 325 },
    },
    exposure: { exposure_score: 65, critical_assets: 15 },
    critical_assets: [
      { name: "Balbala Main Substation", type: "POWER_SUBSTATION" },
      { name: "Cheikh Osman Clinic", type: "CLINIC" },
    ],
    active_playbooks: ["PB-URBAN-FLOOD-V1"],
  },
};
