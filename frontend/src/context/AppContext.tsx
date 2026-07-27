import axios from "axios";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Recommendation, RegionData, RiskLevel } from "../types";

interface AppContextValue {
  isSimulationMode: boolean;
  activeRegion: RegionData | null;
  recommendations: Recommendation[];
  riskLevel: RiskLevel;
  isAnalyzing: boolean;
  toggleSimulationMode: () => void;
  setActiveRegion: (region: RegionData | null) => void;
  approveAction: (id: string) => void;
  fetchDecisionIntelligence: (regionData: RegionData) => Promise<void>;
}

interface DecisionIntelligenceResponse {
  recommendations?: Recommendation[];
  riskLevel?: RiskLevel;
}

const fallbackRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    rank: 1,
    actor: "County Disaster Committee",
    action:
      "Pre-position water treatment tablets and chlorine in Kajiado East wards.",
    reasoning:
      "Flood exposure is increasing along low-lying drainage corridors, and drinking-water contamination typically follows quickly after standing water accumulates. Pre-positioning supplies now reduces response delay and lowers secondary health risk.",
    status: "pending",
  },
  {
    id: "rec-2",
    rank: 2,
    actor: "Ward-Level CHVs",
    action:
      "Run door-to-door evacuation readiness checks for households in flood-prone riparian zones.",
    reasoning:
      "The highest operational friction comes from mobility constraints and last-mile access. A targeted readiness sweep surfaces vulnerable households before routes degrade further.",
    status: "pending",
  },
  {
    id: "rec-3",
    rank: 3,
    actor: "County Communications Team",
    action:
      "Issue a verified early warning message through SMS, radio, and chief baraza channels.",
    reasoning:
      "Message reach is the fastest force multiplier in anticipatory response. A synchronized warning keeps guidance simple, trusted, and actionable across channels.",
    status: "pending",
  },
];

const AppContext = createContext<AppContextValue | undefined>(undefined);

function deriveRiskLevel(recommendations: Recommendation[]): RiskLevel {
  const approvedCount = recommendations.filter(
    (recommendation) => recommendation.status === "approved",
  ).length;
  if (approvedCount === 0) {
    return "High";
  }
  if (approvedCount === 1) {
    return "Elevated";
  }
  return "Normal";
}

function normalizeRecommendations(
  input: Recommendation[] | undefined,
): Recommendation[] {
  if (!input || input.length === 0) {
    return fallbackRecommendations;
  }

  return input.map((recommendation, index) => ({
    id: recommendation.id,
    rank: recommendation.rank ?? index + 1,
    actor: recommendation.actor,
    action: recommendation.action,
    reasoning: recommendation.reasoning,
    status: recommendation.status,
  }));
}

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [activeRegion, setActiveRegionState] = useState<RegionData | null>(
    null,
  );
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    fallbackRecommendations,
  );
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("High");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleSimulationMode = () => {
    setIsSimulationMode((current) => !current);
  };

  const setActiveRegion = (region: RegionData | null) => {
    setActiveRegionState(region);
  };

  const approveAction = (id: string) => {
    setRecommendations((currentRecommendations) => {
      const updatedRecommendations = currentRecommendations.map(
        (recommendation) =>
          recommendation.id === id
            ? { ...recommendation, status: "approved" as const }
            : recommendation,
      );

      setRiskLevel(deriveRiskLevel(updatedRecommendations));
      return updatedRecommendations;
    });
  };

  const fetchDecisionIntelligence = async (regionData: RegionData) => {
    setActiveRegionState(regionData);
    setIsAnalyzing(true);

    try {
      const response = await axios.post<DecisionIntelligenceResponse>(
        "/api/generate-decision",
        regionData,
      );
      const nextRecommendations = normalizeRecommendations(
        response.data.recommendations,
      );
      setRecommendations(nextRecommendations);
      setRiskLevel(
        response.data.riskLevel ?? deriveRiskLevel(nextRecommendations),
      );
    } catch {
      const nextRecommendations = fallbackRecommendations.map(
        (recommendation) => ({
          ...recommendation,
          status: "pending" as const,
        }),
      );
      setRecommendations(nextRecommendations);
      setRiskLevel(regionData.severity);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const value = useMemo(
    () => ({
      isSimulationMode,
      activeRegion,
      recommendations,
      riskLevel,
      isAnalyzing,
      toggleSimulationMode,
      setActiveRegion,
      approveAction,
      fetchDecisionIntelligence,
    }),
    [activeRegion, isAnalyzing, isSimulationMode, recommendations, riskLevel],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
}
