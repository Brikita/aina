import { AinaMap } from '../components/map/AinaMap';
import { DecisionPanel } from '../components/decision/DecisionPanel';

export function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Left: Map */}
      <div className="map-container">
        <AinaMap />  {/* ← Your map component */}
      </div>
      
      {/* Right: Decision Panel (Teammate's component) */}
      <div className="panel-container">
        <DecisionPanel />  {/* ← Auto-updates via AppContext */}
      </div>
    </div>
  );
}