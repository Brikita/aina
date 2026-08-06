import { Layers3, Satellite, SquareMousePointer } from 'lucide-react'

interface LayerControlsProps {
  showGeoJson: boolean
  onToggleGeoJson: () => void
  useSatelliteBase: boolean
  onToggleSatelliteBase: () => void
}

export function LayerControls({
  showGeoJson,
  onToggleGeoJson,
  useSatelliteBase,
  onToggleSatelliteBase,
}: LayerControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/40 bg-slate-900/90 p-3 text-xs text-white shadow-lg backdrop-blur-md">
      <button
        type="button"
        onClick={onToggleGeoJson}
        className={[
          'inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold transition-colors',
          showGeoJson ? 'bg-cyan-500 text-slate-950' : 'bg-white/10 text-slate-100 hover:bg-white/20',
        ].join(' ')}
      >
        <Layers3 size={14} />
        GeoJSON Overlay
      </button>
      <button
        type="button"
        onClick={onToggleSatelliteBase}
        className={[
          'inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold transition-colors',
          useSatelliteBase ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-100 hover:bg-white/20',
        ].join(' ')}
      >
        <Satellite size={14} />
        Satellite Base
      </button>
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-slate-200">
        <SquareMousePointer size={14} />
        Click polygons for backend analysis
      </span>
    </div>
  )
}