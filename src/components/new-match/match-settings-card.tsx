import { useState } from 'react'
import { BestOfPicker } from './best-of-picker'
import type { BestOf, Opponent } from './data'
import { GUEST_OPPONENT, TBD_OPPONENT } from './data'
import { OpponentPicker } from './opponent-picker'
import { RatedSwitch } from './rated-switch'
import { SelectedOpponent } from './selected-opponent'
import { SummaryStrip } from './summary-strip'
import { YouStrip } from './you-strip'

export type MatchSettings = {
  opponent: Opponent | null
  bestOf: BestOf
  rated: boolean
}

type MatchSettingsCardProps = {
  onCancel: () => void
  onStart: (settings: MatchSettings) => void
}

export function MatchSettingsCard({ onCancel, onStart }: MatchSettingsCardProps) {
  const [opponent, setOpponent] = useState<Opponent | null>(null)
  const [bestOf, setBestOf] = useState<BestOf>(5)
  const [rated, setRated] = useState(true)

  return (
    <div className="overflow-hidden rounded-lg border border-ink-600 bg-ink-800 shadow-[0_20px_48px_rgba(0,0,0,0.45)]">
      <YouStrip />

      <section className="border-b border-ink-600 px-[22px] pt-[22px] pb-6">
        <div className="mb-3.5 flex items-baseline justify-between">
          <h2 className="font-sans text-[13px] font-bold tracking-[0.02em] text-chalk-50">
            Opponent
          </h2>
          {opponent && (
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-chalk-500 uppercase">
              {opponent.isGuest ? 'Guest · unrated' : 'Rated player'}
            </span>
          )}
        </div>

        {opponent ? (
          <SelectedOpponent
            opponent={opponent}
            onChange={() => setOpponent(null)}
          />
        ) : (
          <OpponentPicker onPick={setOpponent} />
        )}

        {!opponent && (
          <div className="mt-3 flex items-center gap-3 font-sans text-[13px] font-medium text-chalk-300">
            <button
              type="button"
              onClick={() => setOpponent(GUEST_OPPONENT)}
              className="cursor-pointer border-b border-ink-500 pb-px text-chalk-100 transition-colors duration-100 hover:border-ball-500 hover:text-ball-500"
            >
              Add guest opponent
            </button>
            <span className="text-ink-500">·</span>
            <button
              type="button"
              onClick={() => setOpponent(TBD_OPPONENT)}
              className="cursor-pointer border-b border-ink-500 pb-px text-chalk-100 transition-colors duration-100 hover:border-ball-500 hover:text-ball-500"
            >
              Start without opponent
            </button>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 border-b border-ink-600 px-[22px] py-6 sm:grid-cols-2">
        <BestOfPicker bestOf={bestOf} onChange={setBestOf} />
        <RatedSwitch rated={rated} onChange={setRated} opponent={opponent} />
      </div>

      <SummaryStrip
        opponent={opponent}
        bestOf={bestOf}
        rated={rated}
        onCancel={onCancel}
        onStart={() => onStart({ opponent, bestOf, rated })}
      />
    </div>
  )
}
