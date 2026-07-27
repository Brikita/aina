import { BarChart3, Globe2, MapPinned, Radar, ShieldAlert } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { Button } from '../../ui/Button'
import { Toggle } from '../../ui/Toggle'
import { useState } from 'react'

const regionOptions = ['Kajiado County', 'Tana River County', 'Marsabit County', 'Turkana County']

const navItems = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/map', label: 'Map', icon: MapPinned },
  { to: '/playbooks', label: 'Playbooks', icon: Radar },
  { to: '/observatory', label: 'Observatory', icon: Globe2 },
]

export function Sidebar() {
  const { isSimulationMode, setSimulationMode } = useAppContext()
  const [selectedRegion, setSelectedRegion] = useState(regionOptions[0])

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-slate-100">
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30">
            <ShieldAlert size={22} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-[0.2em] text-white">AINA</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Decision Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                ].join(' ')
              }
              end={item.to === '/'}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="space-y-4 border-t border-slate-800 p-4">
        <Toggle
          checked={isSimulationMode}
          onChange={setSimulationMode}
          label="Simulation Mode"
        />

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Current Region
          </span>
          <select
            value={selectedRegion}
            onChange={(event) => setSelectedRegion(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
          >
            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <Button variant="secondary" className="w-full justify-center bg-slate-800 text-slate-100 hover:bg-slate-700">
          {selectedRegion}
        </Button>
      </div>
    </aside>
  )
}