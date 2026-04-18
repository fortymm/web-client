import { cn } from '@/lib/utils'

type PlayerRowProps = {
  name: string
  seed: string
  rating: string
  score: number
  win?: boolean
  serving?: boolean
}

function initials(name: string) {
  return name.split(',')[0]?.slice(0, 2).toUpperCase() ?? ''
}

export function PlayerRow({
  name,
  seed,
  rating,
  score,
  win = false,
  serving = false,
}: PlayerRowProps) {
  return (
    <div className="grid grid-cols-[48px_1fr_auto] items-center gap-4 py-1.5">
      <div
        className={cn(
          'flex size-12 items-center justify-center rounded-full font-sans text-sm font-bold tracking-wider',
          win
            ? 'bg-gradient-to-br from-ball-500 to-ball-700 text-white shadow-[0_0_0_2px_var(--color-ball-500),0_0_20px_rgba(255,122,26,0.4)]'
            : 'bg-ink-700 text-chalk-100',
        )}
      >
        {initials(name)}
      </div>
      <div>
        <div
          className={cn(
            'flex items-center gap-2.5 text-lg font-semibold',
            win ? 'text-serve-500' : 'text-chalk-50',
          )}
        >
          {name}
          {serving && (
            <span
              title="Serving"
              className="animate-ball-pulse text-[10px] text-serve-500"
            >
              ●
            </span>
          )}
        </div>
        <div className="mt-1 flex gap-2 font-mono text-[11px] tracking-[0.1em] text-chalk-300">
          <span>SEED {seed}</span>
          <span className="opacity-50">·</span>
          <span>{rating}</span>
        </div>
      </div>
      <div
        className={cn(
          'font-mono text-[56px] leading-none font-bold tracking-[-0.04em] tabular-nums',
          win ? 'text-serve-500' : 'text-chalk-50',
        )}
      >
        {String(score).padStart(2, '0')}
      </div>
    </div>
  )
}
