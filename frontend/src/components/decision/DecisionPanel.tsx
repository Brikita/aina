import { Loader2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
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

export function DecisionPanel() {
  const { recommendations, riskLevel, isAnalyzing } = useAppContext();

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Decision Workflow
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Risk Classification
        </h2>
        <div className="mt-3">
          <Badge variant={riskLevel} />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {riskSummary(riskLevel)}
        </p>
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
