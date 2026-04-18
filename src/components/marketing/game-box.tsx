import { cn } from '@/lib/utils'

type GameBoxProps = {
  scores: [number, number]
  live?: boolean
}

export function GameBox({ scores, live = false }: GameBoxProps) {
  const [a, b] = scores
  return (
    <div
      className={cn(
        'rounded-md border bg-ink-900 px-2 py-2.5 text-center',
        live ? 'border-serve-500/40' : 'border-ink-600',
      )}
    >
      <div
        className={cn(
          'font-mono text-lg font-bold tabular-nums',
          a > b ? 'text-serve-500' : 'text-chalk-100',
        )}
      >
        {a}
      </div>
      <div className="my-1 h-px bg-ink-600" />
      <div
        className={cn(
          'font-mono text-lg font-bold tabular-nums',
          b > a ? 'text-serve-500' : 'text-chalk-100',
        )}
      >
        {b}
      </div>
    </div>
  )
}
