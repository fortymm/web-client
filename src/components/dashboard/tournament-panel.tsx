import { LayoutGrid, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  { bg: string; br: string; fg: string; label: string }
> = {
  W: {
    bg: 'rgba(0,226,154,0.12)',
    br: 'rgba(0,226,154,0.35)',
    fg: 'var(--color-serve-500)',
    label: 'WON',
  },
  L: {
    bg: 'rgba(255,77,109,0.1)',
    br: 'rgba(255,77,109,0.3)',
    fg: 'var(--color-loss)',
    label: 'LOST',
  },
  bye: {
    bg: 'var(--color-ink-800)',
    br: 'var(--color-ink-600)',
    fg: 'var(--color-chalk-300)',
    label: 'BYE',
  },
  live: {
    bg: 'rgba(255,122,26,0.1)',
    br: 'rgba(255,122,26,0.45)',
    fg: 'var(--color-ball-500)',
    label: 'LIVE',
  },
  upcoming: {
    bg: 'var(--color-ink-800)',
    br: 'var(--color-ink-500)',
    fg: 'var(--color-chalk-50)',
    label: 'NEXT',
  },
  locked: {
    bg: 'transparent',
    br: 'var(--color-ink-600)',
    fg: 'var(--color-ink-400)',
    label: '—',
  },
}

function PathStepCard({ step }: { step: PathStep }) {
  const c = PATH_COLORS[step.result]
  const isLive = step.result === 'live'
  return (
    <div
      className="relative flex min-h-24 flex-col justify-between rounded-md border px-3 pt-3 pb-3.5"
      style={{
        background: c.bg,
        borderColor: c.br,
        borderStyle: step.result === 'locked' ? 'dashed' : 'solid',
        boxShadow: isLive ? '0 0 18px rgba(255,122,26,0.15)' : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <Mono size={11} color="var(--color-chalk-300)" weight={700}>
          {step.round}
        </Mono>
        <span
          className="inline-flex items-center gap-1 font-mono text-[9px] font-bold tracking-[0.14em]"
          style={{ color: c.fg }}
        >
          {isLive && <LiveDot color="var(--color-ball-500)" size={6} />}
          {c.label}
        </span>
      </div>
      <div>
        <div
          className="text-[13px] font-medium"
          style={{
            color:
              step.result === 'locked'
                ? 'var(--color-ink-400)'
                : 'var(--color-chalk-50)',
            lineHeight: 1.25,
          }}
        >
          {step.opponent}
        </div>
        {step.score && (
          <Mono
            size={12}
            color={c.fg}
            weight={700}
            className="mt-0.5 block"
          >
            {step.score}
          </Mono>
        )}
        {step.games && (
          <Mono
            size={10}
            color="var(--color-chalk-300)"
            className="mt-0.5 block"
          >
            {step.games}
          </Mono>
        )}
        {step.detail && (
          <Mono size={10} color={c.fg} className="mt-0.5 block">
            {step.detail}
          </Mono>
        )}
        {step.eta && (
          <Mono
            size={10}
            color="var(--color-chalk-300)"
            className="mt-0.5 block"
          >
            {step.eta}
          </Mono>
        )}
      </div>
    </div>
  )
}

function UpNextRow({ m }: { m: UpNext }) {
  return (
    <div
      className="grid items-center gap-4 rounded-sm border px-3.5 py-2.5"
      style={{
        gridTemplateColumns: '72px 56px 1fr auto',
        background: m.you ? 'rgba(255,122,26,0.06)' : 'var(--color-ink-900)',
        borderColor: m.you ? 'rgba(255,122,26,0.3)' : 'var(--color-ink-600)',
      }}
    >
      <Mono
        size={14}
        color={m.you ? 'var(--color-ball-500)' : 'var(--color-chalk-50)'}
        weight={700}
      >
        {m.time}
      </Mono>
      <div className="font-mono text-[11px] tracking-[0.1em] text-chalk-300">
        CT {m.court}
      </div>
      <div className="flex items-center gap-2.5">
        <span
          className={
            m.you
              ? 'text-[13px] font-semibold text-chalk-50'
              : 'text-[13px] font-medium text-chalk-100'
          }
        >
          {m.a}
        </span>
        <span className="text-[12px] text-ink-400">vs</span>
        <span
          className={
            m.you
              ? 'text-[13px] font-semibold text-chalk-50'
              : 'text-[13px] font-medium text-chalk-100'
          }
        >
          {m.b}
        </span>
        <Pill tone="ghost" className="ml-1.5">
          {m.round}
        </Pill>
        {m.you && <Pill tone="ball">YOU</Pill>}
      </div>
      <Mono
        size={11}
        color="var(--color-chalk-300)"
        className="text-right"
      >
        {m.note ?? (m.you ? 'your next match' : '')}
      </Mono>
    </div>
  )
}
