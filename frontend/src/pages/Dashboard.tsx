import { AinaMap } from '../components/map/AinaMap'
import { DecisionPanel } from '../components/decision/DecisionPanel'
import type { GeoJsonFeatureCollection } from '../types'

const demoGeoJson: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Kajiado East Flood Watch Zone',
        risk: 'High',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [36.42, -1.8],
            [36.75, -1.82],
            [36.88, -2.1],
            [36.55, -2.18],
            [36.42, -1.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Tana Basin Drought Monitoring Area',
        risk: 'Medium',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [39.2, -1.1],
            [39.65, -1.12],
            [39.72, -1.52],
            [39.28, -1.56],
            [39.2, -1.1],
          ],
        ],
      },
    },
  ],
}

export function Dashboard() {
  return (
    <section className="flex h-full min-h-0 flex-col gap-4 xl:flex-row">
      <div className="min-h-[28rem] flex-1 min-w-0">
        <AinaMap geoJson={demoGeoJson} />
      </div>

      <div className="min-h-0 w-full xl:w-[420px] xl:flex-none">
        <DecisionPanel />
      </div>
    </section>
  )
}