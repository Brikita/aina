export interface Recommendation {
  id: string
  rank: number
  actor: string
  action: string
  reasoning: string
  status: 'pending' | 'approved'
}

export interface RiskState {
  level: 'Low' | 'Medium' | 'High'
  description: string
}

export interface GeoJsonGeometry {
  type: string
  coordinates: unknown
}

export interface GeoJsonFeature {
  type: 'Feature'
  properties?: Record<string, unknown>
  geometry: GeoJsonGeometry
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJsonFeature[]
}