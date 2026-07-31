import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";

type OutcomeTone = "success" | "warning" | "neutral";

interface ObservatoryMetric {
  label: string;
  value: string;
  icon: typeof Clock3;
}

interface ObservatoryRecord {
  date: string;
  hazardLocation: string;
  recommendation: string;
  actionTaken: string;
  outcome: string;
  tone: OutcomeTone;
}

const metrics: ObservatoryMetric[] = [
  { label: "Total Decisions Logged", value: "142", icon: CalendarDays },
  { label: "Avg Response Time", value: "4.2 Days", icon: Clock3 },
  { label: "Intervention Success Rate", value: "87%", icon: TrendingUp },
];

const records: ObservatoryRecord[] = [
  {
    date: "2026-06-28",
    hazardLocation: "Flash Flood - Kajiado",
    recommendation: "Deploy Water Trucks",
    actionTaken: "Approved & Deployed",
    outcome: "Success - 12,000 reached",
    tone: "success",
  },
  {
    date: "2026-06-19",
    hazardLocation: "Drought - Marsabit",
    recommendation: "Expand Livestock Water Points",
    actionTaken: "Partially Executed",
    outcome: "Success - Herd losses reduced",
    tone: "success",
  },
  {
    date: "2026-06-11",
    hazardLocation: "Flash Flood - Tana River",
    recommendation: "Activate Shelter Network",
    actionTaken: "Delayed by Logistics",
    outcome: "Delayed - Logistics failure",
    tone: "warning",
  },
  {
    date: "2026-05-30",
    hazardLocation: "Drought - Turkana",
    recommendation: "Issue Water Rationing Guidance",
    actionTaken: "Approved & Broadcast",
    outcome: "Success - Compliance increased",
    tone: "success",
  },
  {
    date: "2026-05-21",
    hazardLocation: "Flash Flood - Garissa",
    recommendation: "Pre-position Rescue Boats",
    actionTaken: "Escalated for Review",
    outcome: "Neutral - Monitoring sustained",
    tone: "neutral",
  },
];

function toneStyles(tone: OutcomeTone) {
  switch (tone) {
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function Observatory() {
  return (
    <section className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto pr-1">
      <header className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Institutional Memory
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Decision Observatory & Outcomes
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            This log captures the recommendations AINA surfaced, the human
            actions taken in response, and the resulting operational outcome so
            future decisions can improve with evidence.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {metric.value}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-slate-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-900 text-slate-100">
              <tr>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">
                  Date
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">
                  Hazard & Location
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">
                  AI Recommendation
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">
                  Human Action Taken
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.18em]">
                  Outcome / Evaluation
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={`${record.date}-${record.hazardLocation}`}
                  className="border-t border-slate-200 even:bg-slate-50"
                >
                  <td className="px-5 py-4 font-medium text-slate-700">
                    {record.date}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {record.hazardLocation}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {record.recommendation}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {record.actionTaken}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                        toneStyles(record.tone),
                      ].join(" ")}
                    >
                      {record.tone === "success" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : record.tone === "warning" ? (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      ) : null}
                      {record.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
