import { AlertTriangle, Loader2 } from "lucide-react";
import { useAppContext, useLanguage, useRole } from "../../context/AppContext";
import { Badge } from "../ui/Badge";
import { RecommendationCard } from "./RecommendationCard";

function riskSummary(riskLevel: string) {
  switch (riskLevel) {
    case "Critical":
      return "Immediate operational escalation is required. Multiple response actors should move in parallel.";
    case "High":
      return "The hazard signal is strong and time-sensitive. Prepare intervention actions now.";
    case "Elevated":
      return "Conditions warrant close monitoring and rapid readiness checks.";
    default:
      return "The situation is stable, but active monitoring should continue.";
  }
}

function titleCopy(language: string) {
  return language === "Swahili" ? "Hatari ya Drought" : "Drought Risk";
}

function hazardSummary(language: string, hazardType: string, summary: string) {
  if (language === "Swahili") {
    return (
      summary ||
      `Ufuatiliaji wa ${hazardType || "hatari"} unaonyesha tishio la kioperesheni.`
    );
  }

  return (
    summary ||
    `Operational monitoring indicates an active ${hazardType || "hazard"}.`
  );
}

function roleCopy(role: string, confidence: string) {
  if (role === "National Director") {
    return confidence;
  }

  if (role === "County Lead") {
    return "Actionable Logistics: Pre-position water trucks";
  }

  return "Field movement tracked and ready for escalation";
}

export function DecisionPanel() {
  const {
    recommendations,
    riskLevel,
    isAnalyzing,
    activeHazardType,
    activeSummary,
  } = useAppContext();
  const { userRole } = useRole();
  const { language } = useLanguage();

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Decision Workflow
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          {titleCopy(language)}
        </h2>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
          {activeHazardType || "Hazard classification pending"}
        </p>
        <div className="mt-3">
          <Badge variant={riskLevel} />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {riskSummary(riskLevel)}
        </p>
        <p className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
          {roleCopy(userRole, "Ensemble Confidence 84%")}
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p>{hazardSummary(language, activeHazardType, activeSummary)}</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Ranked Recommendations
          </h3>
          {isAnalyzing ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Analyzing
            </span>
          ) : null}
        </div>

        <div className="pb-4">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
