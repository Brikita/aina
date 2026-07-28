import { useMemo, type ReactNode, type ComponentType } from 'react'
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import type { GeoJSONProps } from 'react-leaflet/GeoJSON'
import type { MapContainerProps } from 'react-leaflet/MapContainer'
import type { MarkerProps } from 'react-leaflet/Marker'
import type { PopupProps } from 'react-leaflet/Popup'
import type { TileLayerProps } from 'react-leaflet/TileLayer'
import { useAppContext } from '../../context/AppContext'
import type { RegionData } from '../../types'
import 'leaflet/dist/leaflet.css'

interface LeafletMapContainerProps {
  center: [number, number]
  zoom: number
  className?: string
  children?: ReactNode
}

interface LeafletTileLayerProps {
  url: string
  attribution: string
}

interface LeafletGeoJsonProps {
  data: object
  style: () => { color: string; weight: number; fillColor: string; fillOpacity: number }
  eventHandlers: { click: () => void }
}

interface LeafletMarkerProps {
  position: [number, number]
  children?: ReactNode
}

interface LeafletPopupProps {
  children?: ReactNode
}

const LeafletMapContainer = MapContainer as unknown as ComponentType<LeafletMapContainerProps & MapContainerProps>
const LeafletTileLayer = TileLayer as unknown as ComponentType<LeafletTileLayerProps & TileLayerProps>
const LeafletGeoJSON = GeoJSON as unknown as ComponentType<LeafletGeoJsonProps & GeoJSONProps>
const LeafletMarker = Marker as unknown as ComponentType<LeafletMarkerProps & MarkerProps>
const LeafletPopup = Popup as unknown as ComponentType<LeafletPopupProps & PopupProps>

const center: [number, number] = [1.2921, 36.8219]

const baseRegion: RegionData = {
  id: 'kajiado-county',
  name: 'Kajiado',
  hazardType: 'Flood',
  severity: 'High',
  context: 'County flood watch intersects low-lying drainage and settlement corridors.',
}

const kajiadoPolygon = {
  type: 'Feature',
  properties: {
    id: baseRegion.id,
    name: baseRegion.name,
    hazardType: baseRegion.hazardType,
    severity: baseRegion.severity,
    context: baseRegion.context,
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [36.35, -1.95],
        [36.82, -1.98],
        [36.98, -2.22],
        [36.58, -2.32],
        [36.35, -1.95],
      ],
    ],
  },
} as const

export function AinaMap() {
  const { setActiveRegion, fetchDecisionIntelligence } = useAppContext()

  const polygonStyle = useMemo(
    () => ({
      color: '#f59e0b',
      weight: 2,
      fillColor: '#fbbf24',
      fillOpacity: 0.25,
    }),
    [],
  )

  const handleClick = () => {
    setActiveRegion(baseRegion)
    void fetchDecisionIntelligence(baseRegion)
  }

  return (
    <section className="relative h-full min-h-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl">
      <LeafletMapContainer center={center} zoom={6} className="h-full w-full">
        <LeafletTileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        <LeafletGeoJSON data={kajiadoPolygon} style={() => polygonStyle} eventHandlers={{ click: handleClick }} />

        <LeafletMarker position={center}>
          <LeafletPopup>Nairobi operational hub</LeafletPopup>
        </LeafletMarker>
      </LeafletMapContainer>

      <div className="pointer-events-none absolute left-4 top-4 max-w-sm rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Map Intelligence</p>
        <p className="mt-1 text-slate-200">Click the highlighted county polygon to generate decision intelligence.</p>
      </div>
    </section>
  )
}
