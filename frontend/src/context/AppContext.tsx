import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Recommendation } from '../types'

interface AppContextValue {
  isSimulationMode: boolean
  setSimulationMode: (value: boolean) => void
  activeRecommendations: Recommendation[]
  approveRecommendation: (id: string) => void
}

const seedRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    rank: 1,
    actor: 'County Disaster Committee',
    action: 'Pre-position water treatment tablets and chlorine in Kajiado East wards.',
    reasoning:
      'Forecast ensemble confidence is rising on localized flooding along drainage corridors, and water safety failures typically follow within 24 hours of inundation. Pre-positioned stocks shorten response time and reduce secondary disease risk.',
    status: 'pending',
  },
  {
    id: 'rec-2',
    rank: 2,
    actor: 'Ward-Level CHVs',
    action: 'Run door-to-door evacuation readiness checks for households in flood-prone riparian zones.',
    reasoning:
      'Households closest to the river banks are the first to lose access routes when water levels spike. A readiness sweep now identifies mobility constraints and protects high-risk residents before conditions deteriorate.',
    status: 'pending',
  },
  {
    id: 'rec-3',
    rank: 3,
    actor: 'County Communications Team',
    action: 'Issue a verified early warning message through SMS, radio, and chief baraza channels.',
    reasoning:
      'The strongest action multiplier is message reach. Coordinated communication keeps the warning simple, trusted, and actionable across communities with different access to digital channels.',
    status: 'pending',
  },
]

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [isSimulationMode, setSimulationMode] = useState(false)
  const [activeRecommendations, setActiveRecommendations] = useState(seedRecommendations)

  const approveRecommendation = (id: string) => {
    setActiveRecommendations((currentRecommendations) =>
      currentRecommendations.map((recommendation) =>
        recommendation.id === id
          ? { ...recommendation, status: 'approved' }
          : recommendation,
      ),
    )
  }

  const value = useMemo(
    () => ({
      isSimulationMode,
      setSimulationMode,
      activeRecommendations,
      approveRecommendation,
    }),
    [activeRecommendations, isSimulationMode],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }

  return context
}