import { GameBox } from './game-box'
import { PlayerRow } from './player-row'

const GAMES: Array<[number, number]> = [
  [11, 6],
  [9, 11],
  [11, 8],
  [11, 8],
]

export function HeroScoreboard() {
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-800 p-7 shadow-lg">
      <div className="mb-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-serve-500">
          <span className="ball-dot ball-dot--live" />
          LIVE · GAME 4
        </span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-chalk-300">
          COURT 3 · 19:42
        </span>
      </div>
      <PlayerRow name="Nguyen, T." seed="1" rating="2145" score={11} win />
      <div className="my-3.5 h-px bg-ink-600" />
      <PlayerRow name="Okafor, D." seed="8" rating="2145" score={8} />
      <div className="mt-6 grid grid-cols-4 gap-2">
        {GAMES.map((scores, i) => (
          <GameBox key={i} scores={scores} live={i === 3} />
        ))}
      </div>
    </div>
  )
}
