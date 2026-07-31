import { AinaMap } from "../components/map/AinaMap";
import { DecisionPanel } from "../components/decision/DecisionPanel";

export function Dashboard() {
  return (
    <section className="flex flex-col lg:flex-row h-full min-h-0 gap-4 items-stretch">
      <div className="min-h-0 min-w-0 lg:basis-3/5">
        <AinaMap />
      </div>

      <div className="min-h-0 min-w-0 lg:basis-2/5">
        <DecisionPanel />
      </div>
    </section>
  );
}
