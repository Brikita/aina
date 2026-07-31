import { CheckCircle2, ChevronDown, Gauge, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useAppContext, useLanguage, useRole } from "../../context/AppContext";
import type { Recommendation } from "../../types";
import { Button } from "../ui/Button";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

function urgencyTone(urgency: Recommendation["urgency"]) {
  switch (urgency) {
    case "immediate":
      return "bg-red-500/15 text-red-200 ring-1 ring-red-500/30";
    case "near_term":
      return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30";
    default:
      return "bg-slate-500/15 text-slate-200 ring-1 ring-slate-500/30";
  }
}

function formatConfidence(confidenceScore: number) {
  return `${Math.round(confidenceScore * 100)}%`;
}

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const { approveAction } = useAppContext();
  const { userRole } = useRole();
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const isApproved = recommendation.status === "approved";

  const titleLabel =
    language === "Swahili"
      ? "Utekelezaji wa Hatua"
      : recommendation.actionTitle;
  const actorLabel =
    userRole === "National Director" && recommendation.rank === 1
      ? language === "Swahili"
        ? "Mkurugenzi wa Kitaifa"
        : recommendation.targetActor
      : recommendation.targetActor;

  return (
    <article
      className={[
        "mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all",
        isApproved ? "border-emerald-200 bg-emerald-50/70" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            RANK {recommendation.rank}
          </div>
          <h3 className="mt-3 text-base font-bold text-slate-900">
            {actorLabel}
          </h3>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {titleLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {recommendation.actionDetails}
          </p>
        </div>

        {isApproved ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approved
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={[
            "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
            urgencyTone(recommendation.urgency),
          ].join(" ")}
        >
          {recommendation.urgency.replace("_", " ")}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
          <Gauge className="h-3.5 w-3.5" />
          Confidence {formatConfidence(recommendation.confidenceScore)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="mt-4 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <span>
          {language === "Swahili"
            ? "Muktadha na Ushahidi"
            : "Reasoning / Evidence"}
        </span>
        <ChevronDown
          className={[
            "h-4 w-4 transition-transform",
            isExpanded ? "rotate-180" : "rotate-0",
          ].join(" ")}
        />
      </button>

      {isExpanded ? (
        <div className="mt-3 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <p>{recommendation.reasoning}</p>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Supporting Evidence
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {recommendation.supportingEvidence.map((evidence) => (
                <li key={evidence} className="flex items-start gap-2">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span>{evidence}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Estimated Impact If Delayed
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {recommendation.estimatedImpactIfDelayed}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Status: {recommendation.status}
        </span>
        <Button
          variant={isApproved ? "secondary" : "primary"}
          onClick={() => approveAction(recommendation.id)}
          disabled={isApproved}
        >
          {isApproved ? "Approved" : "Approve Action"}
        </Button>
      </div>
    </article>
  );
}
