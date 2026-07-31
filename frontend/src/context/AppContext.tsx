import axios from 'axios'
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  DecisionIntelligenceResponse,
  Recommendation,
  RegionData,
  RiskLevel,
  UserLanguage,
  UserRole,
} from '../types'

export type SimulationScenario =
  | 'None'
  | 'Turkana Flood'
  | 'Marsabit Drought'
  | 'Kajiado Conflict'

interface AppContextValue {
  isSimulationMode: boolean
  activeScenario: SimulationScenario
  activeRegion: RegionData | null
  activeHazardType: string
  activeSummary: string
  recommendations: Recommendation[]
  riskLevel: RiskLevel
  isAnalyzing: boolean
  userRole: UserRole
  language: UserLanguage
  toggleSimulationMode: () => void
  setActiveScenario: (scenario: SimulationScenario) => void
  setActiveRegion: (region: RegionData | null) => void
  approveAction: (id: string) => void
  fetchDecisionIntelligence: (regionData: RegionData) => Promise<void>
  setUserRole: (role: UserRole) => void
  setLanguage: (language: UserLanguage) => void
}

const fallbackRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    rank: 1,
    targetActor: 'County Disaster Committee',
    actionTitle: 'Pre-position water treatment tablets and chlorine',
    actionDetails:
      'Pre-position water treatment tablets and chlorine in Kajiado East wards.',
    urgency: 'immediate',
    confidenceScore: 0.91,
    reasoning:
      'Flood exposure is increasing along low-lying drainage corridors, and drinking-water contamination typically follows quickly after standing water accumulates. Pre-positioning supplies now reduces response delay and lowers secondary health risk.',
    supportingEvidence: [
      'Flood exposure rising in low-lying corridors',
      'Drinking-water contamination risk increasing',
    ],
    estimatedImpactIfDelayed:
      'Delay increases response time and secondary health risk across affected wards.',
    status: 'pending',
  },
  {
    id: 'rec-2',
    rank: 2,
    targetActor: 'Ward-Level CHVs',
    actionTitle: 'Run door-to-door evacuation readiness checks',
    actionDetails:
      'Run door-to-door evacuation readiness checks for households in flood-prone riparian zones.',
    urgency: 'near_term',
    confidenceScore: 0.84,
    reasoning:
      'The highest operational friction comes from mobility constraints and last-mile access. A targeted readiness sweep surfaces vulnerable households before routes degrade further.',
    supportingEvidence: [
      'Mobility constraints remain high',
      'Last-mile access likely to degrade',
    ],
    estimatedImpactIfDelayed:
      'Delayed readiness checks will leave vulnerable households unaccounted for before routes close.',
    status: 'pending',
  },
  {
    id: 'rec-3',
    rank: 3,
    targetActor: 'County Communications Team',
    actionTitle: 'Issue a verified early warning message',
    actionDetails:
      'Issue a verified early warning message through SMS, radio, and chief baraza channels.',
    urgency: 'near_term',
    confidenceScore: 0.79,
    reasoning:
      'Message reach is the fastest force multiplier in anticipatory response. A synchronized warning keeps guidance simple, trusted, and actionable across channels.',
    supportingEvidence: [
      'Message reach is the fastest force multiplier',
      'Trusted multi-channel messaging improves compliance',
    ],
    estimatedImpactIfDelayed:
      'Delayed communication reduces compliance and increases exposure to fast-moving impacts.',
    status: 'pending',
  },
]

const AppContext = createContext<AppContextValue | undefined>(undefined)

function mapBackendRisk(value: DecisionIntelligenceResponse['classified_risk']): RiskLevel {
  switch (value) {
    case 'low':
      return 'Normal'
    case 'medium':
      return 'Elevated'
    case 'high':
      return 'High'
    case 'critical':
      return 'Critical'
    default:
      return 'High'
  }
}

function deriveRiskLevel(recommendations: Recommendation[]): RiskLevel {
  const approvedCount = recommendations.filter((recommendation) => recommendation.status === 'approved').length
  if (approvedCount === 0) {
    return 'High'
  }
  if (approvedCount === 1) {
    return 'Elevated'
  }
  return 'Normal'
}

function mapResponseRecommendations(response: DecisionIntelligenceResponse): Recommendation[] {
  if (response.recommendations.length === 0) {
    return fallbackRecommendations
  }

  return response.recommendations.map((recommendation, index) => ({
    id: recommendation.id,
    rank: index + 1,
    targetActor: recommendation.target_actor,
    actionTitle: recommendation.action_title,
    actionDetails: recommendation.action_details,
    urgency: recommendation.urgency,
    confidenceScore: recommendation.confidence_score,
    reasoning: recommendation.reasoning,
    supportingEvidence: recommendation.supporting_evidence,
    estimatedImpactIfDelayed: recommendation.estimated_impact_if_delayed,
    status: 'pending',
  }))
}

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [isSimulationMode, setIsSimulationMode] = useState(false)
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>('None')
  const [activeRegion, setActiveRegionState] = useState<RegionData | null>(null)
  const [activeHazardType, setActiveHazardType] = useState('')
  const [activeSummary, setActiveSummary] = useState('')
  const [recommendations, setRecommendations] = useState<Recommendation[]>(fallbackRecommendations)
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('High')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('County Lead')
  const [language, setLanguage] = useState<UserLanguage>('English')

  const toggleSimulationMode = () => {
    setIsSimulationMode((current) => !current)
  }

  const setActiveRegion = (region: RegionData | null) => {
    setActiveRegionState(region)
  }

  const approveAction = (id: string) => {
    setRecommendations((currentRecommendations) => {
      const updatedRecommendations = currentRecommendations.map((recommendation) =>
        recommendation.id === id ? { ...recommendation, status: 'approved' as const } : recommendation,
      )

      setRiskLevel(deriveRiskLevel(updatedRecommendations))
      return updatedRecommendations
    })
  }

  const fetchDecisionIntelligence = async (regionData: RegionData) => {
    setActiveRegionState(regionData)
    setIsAnalyzing(true)

    try {
      const response = await axios.post<DecisionIntelligenceResponse>('/api/generate-decision', regionData)
      const nextRecommendations = mapResponseRecommendations(response.data)
      setRecommendations(nextRecommendations)
      setRiskLevel(mapBackendRisk(response.data.classified_risk))
      setActiveHazardType(response.data.hazard_type)
      setActiveSummary(response.data.summary)
    } catch {
      const nextRecommendations = fallbackRecommendations.map((recommendation) => ({
        ...recommendation,
        status: 'pending' as const,
      }))
      setRecommendations(nextRecommendations)
      setRiskLevel(regionData.severity)
      setActiveHazardType(regionData.hazardType)
      setActiveSummary(regionData.context)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const value = useMemo(
    () => ({
      isSimulationMode,
      activeScenario,
      activeRegion,
      activeHazardType,
      activeSummary,
      recommendations,
      riskLevel,
      isAnalyzing,
      userRole,
      language,
      toggleSimulationMode,
      setActiveScenario,
      setActiveRegion,
      approveAction,
      fetchDecisionIntelligence,
      setUserRole,
      setLanguage,
    }),
    [
      activeHazardType,
      activeRegion,
      activeScenario,
      activeSummary,
      isAnalyzing,
      isSimulationMode,
      language,
      recommendations,
      riskLevel,
      userRole,
    ],
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

export function useRole() {
  const { userRole, setUserRole } = useAppContext()

  return { userRole, setUserRole }
}

export function useLanguage() {
  const { language, setLanguage } = useAppContext()

  return { language, setLanguage }
}

export function useSimulation() {
  const { isSimulationMode, activeScenario, toggleSimulationMode, setActiveScenario } = useAppContext()

  return {
    isSimulationMode,
    activeScenario,
    toggleSimulationMode,
    setActiveScenario,
  }
}
