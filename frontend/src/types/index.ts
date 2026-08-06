export interface Recommendation {
  id: string;
  rank: number;
  targetActor: string;
  actionTitle: string;
  actionDetails: string;
  urgency: "immediate" | "near_term" | "watch";
  confidenceScore: number;
  reasoning: string;
  supportingEvidence: string[];
  estimatedImpactIfDelayed: string;
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

export interface DecisionIntelligenceResponse {
  summary: string;
  hazard_type: string;
  classified_risk: "low" | "medium" | "high" | "critical";
  recommendations: Array<{
    id: string;
    target_actor: string;
    action_title: string;
    action_details: string;
    urgency: "immediate" | "near_term" | "watch";
    confidence_score: number;
    reasoning: string;
    supporting_evidence: string[];
    estimated_impact_if_delayed: string;
  }>;
}
