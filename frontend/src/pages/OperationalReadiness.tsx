interface ProgressItem {
  label: string;
  value: string;
  percent: number;
  tone: "emerald" | "rose" | "amber";
}

interface AssetItem {
  label: string;
  value: string;
}

interface PartnerItem {
  name: string;
  status: string;
  tone: "emerald" | "amber";
  detail: string;
}

const financialReadiness: ProgressItem[] = [
  {
    label: "Kajiado County Emergency Fund",
    value: "85% Allocated",
    percent: 85,
    tone: "emerald",
  },
  {
    label: "Turkana Flood Response Budget",
    value: "20% Remaining",
    percent: 20,
    tone: "rose",
  },
];

const logisticsAssets: AssetItem[] = [
  {
    label: "Water Truck Fleet - Garissa",
    value: "4/10 Active",
  },
  {
    label: "High-Clearance Vehicles",
    value: "12/15 Available",
  },
  {
    label: "Mobile Water Treatment Units",
    value: "6/8 Deployed Ready",
  },
  {
    label: "Fuel Reserve Coverage",
    value: "72 Hours",
  },
];

const partnerStatus: PartnerItem[] = [
  {
    name: "Kenya Red Cross",
    status: "Standby",
    tone: "emerald",
    detail: "Green",
  },
  {
    name: "WFP Logistics Cluster",
    status: "Mobilizing",
    tone: "amber",
    detail: "Yellow",
  },
  {
    name: "Local Field Officers Online",
    status: "144",
    tone: "emerald",
    detail: "Green",
  },
];

function progressToneClasses(tone: ProgressItem["tone"]) {
  switch (tone) {
    case "emerald":
      return "bg-emerald-500";
    case "rose":
      return "bg-rose-500";
    case "amber":
      return "bg-amber-500";
    default:
      return "bg-slate-500";
  }
}

function pillToneClasses(tone: PartnerItem["tone"]) {
  switch (tone) {
    case "emerald":
      return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30";
    case "amber":
      return "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30";
  }
}

export function OperationalReadiness() {
  return (
    <section className="min-h-0 rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-xl">
      <header className="border-b border-slate-800 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          Operations Console
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Operational Readiness & Logistics
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Mock readiness data gives the decision team a quick view of funding,
          fleet capacity, and partner mobilization before a hazard escalates
          into action.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-white">
            Financial Readiness
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Mock contingency funds and allocation pressure.
          </p>

          <div className="mt-5 space-y-5">
            {financialReadiness.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-200">
                    {item.label}
                  </span>
                  <span className="text-slate-400">{item.value}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${progressToneClasses(item.tone)}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-white">
            Logistics & Fleet Asset Status
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Physical assets available for rapid deployment.
          </p>

          <div className="mt-5 space-y-4">
            {logisticsAssets.map((asset) => (
              <div
                key={asset.label}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-200">
                  {asset.label}
                </span>
                <span className="text-sm font-semibold text-white">
                  {asset.value}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-white">
            Partner & Personnel Status
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Organizations and field staff currently in posture.
          </p>

          <div className="mt-5 space-y-4">
            {partnerStatus.map((partner) => (
              <div
                key={partner.name}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      {partner.name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                      {partner.detail}
                    </p>
                  </div>
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                      pillToneClasses(partner.tone),
                    ].join(" ")}
                  >
                    {partner.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
