import { LayoutGrid, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PathResult, PathStep, Tournament, UpNext } from './data'
import { TOURNAMENT } from './data'
import { Card, LiveDot, Mono, Overline, Pill } from './primitives'

export function TournamentPanel() {
  const t: Tournament = TOURNAMENT
  const hasLive = t.myPath.some((p) => p.result === 'live')

  return (
    <Card live={hasLive}>
      <div className="flex items-center gap-4 border-b border-ink-600 px-[22px] py-[18px] pb-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ball-500">
          <Trophy size={22} className="text-ink-950" />
        </div>
        <div className="flex-1">
          <Overline className="mb-1">YOUR ACTIVE TOURNAMENT</Overline>
          <div className="font-sans text-[20px] font-bold tracking-[-0.01em] text-chalk-50">
            {t.name}
          </div>
          <div className="mt-0.5 font-mono text-[11px] tracking-[0.08em] text-chalk-300">
            {t.venue.toUpperCase()} · DAY {t.day}/{t.ofDays} ·{' '}
            {t.format.toUpperCase()}
          </div>
        </div>
        <Button variant="secondary">
          <LayoutGrid />
          View bracket
        </Button>
      </div>

      <div className="px-[22px] pt-[22px] pb-[18px]">
        <Overline className="mb-3">
          YOUR PATH · SEED #{t.bracket.yourSeed} · {t.bracket.toWin} TO THE
          TITLE
        </Overline>
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${t.myPath.length}, 1fr)`,
          }}
        >
          {t.myPath.map((p, i) => (
            <PathStepCard key={i} step={p} />
          ))}
        </div>
      </div>

      <div className="px-[22px] pb-[22px]">
        <Overline className="mb-2.5">UP NEXT · ON THE FLOOR</Overline>
        <div className="flex flex-col gap-2">
          {t.upNext.map((m, i) => (
            <UpNextRow key={i} m={m} />
          ))}
        </div>
      </div>
    </Card>
  )
}

const PATH_COLORS: Record<
  PathResult,
  { container: string; accent: string; label: string }
> = {
  W: {
    container: 'bg-serve-500/12 border-serve-500/35',
    accent: 'text-serve-500',
    label: 'WON',
  },
  L: {
    container: 'bg-loss/10 border-loss/30',
    accent: 'text-loss',
    label: 'LOST',
  },
  bye: {
    container: 'bg-ink-800 border-ink-600',
    accent: 'text-chalk-300',
    label: 'BYE',
  },
  live: {
    container:
      'bg-ball-500/10 border-ball-500/45 shadow-[0_0_18px_rgba(255,122,26,0.15)]',
    accent: 'text-ball-500',
    label: 'LIVE',
  },
  upcoming: {
    container: 'bg-ink-800 border-ink-500',
    accent: 'text-chalk-50',
    label: 'NEXT',
  },
  locked: {
    container: 'bg-transparent border-ink-600 border-dashed',
    accent: 'text-ink-400',
    label: '—',
  },
}

function PathStepCard({ step }: { step: PathStep }) {
  const c = PATH_COLORS[step.result]
  const isLive = step.result === 'live'
  const opponentColor =
    step.result === 'locked' ? 'text-ink-400' : 'text-chalk-50'
  return (
    <div
      className={cn(
        'relative flex min-h-24 flex-col justify-between rounded-md border px-3 pt-3 pb-3.5',
        c.container,
      )}
    >
      <div className="flex items-center justify-between">
        <Mono size={11} weight={700} className="text-chalk-300">
          {step.round}
        </Mono>
        <span
          className={cn(
            'inline-flex items-center gap-1 font-mono text-[9px] font-bold tracking-[0.14em]',
            c.accent,
          )}
        >
          {isLive && <LiveDot color="var(--color-ball-500)" size={6} />}
          {c.label}
        </span>
      </div>
      <div>
        <div
          className={cn(
            'text-[13px] font-medium leading-[1.25]',
            opponentColor,
          )}
        >
          {step.opponent}
        </div>
        {step.score && (
          <Mono size={12} weight={700} className={cn('mt-0.5 block', c.accent)}>
            {step.score}
          </Mono>
        )}
        {step.games && (
          <Mono size={10} className="mt-0.5 block text-chalk-300">
            {step.games}
          </Mono>
        )}
        {step.detail && (
          <Mono size={10} className={cn('mt-0.5 block', c.accent)}>
            {step.detail}
          </Mono>
        )}
        {step.eta && (
          <Mono size={10} className="mt-0.5 block text-chalk-300">
            {step.eta}
          </Mono>
        )}
      </div>
    </div>
  )
}

function UpNextRow({ m }: { m: UpNext }) {
  const rowTone = m.you
    ? 'bg-ball-500/6 border-ball-500/30'
    : 'bg-ink-900 border-ink-600'
  const nameTone = m.you
    ? 'text-[13px] font-semibold text-chalk-50'
    : 'text-[13px] font-medium text-chalk-100'
  return (
    <div
      className={cn(
        'grid items-center gap-4 rounded-sm border px-3.5 py-2.5',
        rowTone,
      )}
      style={{ gridTemplateColumns: '72px 56px 1fr auto' }}
    >
      <Mono
        size={14}
        weight={700}
        className={m.you ? 'text-ball-500' : 'text-chalk-50'}
      >
        {m.time}
      </Mono>
      <div className="font-mono text-[11px] tracking-[0.1em] text-chalk-300">
        CT {m.court}
      </div>
      <div className="flex items-center gap-2.5">
        <span className={nameTone}>{m.a}</span>
        <span className="text-[12px] text-ink-400">vs</span>
        <span className={nameTone}>{m.b}</span>
        <Pill tone="ghost" className="ml-1.5">
          {m.round}
        </Pill>
        {m.you && <Pill tone="ball">YOU</Pill>}
      </div>
      <Mono size={11} className="text-right text-chalk-300">
        {m.note ?? (m.you ? 'your next match' : '')}
      </Mono>
    </div>
  )
}
