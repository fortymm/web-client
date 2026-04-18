import { cn } from '@/lib/utils'

type MatchPlayer = {
  seed: number | string
  name: string
  score: number | string
  win?: boolean
}

type Match = {
  a: MatchPlayer
  b: MatchPlayer
  winner?: boolean
  live?: boolean
}

const R1: Match[] = [
  { winner: true, a: { seed: 1, name: 'Nguyen', score: 3, win: true }, b: { seed: 8, name: 'Okafor', score: 1 } },
  { winner: true, a: { seed: 4, name: 'Park', score: 3, win: true }, b: { seed: 5, name: 'Alvarez', score: 2 } },
  { live: true, a: { seed: 3, name: 'Hassan', score: 2 }, b: { seed: 6, name: 'Rao', score: 2 } },
  { a: { seed: 2, name: 'Liang', score: '—' }, b: { seed: 7, name: 'Bauer', score: '—' } },
]
const R2: Match[] = [
  { a: { seed: 1, name: 'Nguyen', score: '—' }, b: { seed: 4, name: 'Park', score: '—' } },
  { a: { seed: '?', name: 'Winner R3', score: '—' }, b: { seed: '?', name: 'Winner R4', score: '—' } },
]
const R3: Match[] = [
  { a: { seed: '?', name: 'Final A', score: '—' }, b: { seed: '?', name: 'Final B', score: '—' } },
]

export function BracketMock() {
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-900 p-5.5">
      <div className="mb-4 flex items-center justify-between border-b border-dashed border-ink-600 pb-3.5">
        <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-chalk-300">
          DRAW · MEN'S SINGLES · R16 → FINAL
        </span>
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-serve-500">
          <span className="ball-dot ball-dot--live" />1 of 8 courts live
        </span>
      </div>
      <div className="grid grid-cols-[1.2fr_1fr_0.8fr] gap-4.5">
        <Round matches={R1} />
        <Round matches={R2} />
        <Round matches={R3} />
      </div>
    </div>
  )
}

function Round({ matches }: { matches: Match[] }) {
  return (
    <div className="flex flex-col justify-around gap-3.5">
      {matches.map((m, i) => (
        <MatchCard key={i} match={m} />
      ))}
    </div>
  )
}

function MatchCard({ match }: { match: Match }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-sm border bg-ink-800',
        match.winner && 'opacity-85',
        match.live
          ? 'border-serve-500/45 shadow-[0_0_0_1px_rgba(0,226,154,0.15)]'
          : 'border-ink-600',
      )}
    >
      <BracketRow player={match.a} />
      <BracketRow player={match.b} last />
    </div>
  )
}

function BracketRow({ player, last }: { player: MatchPlayer; last?: boolean }) {
  return (
    <div
      className={cn(
        'grid grid-cols-[28px_1fr_auto] items-center gap-2.5 px-3 py-2.5 text-sm font-medium',
        last ? 'border-b-0' : 'border-b border-ink-700',
        player.win
          ? 'bg-serve-500/5 font-bold text-serve-500'
          : 'text-chalk-100',
      )}
    >
      <span className="font-mono text-[10px] font-semibold tracking-[0.06em] text-chalk-300">
        {player.seed}
      </span>
      <span>{player.name}</span>
      <span className="font-mono text-sm font-bold tabular-nums">{player.score}</span>
    </div>
  )
}
