import { ME } from '@/components/dashboard/data'
import { cn } from '@/lib/utils'
import type { Opponent } from './data'
import { estimateRatingDelta } from './data'

type RatedSwitchProps = {
  rated: boolean
  onChange: (next: boolean) => void
  opponent: Opponent | null
}

export function RatedSwitch({ rated, onChange, opponent }: RatedSwitchProps) {
  const canRate = !opponent?.isGuest
  const effectiveRated = rated && canRate
  const delta =
    opponent && !opponent.isGuest
      ? estimateRatingDelta(ME.rating, opponent.rating)
      : null

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.18em] text-chalk-300 uppercase">
        <span>Rated match</span>
        {!canRate && (
          <span className="ml-auto font-mono text-[11px] font-medium tracking-[0.14em] text-chalk-500 uppercase">
            Guest · unavailable
          </span>
        )}
      </div>
      <div className="flex min-h-[82px] items-center gap-3.5 rounded-xl border border-ink-600 bg-ink-900 p-4">
        <button
          type="button"
          role="switch"
          aria-checked={effectiveRated}
          aria-label="Counts toward rating"
          disabled={!canRate}
          onClick={() => canRate && onChange(!rated)}
          className={cn(
            'relative h-7 w-12 shrink-0 rounded-full border-none p-0 transition-colors duration-200',
            'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ball-400',
            effectiveRated ? 'bg-ball-500' : 'bg-ink-600',
            !canRate && 'cursor-not-allowed opacity-40',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'absolute top-[3px] left-[3px] size-[22px] rounded-full bg-chalk-50 shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-[var(--ease-snap)]',
              effectiveRated && 'translate-x-5 bg-white',
            )}
          />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-sans text-[15px] font-semibold text-chalk-50">
            {effectiveRated ? 'Counts toward rating' : 'Just for fun'}
            {effectiveRated && delta !== null && (
              <span className="rounded-xs bg-ball-500/[0.12] px-1.5 py-0.5 font-mono text-xs font-bold tracking-[0.04em] text-ball-500 tabular-nums">
                ±{delta}
              </span>
            )}
          </div>
          <div className="mt-0.5 font-sans text-xs leading-snug text-chalk-300">
            {effectiveRated
              ? opponent && !opponent.isGuest
                ? `Result will update both ratings. Based on a ${Math.abs(opponent.rating - ME.rating)}-point gap.`
                : 'Pick a rated opponent to see the swing.'
              : canRate
                ? opponent
                  ? 'No rating change. Still logged to history.'
                  : 'No rating change either way. Still logged to history.'
                : 'Guest matches are always unrated.'}
          </div>
        </div>
      </div>
    </div>
  )
}
