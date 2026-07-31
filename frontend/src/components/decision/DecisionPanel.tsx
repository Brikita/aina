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
  const { selectedHazard, isAnalyzing, decisionData } = useAppContext();
  const { userRole } = useRole();
  const { language } = useLanguage();

  const hasDecision = Boolean(decisionData);
  const hazardType = decisionData?.hazard_type || selectedHazard?.hazard || "";
  const summary = decisionData?.summary || "";
  const decisionRecommendations = decisionData?.recommendations ?? [];
  const activeRiskLevel = decisionData?.classified_risk
    ? mapBackendRisk(decisionData.classified_risk)
    : "Elevated";

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Decision Workflow
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          AINA Decision Intelligence
        </h2>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
          {hazardType || "Hazard classification pending"}
        </p>
        <div className="mt-3">
          <Badge variant={activeRiskLevel} />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {hasDecision
            ? riskSummary(activeRiskLevel)
            : selectedHazard
              ? "Review the hazard details and wait for AINA to finish the analysis."
              : "Select a hazard zone on the map to generate an AI-powered decision briefing."}
        </p>
        <p className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
          {selectedHazard
            ? summary ||
              `Selected hazard: ${selectedHazard.hazard} in ${selectedHazard.county}.`
            : "No hazard selected yet."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {!selectedHazard ? (
          <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
            <div className="max-w-xs">
              <p className="text-sm font-semibold text-slate-900">
                Click a hazard zone on the map to run AINA Decision
                Intelligence.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                The system will call the backend LLM endpoint and return
                actor-specific operational recommendations.
              </p>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-slate-900" />
            <p className="text-sm font-semibold text-slate-900">
              AINA Engine analyzing satellite data and active playbooks...
            </p>
          </div>
        ) : hasDecision ? (
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                Situation Summary
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{summary}</p>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Ranked Recommendations
              </h3>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                {decisionRecommendations.length} recommendations
              </span>
            </div>

            {decisionRecommendations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
                No recommendations were returned from the AINA engine.
              </div>
            ) : (
              decisionRecommendations.map((recommendation, index) => (
                <article
                  key={recommendation.id || index}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        {recommendation.target_actor}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        {recommendation.action_title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {recommendation.action_details}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-sm text-slate-600 sm:items-end">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
                        {recommendation.urgency.replace("_", " ")}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                        Confidence{" "}
                        {Math.round(recommendation.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Reasoning
                      </p>
                      <p className="mt-2">{recommendation.reasoning}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Supporting Evidence
                      </p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {recommendation.supporting_evidence.map((item) => (
                          <li key={item} className="list-disc pl-4">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
            Decision data is not yet available. Click a hazard to start
            analysis.
          </div>
        )}
      </div>
    </aside>
  );
}
