import { cn } from '@/lib/utils'

export function MatchLogMock() {
  return (
    <div className="mx-auto max-w-[340px] rounded-[32px] border border-ink-600 bg-ink-950 p-3.5 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between px-2.5 pt-1 pb-2.5">
        <span className="font-mono text-[13px] font-semibold text-chalk-50">9:41</span>
        <span className="flex gap-1">
          <span className="size-1 rounded-full bg-chalk-300" />
          <span className="size-1 rounded-full bg-chalk-300" />
          <span className="size-1 rounded-full bg-chalk-300" />
        </span>
      </div>
      <div className="flex items-start justify-between px-3 pt-3 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.14em] text-serve-500">
            <span className="ball-dot ball-dot--live" />
            LIVE · GAME 3
          </div>
          <div className="mt-1.5 text-[15px] font-semibold text-chalk-50">
            Match · Club Tuesday
          </div>
        </div>
        <div className="font-mono text-lg font-bold text-chalk-50">14:02</div>
      </div>
      <div className="px-3">
        <div className="grid grid-cols-[36px_1fr_auto] items-center gap-3 border-b border-ink-700 py-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-ball-500 to-ball-700 text-[11px] font-bold text-white">
            TN
          </div>
          <div className="text-sm font-semibold text-serve-500">You</div>
          <div className="font-mono text-[28px] font-bold tracking-[-0.03em] text-serve-500 tabular-nums">
            08
          </div>
        </div>
        <div className="grid grid-cols-[36px_1fr_auto] items-center gap-3 py-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-ink-700 text-[11px] font-bold text-chalk-100">
            DO
          </div>
          <div className="text-sm font-semibold text-chalk-50">D. Okafor</div>
          <div className="font-mono text-[28px] font-bold tracking-[-0.03em] text-chalk-50 tabular-nums">
            06
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 px-3 py-3.5">
        <GameCell a={11} b={9} winA />
        <GameCell a={7} b={11} winB />
        <GameCell a={8} b={6} live winA />
      </div>
      <div className="grid grid-cols-2 gap-2 px-3 pt-2 pb-4">
        <button className="h-14 rounded-md border border-transparent bg-ball-500 font-sans text-base font-bold text-ink-950 transition-colors hover:bg-ball-400">
          +1 you
        </button>
        <button className="h-14 rounded-md border border-ink-600 bg-ink-900 font-sans text-base font-bold text-chalk-50 transition-colors hover:bg-ink-800">
          +1 D.O.
        </button>
      </div>
      <div className="px-3 pb-3.5 text-center font-mono text-[11px] font-medium tracking-[0.06em] text-chalk-300">
        Swipe ↓ to end game · Hold to undo
      </div>
    </div>
  )
}

type GameCellProps = {
  a: number
  b: number
  winA?: boolean
  winB?: boolean
  live?: boolean
}

function GameCell({ a, b, winA, winB, live }: GameCellProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-sm border bg-ink-900 p-2 font-mono text-sm font-bold text-chalk-50',
        live ? 'border-serve-500/40' : 'border-ink-700',
      )}
    >
      <span className={winA ? '' : 'font-semibold text-chalk-300'}>{a}</span>
      <span className="h-3 w-px bg-ink-600" />
      <span className={winB ? '' : 'font-semibold text-chalk-300'}>{b}</span>
    </div>
  )
}
