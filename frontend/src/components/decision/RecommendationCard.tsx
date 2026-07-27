import { ChevronDown, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import type { Recommendation } from '../../types'
import { Button } from '../../ui/Button'

interface RecommendationCardProps {
  recommendation: Recommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { approveRecommendation } = useAppContext()
  const [isReasoningOpen, setIsReasoningOpen] = useState(true)
  const isApproved = recommendation.status === 'approved'

  return (
    <article
      className={[
        'rounded-lg border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300',
        isApproved ? 'translate-x-2 border-emerald-200 bg-emerald-50' : 'translate-x-0',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            Rank {recommendation.rank}
          </div>
          <h3 className="mt-3 text-base font-bold text-slate-900">{recommendation.actor}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-700">{recommendation.action}</p>
        </div>

        {isApproved ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={14} />
            Approved
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setIsReasoningOpen((current) => !current)}
        className="mt-4 flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <span>Reasoning / Context</span>
        <ChevronDown className={['transition-transform duration-200', isReasoningOpen ? 'rotate-180' : 'rotate-0'].join(' ')} size={16} />
      </button>

      <div
        className={[
          'grid transition-all duration-300',
          isReasoningOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <p className="mt-3 border-l-4 border-cyan-400 bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-500">
            {recommendation.reasoning}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Action status: {recommendation.status}</span>
        <Button
          variant={isApproved ? 'success' : 'primary'}
          onClick={() => approveRecommendation(recommendation.id)}
          disabled={isApproved}
        >
          {isApproved ? 'Approved' : 'Approve Action'}
        </Button>
      </div>
    </article>
  )
}