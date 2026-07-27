import { useMemo } from 'react'
import { useAppContext } from '../../context/AppContext'
import type { RiskState } from '../../types'
import { RecommendationCard } from './RecommendationCard'

function deriveRiskState(pendingCount: number): RiskState {
  if (pendingCount >= 3) {
    return {
      level: 'High',
      description: 'Multiple urgent actions remain pending. Escalate coordination and messaging immediately.',
    }
  }

  if (pendingCount === 2) {
    return {
      level: 'Medium',
      description: 'The situation is active, but several interventions can still be staged before impact peaks.',
    }
  }

  return {
    level: 'Low',
    description: 'Most recommendations are stabilized and the response posture is currently controlled.',
  }
}

export function DecisionPanel() {
  const { activeRecommendations } = useAppContext()

  const pendingCount = activeRecommendations.filter((recommendation) => recommendation.status === 'pending').length
  const riskState = useMemo(() => deriveRiskState(pendingCount), [pendingCount])

  const riskTone =
    riskState.level === 'High'
      ? 'bg-red-50 text-red-700 border-red-200'
      : riskState.level === 'Medium'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200'

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-l border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Decision Workflow</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Risk Classification</h2>
        <div className={['mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold', riskTone].join(' ')}>
          {riskState.level}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{riskState.description}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Ranked Recommendations
          </h3>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            {pendingCount} pending
          </span>
        </div>

        <div className="space-y-4 pb-4">
          {activeRecommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </div>
    </aside>
  )
}