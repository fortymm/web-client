import { cn } from '@/lib/utils'
import type { BestOf } from './data'
import { BEST_OF_OPTIONS } from './data'

type BestOfPickerProps = {
  bestOf: BestOf
  onChange: (next: BestOf) => void
}

export function BestOfPicker({ bestOf, onChange }: BestOfPickerProps) {
  return (
    <div>
      <FieldLabel>Match length</FieldLabel>
      <div
        role="radiogroup"
        aria-label="Match length"
        className="grid grid-cols-4 gap-0 rounded-xl border border-ink-600 bg-ink-900 p-1"
      >
        {BEST_OF_OPTIONS.map((opt) => {
          const active = bestOf === opt.n
          return (
            <button
              key={opt.n}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${opt.n === 1 ? '1 game' : `Best of ${opt.n}`} (${opt.label})`}
              onClick={() => onChange(opt.n)}
              className={cn(
                'group flex flex-col items-center gap-0.5 rounded-lg px-2 pt-3.5 pb-3 text-center transition-all duration-200',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ball-400',
                active && 'bg-ball-500 shadow-sm',
              )}
            >
              <span
                className={cn(
                  'font-mono text-[28px] leading-none font-bold tabular-nums transition-colors',
                  active
                    ? 'text-ink-950'
                    : 'text-chalk-300 group-hover:text-chalk-50',
                )}
              >
                {opt.n}
              </span>
              <span
                className={cn(
                  'mt-1 font-mono text-[9px] font-semibold tracking-[0.16em] uppercase',
                  active ? 'text-ink-950/70' : 'text-chalk-500',
                )}
              >
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-2.5 font-sans text-xs text-chalk-300">
        {bestOf === 1
          ? 'One game, winner takes all.'
          : `First to ${Math.ceil(bestOf / 2)} games.`}
      </p>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.18em] text-chalk-300 uppercase">
      {children}
    </div>
  )
}
