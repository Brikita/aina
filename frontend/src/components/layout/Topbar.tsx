import { BellRing, Clock3, UserCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const alerts = [
  'Tana River flood watch elevated to amber status.',
  'County logistics teams confirmed water treatment stock availability.',
  'Simulation mode is enabled for scenario rehearsal.',
]

export function Topbar() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  const formattedDateTime = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(now)

  return (
    <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
        <BellRing size={16} className="text-amber-500" />
        <div className="relative overflow-hidden whitespace-nowrap">
          <div className="ticker-track inline-flex gap-10 pr-10 text-slate-600">
            {alerts.map((alert) => (
              <span key={alert} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {alert}
              </span>
            ))}
            {alerts.map((alert) => (
              <span key={`${alert}-clone`} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {alert}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-5 text-sm text-slate-600">
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
          <Clock3 size={16} className="text-slate-500" />
          <span>{formattedDateTime}</span>
        </div>

        <div className="flex items-center gap-3 rounded-full bg-slate-900 px-3 py-2 text-slate-100 shadow-sm">
          <UserCircle2 size={18} />
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">User</p>
            <p className="text-sm font-medium">Response Lead</p>
          </div>
        </div>
      </div>
    </header>
  )
}