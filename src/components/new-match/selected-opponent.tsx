import { cn } from '@/lib/utils'
import type { Opponent } from './data'

type SelectedOpponentProps = {
  opponent: Opponent
  onChange: () => void
}

export function SelectedOpponent({ opponent, onChange }: SelectedOpponentProps) {
  const isGuest = opponent.isGuest === true
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-ink-600 bg-ink-900 p-3">
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-full font-sans text-base font-bold text-chalk-50',
          isGuest
            ? 'border border-dashed border-ink-500 bg-transparent text-chalk-300'
            : 'bg-ink-700',
        )}
      >
        {opponent.initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-sans text-base font-semibold text-chalk-50">
          {opponent.name}
        </div>
        <div className="mt-0.5 font-mono text-[11px] tracking-[0.1em] text-chalk-300 uppercase">
          {isGuest ? (
            'Unrated guest'
          ) : (
            <>
              Rating · <b className="font-bold text-chalk-100">{opponent.rating}</b>
              {opponent.club ? ` · ${opponent.club}` : ''}
            </>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="rounded-md px-2.5 py-1.5 font-sans text-xs font-semibold text-chalk-300 hover:bg-white/5 hover:text-ball-500"
      >
        Change
      </button>
    </div>
  )
}
