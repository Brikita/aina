export interface Recommendation {
  id: string;
  rank: number;
  actor: string;
  action: string;
  reasoning: string;
  status: "pending" | "approved" | "rejected";
}

export type RiskLevel = "Normal" | "Elevated" | "High" | "Critical";

export type UserRole = "National Director" | "County Lead" | "Field Officer";

export type UserLanguage = "English" | "Swahili";

export interface RegionData {
  id: string;
  name: string;
  hazardType: string;
  severity: RiskLevel;
  context: string;
}
