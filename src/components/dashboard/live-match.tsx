import {
  Flag,
  Maximize2,
  Minimize2,
  Plus,
  RotateCcw,
  Share2,
  UserPlus,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GameScore, LiveMatch } from './data'
import { LiveDot, Mono, Overline, Pill } from './primitives'

type LiveMatchScoreboardProps = {
  match: LiveMatch
  onExit?: () => void
  compact?: boolean
}

export function LiveMatchScoreboard({
  match,
  onExit,
  compact = false,
}: LiveMatchScoreboardProps) {
  const currentIndex = match.games.findIndex((g) => g.winner === null)
  const currentGame =
    currentIndex >= 0
      ? match.games[currentIndex]
      : match.games[match.games.length - 1]
  const myGamesWon = match.games.filter((g) => g.winner === 'me').length
  const theirGamesWon = match.games.filter((g) => g.winner === 'them').length
  const myServe = match.serving === 'me'

  if (compact) {
    return (
      <LiveMatchHeroCard
        match={match}
        currentGame={currentGame}
        myGamesWon={myGamesWon}
        theirGamesWon={theirGamesWon}
      />
    )
  }

  return (
    <div className="relative overflow-hidden border-b border-ink-600 bg-ink-950">
      <div
        className="fortymm-grid-bg absolute inset-0 opacity-[0.35]"
        style={{
          maskImage:
            'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-[-20%] top-[-40%] h-[60%]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(255,122,26,0.12), transparent 60%)',
        }}
      />

      <div className="relative px-10 pt-5 pb-7">
        <div className="mb-5 flex flex-wrap items-center gap-3.5">
          <Pill tone="live" icon={<LiveDot size={7} />}>
            ON COURT · LIVE
          </Pill>
          <div className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.1em] text-chalk-300">
            <span className="text-chalk-100">{match.event}</span>
            <span>·</span>
            <span>{match.round}</span>
            <span>·</span>
            <span>COURT {match.court}</span>
            <span>·</span>
            <span>BEST OF {match.bestOf}</span>
          </div>
          <div className="flex-1" />
          <Mono size={13} color="var(--color-chalk-300)">
            ⌚ {match.timer} since {match.startedAt}
          </Mono>
          <Button variant="ghost-secondary" size="sm" onClick={onExit}>
            <Minimize2 />
            Minimise
          </Button>
          <Button variant="secondary" size="sm">
            <Share2 />
            Share court
          </Button>
        </div>

        <div
          className="grid items-center gap-8 px-0 pt-2.5 pb-5"
          style={{ gridTemplateColumns: '1fr auto 1fr' }}
        >
          <PlayerBlock
            side="left"
            name={match.me.name}
            seed={match.me.seed}
            rating={match.me.rating}
            serving={myServe}
            gamesWon={myGamesWon}
            bestOf={match.bestOf}
          />

          <CenterScore
            myScore={currentGame.me}
            theirScore={currentGame.them}
            gameLabel={`GAME ${match.games.length}`}
          />

          <PlayerBlock
            side="right"
            name={match.opponent.name}
            seed={match.opponent.seed}
            rating={match.opponent.rating}
            serving={!myServe}
            gamesWon={theirGamesWon}
            bestOf={match.bestOf}
          />
        </div>

        <GameStrip games={match.games} bestOf={match.bestOf} />

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Button variant="primary" size="lg">
            <Plus />
            +1 for me
            <Mono size={11} color="var(--color-ink-950)" className="ml-1">
              SPACE
            </Mono>
          </Button>
          <Button variant="secondary" size="lg">
            <Plus />
            +1 for opponent
            <Mono size={11} color="var(--color-chalk-300)" className="ml-1">
              N
            </Mono>
          </Button>
          <Button variant="ghost-secondary" size="lg">
            <RotateCcw />
            Undo
          </Button>
          <div className="flex-1" />
          <Button variant="ghost-secondary" size="lg">
            <Flag />
            Call let
          </Button>
          <Button variant="ghost-secondary" size="lg">
            <UserPlus />
            Call umpire
          </Button>
          <Button
            variant="ghost-secondary"
            size="lg"
            className="border-[rgba(255,77,109,0.4)] text-loss hover:bg-loss/10 hover:text-loss"
          >
            <X />
            Retire
          </Button>
        </div>

        <OpponentStrip match={match} />
      </div>
    </div>
  )
}

type PlayerBlockProps = {
  side: 'left' | 'right'
  name: string
  seed: number
  rating: number
  serving: boolean
  gamesWon: number
  bestOf: number
}

function PlayerBlock({
  side,
  name,
  seed,
  rating,
  serving,
  gamesWon,
  bestOf,
}: PlayerBlockProps) {
  const needed = Math.ceil(bestOf / 2)
  const isLeft = side === 'left'
  const alignItems = isLeft ? 'items-start' : 'items-end'
  const flexDir = isLeft ? 'flex-row' : 'flex-row-reverse'
  const textAlign = isLeft ? 'text-left' : 'text-right'
  return (
    <div className={`flex flex-col gap-2.5 ${alignItems}`}>
      {serving && (
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.14em] text-ball-500 ${flexDir}`}
        >
          <span
            className="size-[9px] animate-ball-pulse rounded-full bg-ball-500"
            style={{ boxShadow: '0 0 10px rgba(255,122,26,0.7)' }}
          />
          SERVING
        </span>
      )}
      <div
        className={`font-display uppercase tracking-[0.02em] text-chalk-50 ${textAlign}`}
        style={{ fontSize: 54, lineHeight: 0.95 }}
      >
        {name.split(' ').map((w, i) => (
          <div key={i}>{w}</div>
        ))}
      </div>
      <div
        className={`flex items-center gap-2.5 font-mono text-[12px] tracking-[0.08em] text-chalk-300 ${flexDir}`}
      >
        <span>[#{seed}]</span>
        <span>·</span>
        <span>{rating}</span>
        {isLeft && (
          <>
            <span>·</span>
            <span className="text-ball-500">YOU</span>
          </>
        )}
      </div>
      <div className={`flex gap-1.5 ${flexDir}`}>
        {Array.from({ length: needed }).map((_, i) => {
          const won = i < gamesWon
          return (
            <span
              key={i}
              className="size-3.5 rounded-full border-2"
              style={{
                background: won ? 'var(--color-ball-500)' : 'transparent',
                borderColor: won
                  ? 'var(--color-ball-500)'
                  : 'var(--color-ink-500)',
                boxShadow: won ? '0 0 8px rgba(255,122,26,0.5)' : 'none',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

type CenterScoreProps = {
  myScore: number
  theirScore: number
  gameLabel: string
}

function CenterScore({ myScore, theirScore, gameLabel }: CenterScoreProps) {
  return (
    <div className="flex min-w-[320px] flex-col items-center gap-1">
      <Overline
        className="text-ball-500"
        style={{ letterSpacing: '0.22em' }}
      >
        {gameLabel}
      </Overline>
      <div className="flex items-baseline gap-[18px] px-2.5 py-1.5">
        <Mono size={132} color="var(--color-chalk-50)" weight={700}>
          {myScore}
        </Mono>
        <span
          className="font-display text-ink-400"
          style={{ fontSize: 38 }}
        >
          —
        </span>
        <Mono size={132} color="var(--color-chalk-100)" weight={700}>
          {theirScore}
        </Mono>
      </div>
    </div>
  )
}

function GameStrip({
  games,
  bestOf,
}: {
  games: GameScore[]
  bestOf: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-ink-600 bg-ink-900 p-3.5">
      <Overline className="mr-2 self-center">GAMES</Overline>
      {games.map((g, i) => {
        const active = g.winner === null
        return (
          <div
            key={i}
            className="flex min-w-[92px] items-center gap-2.5 rounded-sm border px-3 py-1.5"
            style={{
              background: active
                ? 'rgba(255,122,26,0.09)'
                : 'var(--color-ink-800)',
              borderColor: active
                ? 'rgba(255,122,26,0.35)'
                : 'var(--color-ink-600)',
            }}
          >
            <Mono size={10} color="var(--color-chalk-300)">
              G{i + 1}
            </Mono>
            <Mono
              size={15}
              color={
                g.winner === 'me'
                  ? 'var(--color-serve-500)'
                  : 'var(--color-chalk-50)'
              }
              weight={g.winner === 'me' ? 700 : 600}
            >
              {g.me}
            </Mono>
            <Mono size={11} color="var(--color-ink-400)">
              –
            </Mono>
            <Mono
              size={15}
              color={
                g.winner === 'them'
                  ? 'var(--color-serve-500)'
                  : 'var(--color-chalk-50)'
              }
              weight={g.winner === 'them' ? 700 : 600}
            >
              {g.them}
            </Mono>
          </div>
        )
      })}
      {Array.from({ length: Math.max(0, bestOf - games.length) }).map(
        (_, i) => (
          <div
            key={`f${i}`}
            className="flex min-w-[92px] items-center justify-center rounded-sm border border-dashed border-ink-600 px-3 py-1.5"
          >
            <Mono size={11} color="var(--color-ink-400)">
              G{games.length + i + 1}
            </Mono>
          </div>
        ),
      )}
    </div>
  )
}

function OpponentStrip({ match }: { match: LiveMatch }) {
  const o = match.opponent
  const firstName = o.name.split(' ')[0]
  return (
    <div className="mt-3.5 grid grid-cols-4 gap-2.5">
      <MetaTile
        label="Head to head"
        value={`${o.h2h.w}–${o.h2h.l}`}
        sub={`You lead vs ${firstName}`}
      />
      <MetaTile
        label="Style"
        value={o.style}
        sub={`${o.hand} handed`}
        mono={false}
      />
      <MetaTile
        label="Opponent club"
        value={o.club}
        mono={false}
        sub="3 visits this season"
      />
      <MetaTile
        label="Rating gap"
        value={`+${match.me.rating - o.rating}`}
        sub="In your favour"
        accent="var(--color-serve-500)"
      />
    </div>
  )
}

type MetaTileProps = {
  label: string
  value: string
  sub?: string
  mono?: boolean
  accent?: string
}

function MetaTile({
  label,
  value,
  sub,
  mono = true,
  accent,
}: MetaTileProps) {
  return (
    <div className="rounded-md border border-ink-600 bg-white/[0.015] px-3.5 py-3">
      <Overline>{label}</Overline>
      <div
        className={
          mono ? 'font-mono tabular-nums' : 'font-sans'
        }
        style={{
          fontSize: mono ? 20 : 15,
          color: accent ?? 'var(--color-chalk-50)',
          marginTop: 4,
          fontWeight: 600,
          letterSpacing: mono ? '-0.01em' : '0',
        }}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-[11px] text-chalk-300">{sub}</div>
      )}
    </div>
  )
}

type HeroCardProps = {
  match: LiveMatch
  currentGame: GameScore
  myGamesWon: number
  theirGamesWon: number
}

function LiveMatchHeroCard({
  match,
  currentGame,
  myGamesWon,
  theirGamesWon,
}: HeroCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border px-[22px] py-[18px]"
      style={{
        background: 'var(--color-ink-800)',
        borderColor: 'rgba(0,226,154,0.35)',
        boxShadow: '0 0 32px rgba(0,226,154,0.08)',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Pill tone="live" icon={<LiveDot size={7} />}>
            YOU'RE ON · COURT {match.court}
          </Pill>
          <Mono size={11} color="var(--color-chalk-300)">
            {match.round} · G{match.games.length}
          </Mono>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost-secondary" size="sm">
            <Maximize2 />
            Expand
          </Button>
          <Button variant="primary" size="sm">
            <Plus />
            +1
          </Button>
        </div>
      </div>
      <div
        className="grid items-center gap-5"
        style={{ gridTemplateColumns: '1fr auto 1fr' }}
      >
        <div>
          <div
            className="font-display uppercase tracking-[0.02em] text-chalk-50"
            style={{ fontSize: 32 }}
          >
            {match.me.name}
          </div>
          <Mono size={11} color="var(--color-chalk-300)">
            [#{match.me.seed}] · {match.me.rating} · YOU
          </Mono>
        </div>
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2.5">
            <Mono size={52} color="var(--color-chalk-50)" weight={700}>
              {currentGame.me}
            </Mono>
            <Mono size={22} color="var(--color-ink-400)">
              –
            </Mono>
            <Mono size={52} color="var(--color-chalk-100)" weight={700}>
              {currentGame.them}
            </Mono>
          </div>
          <Mono size={11} color="var(--color-chalk-300)">
            games: {myGamesWon} – {theirGamesWon}
          </Mono>
        </div>
        <div className="text-right">
          <div
            className="font-display uppercase tracking-[0.02em] text-chalk-50"
            style={{ fontSize: 32 }}
          >
            {match.opponent.name}
          </div>
          <Mono size={11} color="var(--color-chalk-300)">
            [#{match.opponent.seed}] · {match.opponent.rating}
          </Mono>
        </div>
      </div>
    </div>
  )
}
