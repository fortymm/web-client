import { cn } from '@/lib/utils'

type PlayerRowProps = {
  name: string
  seed: string
  rating: string
  score: number
  win?: boolean
}

export function PlayerRow({ name, seed, rating, score, win = false }: PlayerRowProps) {
  const initials = name.split(',')[0]?.slice(0, 2).toUpperCase() ?? ''
  return (
    <div className="flex items-center gap-3.5">
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full font-sans text-sm font-bold',
          win
            ? 'bg-gradient-to-br from-ball-500 to-ball-700 text-white ring-2 ring-ball-500'
            : 'bg-ink-700 text-chalk-100',
        )}
      >
        {initials}
      </div>
      <div className="flex-1">
        <div
          className={cn(
            'text-base font-semibold',
            win ? 'text-serve-500' : 'text-chalk-50',
          )}
        >
          {name}
        </div>
        <div className="font-mono text-[11px] font-medium tracking-[0.1em] text-chalk-300">
          SEED {seed} · {rating}
        </div>
      </div>
      <div
        className={cn(
          'font-mono text-[44px] leading-none font-bold tabular-nums',
          win ? 'text-serve-500' : 'text-chalk-50',
        )}
      >
        {score}
      </div>
    </div>
  )
}
