import { FlaskConical, TriangleAlert } from "lucide-react";
import { useSimulation } from "../../context/AppContext";

const scenarioOptions = [
  "None",
  "Turkana Flood",
  "Marsabit Drought",
  "Kajiado Conflict",
] as const;

export function SimulationBanner() {
  const { isSimulationMode, activeScenario, setActiveScenario } =
    useSimulation();

  if (!isSimulationMode) {
    return null;
  }

  return (
    <div className="sticky top-0 z-30 border-b border-amber-500/50 bg-amber-500/20 text-amber-200 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md">
      <div className="bg-[repeating-linear-gradient(135deg,rgba(245,158,11,0.22)_0,rgba(245,158,11,0.22)_10px,rgba(17,24,39,0.08)_10px,rgba(17,24,39,0.08)_20px)]">
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full border border-amber-400/40 bg-amber-500/20 p-2 text-amber-200">
              <TriangleAlert className="h-4 w-4" />
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100">
                <FlaskConical className="h-4 w-4" />
                Simulation Mode Active
              </p>
              <p className="mt-1 text-sm text-amber-100/90">
                System disconnected from live ICPAC feeds. Injecting synthetic
                scenario data.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-slate-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100">
            <span>Scenario</span>
            <select
              value={activeScenario}
              onChange={(event) =>
                setActiveScenario(
                  event.target.value as (typeof scenarioOptions)[number],
                )
              }
              className="rounded-xl border border-amber-400/30 bg-slate-950/40 px-3 py-2 text-sm font-medium uppercase tracking-normal text-amber-50 outline-none transition focus:border-amber-300"
            >
              {scenarioOptions.map((scenario) => (
                <option
                  key={scenario}
                  value={scenario}
                  className="bg-slate-900 text-slate-100"
                >
                  {scenario}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
