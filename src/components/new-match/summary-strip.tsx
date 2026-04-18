import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BestOf, Opponent } from './data'

type SummaryStripProps = {
  opponent: Opponent | null
  bestOf: BestOf
  rated: boolean
  onCancel: () => void
  onStart: () => void
}

export function SummaryStrip({
  opponent,
  bestOf,
  rated,
  onCancel,
  onStart,
}: SummaryStripProps) {
  const effectivelyRated = rated && !opponent?.isGuest
  const gamesToWin = Math.ceil(bestOf / 2)
  const lengthCopy =
    bestOf === 1 ? 'Single game' : `Best of ${bestOf} · first to ${gamesToWin}`

  return (
    <div className="flex flex-col items-stretch justify-between gap-5 bg-ink-900 px-[22px] py-[18px] sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="font-sans text-base font-semibold tracking-[0.01em] text-chalk-50">
          {opponent ? (
            <>
              Ready: <b className="text-chalk-50">You</b> vs{' '}
              <b className="text-chalk-50">{opponent.name}</b>
            </>
          ) : (
            <>
              You vs{' '}
              <span className="font-medium text-chalk-500">
                pick an opponent
              </span>
            </>
          )}
        </div>
        <div className="font-mono text-[13px] font-medium tracking-[0.04em] text-chalk-300">
          {lengthCopy}
          <Dot />
          <span
            className={cn(
              'font-bold',
              effectivelyRated ? 'text-ball-500' : 'text-chalk-300',
            )}
          >
            {effectivelyRated ? 'Rated' : 'Unrated'}
          </span>
          <Dot />
          games to 11, win by 2
        </div>
      </div>
      <div className="flex shrink-0 justify-end gap-2.5">
        <Button
          variant="ghost-secondary"
          size="lg"
          className="px-[22px]"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="px-[26px] font-bold"
          onClick={onStart}
        >
          Start match
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

function Dot() {
  return <span className="mx-2.5 text-ink-500">·</span>
}
