import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { SimulationBanner } from "../ui/SimulationBanner";

export function MainLayout() {
  return (
    <div className="h-screen min-h-screen flex w-full overflow-hidden bg-slate-100 text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col min-h-0">
        <Topbar />
        <SimulationBanner />
        <main className="flex-1 min-h-0 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
