import { ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAppContext, useLanguage, useRole } from "../../context/AppContext";
import type { Recommendation } from "../../types";
import { Button } from "../ui/Button";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const { approveAction } = useAppContext();
  const { userRole } = useRole();
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const isApproved = recommendation.status === "approved";

  const translatedAction =
    language === "Swahili"
      ? recommendation.action
          .replace(
            "Pre-position water treatment tablets and chlorine",
            "Weka vidonge vya kutibu maji na klorini mapema",
          )
          .replace(
            "Run door-to-door evacuation readiness checks",
            "Fanya ukaguzi wa utayari wa uhamishaji nyumba kwa nyumba",
          )
          .replace(
            "Issue a verified early warning message",
            "Toa ujumbe uliothibitishwa wa tahadhari ya mapema",
          )
      : recommendation.action;

  const translatedReasoning =
    language === "Swahili"
      ? recommendation.reasoning
          .replace("Flood exposure", "Hatari ya mafuriko")
          .replace("Message reach", "Ufikaji wa ujumbe")
      : recommendation.reasoning;

  const supportingLabel =
    language === "Swahili" ? "Muktadha wa Uamuzi" : "Reasoning / Context";

  const rankLabel =
    language === "Swahili"
      ? `NGAZI ${recommendation.rank}`
      : `RANK ${recommendation.rank}`;

  const actorLabel =
    userRole === "National Director" && recommendation.rank === 1
      ? language === "Swahili"
        ? "Mkurugenzi wa Kitaifa"
        : recommendation.actor
      : recommendation.actor;

  return (
    <article
      className={[
        "mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all",
        isApproved ? "border-emerald-200 bg-emerald-50/70" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            {rankLabel}
          </div>
          <h3 className="mt-3 text-base font-bold text-slate-900">
            {actorLabel}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {translatedAction}
          </p>
        </div>

        {isApproved ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={14} />
            Approved
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="mt-4 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <span>{supportingLabel}</span>
        <ChevronDown
          className={[
            "h-4 w-4 transition-transform",
            isExpanded ? "rotate-180" : "rotate-0",
          ].join(" ")}
        />
      </button>

      {isExpanded ? (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
          {translatedReasoning}
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
