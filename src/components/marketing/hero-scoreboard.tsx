import { useEffect, useState } from 'react'
import { GameBox } from './game-box'
import { PlayerRow } from './player-row'

const SEQ: Array<[number, number]> = [
  [8, 8],
  [9, 8],
  [9, 9],
  [10, 9],
  [10, 10],
  [11, 10],
  [11, 11],
  [12, 11],
]

const DONE_GAMES: Array<[number, number]> = [
  [11, 6],
  [9, 11],
  [11, 8],
]

export function HeroScoreboard() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return
      setTick((t) => t + 1)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  const [a, b] = SEQ[tick % SEQ.length] as [number, number]
  const aServing = tick % 4 < 2

  return (
    <div className="min-w-0 rounded-xl border border-ink-600 bg-gradient-to-b from-ink-800 to-ink-900 px-7 py-6 shadow-[0_32px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mb-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2.5 font-mono text-[11px] font-bold tracking-[0.14em] text-serve-500">
          <span className="ball-dot ball-dot--live" />
          LIVE · GAME 4 · BO5
        </span>
        <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-chalk-300">
          COURT 3 · 19:42
        </span>
      </div>
      <PlayerRow
        name="Nguyen, T."
        seed="1"
        rating="2145"
        score={a}
        win={a > b}
        serving={aServing}
      />
      <div className="my-2 h-px bg-ink-600" />
      <PlayerRow
        name="Okafor, D."
        seed="8"
        rating="1988"
        score={b}
        win={b > a}
        serving={!aServing}
      />
      <div className="mt-6 grid grid-cols-4 gap-2.5">
        {DONE_GAMES.map((scores, i) => (
          <GameBox key={i} scores={scores} label={`G${i + 1}`} />
        ))}
        <GameBox scores={[a, b]} live label={`G${DONE_GAMES.length + 1}`} />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-dashed border-ink-600 pt-4 text-[12px] font-medium text-chalk-300">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-ball-500" />
          Sets 2–1
        </span>
        <span>
          Next: <span className="font-mono tabular-nums">+8 rating</span> on win
        </span>
        <button
          type="button"
          className="cursor-pointer bg-transparent font-semibold text-ball-500 hover:text-ball-400"
        >
          Share →
        </button>
      </div>
    </div>
  )
}
