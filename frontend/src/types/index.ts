export interface Recommendation {
  id: string;
  rank: number;
  actor: string;
  action: string;
  reasoning: string;
  status: "pending" | "approved" | "rejected";
}

export type RiskLevel = "Normal" | "Elevated" | "High" | "Critical";

export interface RegionData {
  id: string;
  name: string;
  hazardType: string;
  severity: RiskLevel;
  context: string;
}
