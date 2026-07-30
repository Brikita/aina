import { BellRing, Clock3, Globe2, UserCircle2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage, useRole } from "../../context/AppContext";

const alerts = [
  "Tana River flood watch elevated to amber status.",
  "County logistics teams confirmed water treatment stock availability.",
  "Simulation mode is enabled for scenario rehearsal.",
];

export function Topbar() {
  const [now, setNow] = useState(new Date());
  const { userRole, setUserRole } = useRole();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  const formattedDateTime = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(now);

  return (
    <header className="flex h-[60px] items-center gap-4 border-b border-slate-200 bg-white px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700">
        <BellRing size={16} className="shrink-0 text-amber-500" />
        <div className="relative min-w-0 overflow-hidden whitespace-nowrap">
          <div className="ticker-track inline-flex gap-10 pr-10 text-slate-600">
            {alerts.map((alert) => (
              <span key={alert} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {alert}
              </span>
            ))}
            {alerts.map((alert) => (
              <span
                key={`${alert}-clone`}
                className="inline-flex items-center gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {alert}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
          <Clock3 size={16} className="text-slate-500" />
          <span>{formattedDateTime}</span>
        </div>

        <div className="flex items-center gap-3 rounded-full bg-slate-900 px-3 py-2 text-slate-100 shadow-sm">
          <UserCircle2 size={18} />
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Profile
            </p>
            <p className="text-sm font-medium">Response Lead</p>
          </div>
        </div>

        <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          <Users className="h-4 w-4 text-slate-500" />
          <select
            value={userRole}
            onChange={(event) =>
              setUserRole(event.target.value as typeof userRole)
            }
            className="bg-transparent text-sm font-medium uppercase tracking-normal text-slate-700 outline-none"
          >
            <option value="National Director">National Director</option>
            <option value="County Lead">County Lead</option>
            <option value="Field Officer">Field Officer</option>
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          <Globe2 className="h-4 w-4 text-slate-500" />
          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }
            className="bg-transparent text-sm font-medium uppercase tracking-normal text-slate-700 outline-none"
          >
            <option value="English">English</option>
            <option value="Swahili">Swahili</option>
          </select>
        </label>
      </div>
    </header>
  );
}
