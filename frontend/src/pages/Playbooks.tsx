import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Layers3,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface PlaybookCard {
  title: string;
  status: "Active" | "Under Review";
  description: string;
  triggered: string;
  updated: string;
  owner: string;
}

const playbooks: PlaybookCard[] = [
  {
    title: "Turkana Flood Response",
    status: "Active",
    description:
      "Defines escalation, shelter activation, and WASH coordination for flash flood corridors around the lower basin. The protocol is tuned for rapid inter-agency handoff when river levels rise without warning.",
    triggered: "Triggered 14 times",
    updated: "Last updated: June 2026",
    owner: "County Disaster Unit",
  },
  {
    title: "Marsabit Drought Protocol",
    status: "Active",
    description:
      "Captures water trucking thresholds, livestock protection steps, and health outreach guidance during prolonged dry spells. It helps the AI prioritize actions that preserve both household resilience and pastoral assets.",
    triggered: "Triggered 9 times",
    updated: "Last updated: May 2026",
    owner: "Resilience Coordination Desk",
  },
  {
    title: "Kajiado Flash Flood SOP",
    status: "Under Review",
    description:
      "Formalizes alert routing, road closure verification, and evacuations for high-velocity flood events across low-lying settlements. The review cycle is validating whether new settlement data should adjust the trigger thresholds.",
    triggered: "Triggered 21 times",
    updated: "Last updated: July 2026",
    owner: "Emergency Operations Center",
  },
  {
    title: "Tana Basin Evacuation Protocol",
    status: "Active",
    description:
      "Orchestrates community messaging, transport allocation, and reception site readiness when the basin enters elevated flood watch. The playbook emphasizes early mobilization to prevent late-stage congestion and confusion.",
    triggered: "Triggered 6 times",
    updated: "Last updated: April 2026",
    owner: "Humanitarian Liaison Team",
  },
];

function statusStyles(status: PlaybookCard["status"]) {
  return status === "Active"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-amber-50 text-amber-700 border-amber-200";
}

export function Playbooks() {
  return (
    <section className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto pr-1">
      <header className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              <BookOpen className="h-3.5 w-3.5 text-cyan-600" />
              Operational Library
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Response Playbooks & Protocols
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              AINA references these standard operating procedures when
              synthesizing recommendations. Each playbook encodes the
              institutional logic behind hazard-specific response decisions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <div className="flex items-center gap-2 text-slate-900">
              <Sparkles className="h-4 w-4 text-cyan-600" />
              Protocol coverage
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              4 active SOPs
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Decision intelligence ready
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        {playbooks.map((playbook) => (
          <article
            key={playbook.title}
            className="rounded-3xl border border-slate-300 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <Layers3 className="h-4 w-4 text-slate-400" />
                  {playbook.owner}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">
                  {playbook.title}
                </h2>
              </div>

              <span
                className={[
                  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                  statusStyles(playbook.status),
                ].join(" ")}
              >
                {playbook.status === "Active" ? (
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                ) : (
                  <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
                )}
                {playbook.status}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {playbook.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Usage
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {playbook.triggered}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Updated
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {playbook.updated}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ArrowUpRight className="h-4 w-4 text-cyan-600" />
                Reference protocol
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View Protocol
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
