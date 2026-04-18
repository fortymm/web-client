import { cn } from '@/lib/utils'

type GameBoxProps = {
  scores: [number, number]
  live?: boolean
  label?: string
}

export function GameBox({ scores, live = false, label }: GameBoxProps) {
  const [a, b] = scores
  return (
    <div
      className={cn(
        'relative rounded-sm border bg-ink-900 px-1.5 py-2.5 text-center',
        live
          ? 'border-serve-500/50 shadow-[0_0_0_1px_rgba(0,226,154,0.2),0_0_20px_rgba(0,226,154,0.15)]'
          : 'border-ink-600',
      )}
    >
      {label && (
        <div className="mb-1.5 font-mono text-[9px] font-semibold tracking-[0.14em] text-chalk-300">
          {label}
        </div>
      )}
      <div
        className={cn(
          'font-mono text-xl font-bold tabular-nums',
          a > b ? 'text-serve-500' : 'text-chalk-100',
        )}
      >
        {a}
      </div>
      <div className="mx-2.5 my-1 h-px bg-ink-600" />
      <div
        className={cn(
          'font-mono text-xl font-bold tabular-nums',
          b > a ? 'text-serve-500' : 'text-chalk-100',
        )}
      >
        {b}
      </div>
    </div>
  )
}
