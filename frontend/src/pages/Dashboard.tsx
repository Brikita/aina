import { AinaMap } from "../components/map/AinaMap";
import { DecisionPanel } from "../components/decision/DecisionPanel";

export function Dashboard() {
  return (
    <section className="flex h-full min-h-0 gap-4">
      <div className="min-h-0 min-w-0 basis-3/5">
        <AinaMap />
      </div>

      <div className="min-h-0 min-w-0 basis-2/5">
        <DecisionPanel />
      </div>
    </section>
  );
}
