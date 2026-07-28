import {
  BarChart3,
  Compass,
  Globe2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Button } from "../ui/Button";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/playbooks", label: "Playbooks", icon: Compass },
  { to: "/observatory", label: "Observatory", icon: Globe2 },
];

export function Sidebar() {
  const { isSimulationMode, toggleSimulationMode } = useAppContext();
  const [isToggleFocused, setIsToggleFocused] = useState(false);

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-slate-100">
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30">
            <ShieldAlert size={22} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-[0.2em] text-white">
              AINA
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Decision Intelligence
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                ].join(" ")
              }
              end={item.to === "/"}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <button
          type="button"
          role="switch"
          aria-checked={isSimulationMode}
          onClick={toggleSimulationMode}
          onFocus={() => setIsToggleFocused(true)}
          onBlur={() => setIsToggleFocused(false)}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-left transition hover:border-slate-600 hover:bg-slate-700"
        >
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles size={16} className="text-cyan-300" />
              Simulation Mode
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Scenario rehearsal and response walkthroughs
            </p>
          </div>
          <span
            className={[
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              isSimulationMode ? "bg-emerald-500" : "bg-slate-600",
              isToggleFocused
                ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-800"
                : "",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
                isSimulationMode ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </span>
        </button>

        <Button
          variant="outline"
          className="mt-3 w-full justify-center border-slate-700 text-slate-100 hover:bg-slate-800"
        >
          Operational Readiness
        </Button>
      </div>
    </aside>
  );
}
