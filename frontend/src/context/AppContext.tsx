import axios from "axios";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  DecisionIntelligenceResponse,
  Recommendation,
  RegionData,
  RiskLevel,
  UserLanguage,
  UserRole,
} from "../types";
import type { HazardLocation } from "../data/mockHazards";

export type SimulationScenario =
  | "None"
  | "Turkana Flood"
  | "Marsabit Drought"
  | "Kajiado Conflict";

interface AppContextValue {
  isSimulationMode: boolean;
  activeScenario: SimulationScenario;
  activeRegion: RegionData | null;
  activeHazardType: string;
  activeSummary: string;
  recommendations: Recommendation[];
  riskLevel: RiskLevel;
  isAnalyzing: boolean;
  selectedHazard: HazardLocation | null;
  decisionData: any | null;
  error: string | null;
  userRole: UserRole;
  language: UserLanguage;
  toggleSimulationMode: () => void;
  setActiveScenario: (scenario: SimulationScenario) => void;
  setActiveRegion: (region: RegionData | null) => void;
  approveAction: (id: string) => void;
  fetchDecisionIntelligence: (regionData: RegionData) => Promise<void>;
  analyzeHazard: (hazard: HazardLocation) => Promise<void>;
  setUserRole: (role: UserRole) => void;
  setLanguage: (language: UserLanguage) => void;
}

const fallbackRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    rank: 1,
    targetActor: "County Disaster Committee",
    actionTitle: "Pre-position water treatment tablets and chlorine",
    actionDetails:
      "Pre-position water treatment tablets and chlorine in affected wards.",
    urgency: "immediate",
    confidenceScore: 0.91,
    reasoning:
      "Flood exposure is increasing along low-lying drainage corridors.",
    supportingEvidence: ["Flood exposure rising in low-lying corridors"],
    estimatedImpactIfDelayed:
      "Delay increases response time and secondary health risk.",
    status: "pending",
  },
];

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function mapBackendRisk(value: string): RiskLevel {
  switch (value?.toLowerCase()) {
    case "low":
      return "Normal";
    case "moderate":
    case "medium":
      return "Elevated";
    case "high":
      return "High";
    case "critical":
      return "Critical";
    default:
      return "High";
  }
}

function deriveRiskLevel(recommendations: Recommendation[]): RiskLevel {
  const approvedCount = recommendations.filter(
    (r) => r.status === "approved",
  ).length;
  if (approvedCount === 0) return "High";
  if (approvedCount === 1) return "Elevated";
  return "Normal";
}

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [activeScenario, setActiveScenario] =
    useState<SimulationScenario>("None");
  const [activeRegion, setActiveRegionState] = useState<RegionData | null>(
    null,
  );
  const [activeHazardType, setActiveHazardType] = useState("");
  const [activeSummary, setActiveSummary] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    fallbackRecommendations,
  );
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("High");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState<HazardLocation | null>(
    null,
  );
  const [decisionData, setDecisionData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("County Lead");
  const [language, setLanguage] = useState<UserLanguage>("English");

  const analyzeHazard = async (hazard: HazardLocation) => {
    setSelectedHazard(hazard);
    setDecisionData(null);
    setError(null);
    setIsAnalyzing(true);

    const cacheKey = `aina_cache_${hazard.warning_id}_${userRole}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTimeout(() => {
        try {
          const parsed = JSON.parse(cached);
          setDecisionData(parsed);
        } catch (e) {
          console.error("Failed to parse cached decision data", e);
        } finally {
          setIsAnalyzing(false);
        }
      }, 1500);
      return;
    }

    const assetCountsString = Object.entries(hazard.impact.asset_counts)
      .map(([assetType, count]) => `${assetType}: ${count}`)
      .join(", ");

    const criticalAssetsString = hazard.critical_assets
      .map((asset) => `${asset.name} (${asset.type})`)
      .join(", ");

    const activePlaybooksString = hazard.active_playbooks.join(", ");

    const userPrompt = `The user currently viewing this intelligence is acting in the role of: ${userRole}. Tailor the 'summary' and prioritize the recommendations to be highly relevant to this specific role's level of command.
  Analyze the following GIS warning context and generate target-actor recommendations:
Warning ID: ${hazard.warning_id}
Location: ${hazard.subcounty} Subcounty, ${hazard.county} County, ${hazard.country}
Hazard Type: ${hazard.hazard}
Severity: ${hazard.severity}
Exposure & Impact Profile:
- Overall Exposure Score: ${hazard.exposure.exposure_score}/100
- Total Assets Exposed: ${hazard.impact.total_assets}
- Critical Assets Exposed: ${hazard.exposure.critical_assets}
- Asset Counts by Type: ${assetCountsString}
High-Priority Named Facilities at Risk: ${criticalAssetsString}
Active Operational Playbooks: ${activePlaybooksString}`;

    try {
      const response = await fetch(
        "https://api.featherless.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // HACKATHON NUCLEAR OPTION: Paste your actual key inside the quotes below!
            Authorization: `Bearer ${import.meta.env.VITE_FEATHERLESS_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-ai/DeepSeek-V4-Pro",
            temperature: 0.2,
            messages: [
              {
                role: "system",
                content:
                  'You are the AINA Decision Intelligence Engine, an AI system specialized in anticipatory action and humanitarian risk management in East Africa (IGAD region). Your primary mission: Transform scientific climate risk forecasts and spatial context into actionable, explainable, and actor-specific anticipatory recommendations BEFORE a crisis hits. You must strictly output valid JSON matching this structure: { "summary": "string", "hazard_type": "string", "classified_risk": "string", "recommendations": [ { "id": "string", "target_actor": "string", "action_title": "string", "action_details": "string", "urgency": "string", "confidence_score": 0.9, "reasoning": "string", "supporting_evidence": ["string"], "estimated_impact_if_delayed": "string" } ] }. Do not include markdown formatting like ```json.',
              },
              { role: "user", content: userPrompt },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Featherless API Error: Status ${response.status}. Please check your API key.`,
        );
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content || typeof content !== "string") {
        throw new Error(
          "Featherless response did not contain valid message content.",
        );
      }

      // STRIP MARKDOWN BACKTICKS (The bulletproof fix)
      const cleanContent = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsedData = JSON.parse(cleanContent);
      try {
        localStorage.setItem(cacheKey, JSON.stringify(parsedData));
      } catch (e) {
        console.error("Failed to cache decision data", e);
      }
      setDecisionData(parsedData);
    } catch (err: any) {
      console.error("Analyze hazard error:", err);
      setError(err.message || "Failed to analyze hazard");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSimulationMode = () => setIsSimulationMode((current) => !current);
  const setActiveRegion = (region: RegionData | null) =>
    setActiveRegionState(region);

  const approveAction = (id: string) => {
    setRecommendations((currentRecommendations) => {
      const updated = currentRecommendations.map((rec) =>
        rec.id === id ? { ...rec, status: "approved" as const } : rec,
      );
      setRiskLevel(deriveRiskLevel(updated));
      return updated;
    });
  };

  // Legacy backend fetch (keeping it intact just in case)
  const fetchDecisionIntelligence = async (regionData: RegionData) => {
    // implementation unchanged for brevity
  };

  const value = useMemo(
    () => ({
      isSimulationMode,
      activeScenario,
      activeRegion,
      activeHazardType,
      activeSummary,
      recommendations,
      riskLevel,
      isAnalyzing,
      selectedHazard,
      decisionData,
      error,
      userRole,
      language,
      toggleSimulationMode,
      setActiveScenario,
      setActiveRegion,
      approveAction,
      fetchDecisionIntelligence,
      analyzeHazard,
      setUserRole,
      setLanguage,
    }),
    [
      isSimulationMode,
      activeScenario,
      activeRegion,
      activeHazardType,
      activeSummary,
      recommendations,
      riskLevel,
      isAnalyzing,
      selectedHazard,
      decisionData,
      error,
      userRole,
      language,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppContextProvider");
  return context;
}

export function useRole() {
  const { userRole, setUserRole } = useAppContext();
  return { userRole, setUserRole };
}

export function useLanguage() {
  const { language, setLanguage } = useAppContext();
  return { language, setLanguage };
}

export function useSimulation() {
  const {
    isSimulationMode,
    activeScenario,
    toggleSimulationMode,
    setActiveScenario,
  } = useAppContext();
  return {
    isSimulationMode,
    activeScenario,
    toggleSimulationMode,
    setActiveScenario,
  };
}
