import axios from 'axios'
import { useMemo, useState, type ComponentType } from 'react'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import type { GeoJsonFeatureCollection } from '../../types'
import { LayerControls } from './LayerControls'
import 'leaflet/dist/leaflet.css'

interface AinaMapProps {
  geoJson: GeoJsonFeatureCollection
}

const defaultCenter: [number, number] = [1.2921, 36.8219]

const streetTiles = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
}

const satelliteTiles = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: 'Tiles &copy; Esri',
}

const SafeMapContainer = MapContainer as ComponentType<any>
const SafeTileLayer = TileLayer as ComponentType<any>
const SafeGeoJSON = GeoJSON as ComponentType<any>

export function AinaMap({ geoJson }: AinaMapProps) {
  const [showGeoJson, setShowGeoJson] = useState(true)
  const [useSatelliteBase, setUseSatelliteBase] = useState(false)

  const tileLayer = useMemo(() => (useSatelliteBase ? satelliteTiles : streetTiles), [useSatelliteBase])

  return (
    <section className="relative h-full min-h-[28rem] overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl">
      <SafeMapContainer center={defaultCenter} zoom={7} className="h-full w-full">
        <SafeTileLayer attribution={tileLayer.attribution} url={tileLayer.url} />
        {showGeoJson ? (
          <SafeGeoJSON
            data={geoJson}
            style={() => ({
              color: '#0ea5e9',
              weight: 2,
              fillColor: '#38bdf8',
              fillOpacity: 0.22,
            })}
            onEachFeature={(feature: any, layer: any) => {
              layer.on({
                click: () => {
                  void axios.post('/api/geospatial/analyze', {
                    feature,
                    message: 'Polygon clicked from AINA map shell',
                  })
                },
                mouseover: () => {
                  layer.setStyle({
                    weight: 3,
                    color: '#f97316',
                    fillOpacity: 0.35,
                  })
                },
                mouseout: () => {
                  layer.setStyle({
                    weight: 2,
                    color: '#0ea5e9',
                    fillOpacity: 0.22,
                  })
                },
              })
            }}
          />
        ) : null}
      </SafeMapContainer>

      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Map Intelligence</p>
          <p className="mt-1 text-slate-200">East Africa center on Nairobi for flood and drought monitoring.</p>
        </div>
        <div className="pointer-events-auto">
          <LayerControls
            showGeoJson={showGeoJson}
            onToggleGeoJson={() => setShowGeoJson((current) => !current)}
            useSatelliteBase={useSatelliteBase}
            onToggleSatelliteBase={() => setUseSatelliteBase((current) => !current)}
          />
        </div>
      </div>
    </section>
  )
}