import type { LucideIcon } from 'lucide-react'
import {
  ExternalLink,
  Megaphone,
  PencilLine,
  RadioTower,
  UserX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CourtStatus, NeedsYouKind, TDEvent } from './data'
import { TD_EVENT } from './data'
import { Card, LiveDot, Mono, Overline, TextLink } from './primitives'

export function TDPanel() {
  const t: TDEvent = TD_EVENT
  return (
    <Card>
      <div className="flex items-center gap-3.5 border-b border-ink-600 px-[22px] py-[18px] pb-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-ball-500 bg-ink-950">
          <RadioTower size={20} className="text-ball-500" />
        </div>
        <div className="flex-1">
          <Overline className="mb-1">
            DIRECTOR CONTROL · {t.name.toUpperCase()}
          </Overline>
          <div className="font-sans text-[20px] font-bold text-chalk-50">
            Event is healthy
          </div>
          <div className="mt-0.5 font-mono text-[11px] tracking-[0.08em] text-chalk-300">
            ON TIME · DRIFT {t.schedule.drift} · SOLVER{' '}
            {t.solver.status.toUpperCase()}
          </div>
        </div>
        <Button variant="secondary">
          <ExternalLink />
          Open control room
        </Button>
      </div>

      <div className="grid grid-cols-5 border-b border-ink-600">
        <TDStat
          label="Courts live"
          value={`${t.courts.live}/${t.courts.total}`}
          sub={`${t.courts.open} open · ${t.courts.setup} setup`}
        />
        <TDStat
          label="Matches done"
          value={String(t.matches.done)}
          sub={`${t.matches.live} live · ${t.matches.upcoming} ahead`}
        />
        <TDStat
          label="Check-in"
          value={`${t.players.checkedIn}/${t.players.total}`}
          sub={`${t.players.noShow} no-show`}
          accent={t.players.noShow ? 'text-warn' : undefined}
        />
        <TDStat
          label="Unscored"
          value={String(t.matches.unscored)}
          sub="needs your attention"
          accent={t.matches.unscored ? 'text-warn' : 'text-serve-500'}
        />
        <TDStat
          label="Solver"
          value={`${t.solver.ms}ms`}
          sub={`${t.solver.conflicts} conflicts · optimal`}
          accent="text-serve-500"
        />
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: '1fr 1.35fr' }}
      >
        <div className="border-r border-ink-600 px-[22px] py-[18px]">
          <Overline className="mb-3">NEEDS YOU · 3 ITEMS</Overline>
          <div className="flex flex-col gap-2.5">
            {t.needsYou.map((n, i) => (
              <NeedsYouRow key={i} n={n} />
            ))}
          </div>
        </div>

        <div className="px-[22px] py-[18px]">
          <div className="mb-3 flex items-end justify-between">
            <Overline>COURTS AT A GLANCE</Overline>
            <TextLink>Open courts view →</TextLink>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {t.courtStatus.map((c) => (
              <TDCourtTile key={c.n} c={c} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

type TDStatProps = {
  label: string
  value: string
  sub: string
  accent?: string
}

function TDStat({ label, value, sub, accent }: TDStatProps) {
  return (
    <div className="border-r border-ink-600 px-5 py-4 last:border-r-0">
      <Overline className="mb-2 text-[10px]">{label}</Overline>
      <Mono size={26} weight={700} className={accent ?? 'text-chalk-50'}>
        {value}
      </Mono>
      <div className="mt-0.5 text-[11px] text-chalk-300">{sub}</div>
    </div>
  )
}

type NeedsYouItem = TDEvent['needsYou'][number]

const NEEDS_YOU_ICON: Record<NeedsYouKind, LucideIcon> = {
  score: PencilLine,
  call: Megaphone,
  nudge: UserX,
}

const NEEDS_YOU_CTA: Record<NeedsYouKind, string> = {
  score: 'Score',
  call: 'Call',
  nudge: 'Nudge',
}

const NEEDS_YOU_TONE = {
  urgent: {
    container: 'bg-warn/8 border-warn/30',
    iconBox: 'bg-warn/18 text-warn',
  },
  calm: {
    container: 'bg-ink-900 border-ink-600',
    iconBox: 'bg-ink-800 text-chalk-300',
  },
} as const

function NeedsYouRow({ n }: { n: NeedsYouItem }) {
  const Icon = NEEDS_YOU_ICON[n.kind]
  const tone = n.urgent ? NEEDS_YOU_TONE.urgent : NEEDS_YOU_TONE.calm
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-sm border px-3 py-2.5',
        tone.container,
      )}
    >
      <div
        className={cn(
          'flex size-[30px] shrink-0 items-center justify-center rounded-sm',
          tone.iconBox,
        )}
      >
        <Icon size={14} />
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-medium text-chalk-50">{n.label}</div>
        <Mono size={10} className="text-chalk-300">
          {n.detail.toUpperCase()}
        </Mono>
      </div>
      <Button variant={n.urgent ? 'primary' : 'ghost-secondary'} size="sm">
        {NEEDS_YOU_CTA[n.kind]}
      </Button>
    </div>
  )
}

function TDCourtTile({ c }: { c: CourtStatus }) {
  if (c.state === 'live') {
    const containerTone = c.you
      ? 'bg-ball-500/8 border-ball-500/35 shadow-[0_0_16px_rgba(255,122,26,0.10)]'
      : 'bg-ink-900 border-serve-500/25 shadow-[0_0_14px_rgba(0,226,154,0.06)]'
    return (
      <div className={cn('rounded-sm border p-2.5', containerTone)}>
        <div className="mb-1.5 flex items-center justify-between">
          <Mono
            size={11}
            weight={700}
            className={c.you ? 'text-ball-500' : 'text-chalk-100'}
          >
            CT {c.n}
            {c.you ? ' · YOU' : ''}
          </Mono>
          <LiveDot
            color={
              c.you ? 'var(--color-ball-500)' : 'var(--color-serve-500)'
            }
            size={6}
          />
        </div>
        <CourtScoreRow
          name={c.a}
          score={c.sa}
          won={c.win === 'a'}
        />
        <CourtScoreRow
          name={c.b}
          score={c.sb}
          won={c.win === 'b'}
          className="mt-0.5"
        />
        <Mono size={9} className="mt-1.5 block text-chalk-300">
          GAME {c.g}
        </Mono>
      </div>
    )
  }
  if (c.state === 'open') {
    return (
      <div className="flex min-h-[92px] flex-col justify-between rounded-sm border border-dashed border-ink-500 p-2.5">
        <div className="flex justify-between">
          <Mono size={11} className="text-chalk-300">
            CT {c.n}
          </Mono>
          <Mono size={9} weight={700} className="text-serve-500">
            OPEN
          </Mono>
        </div>
        <div className="text-[11px] text-chalk-300">
          Next: <span className="text-chalk-50">{c.next}</span>
        </div>
        <button
          type="button"
          className="self-start rounded-sm border border-ball-500 bg-transparent px-2 py-1 font-sans text-[11px] font-semibold text-ball-500 hover:bg-ball-500/10"
        >
          Call to court
        </button>
      </div>
    )
  }
  return (
    <div className="flex min-h-[92px] flex-col rounded-sm border border-ink-600 bg-white/[0.01] p-2.5">
      <div className="flex justify-between">
        <Mono size={11} className="text-ink-400">
          CT {c.n}
        </Mono>
        <Mono size={9} weight={700} className="text-ink-400">
          SETUP
        </Mono>
      </div>
      <div className="flex flex-1 items-center justify-center text-[11px] text-ink-400">
        —
      </div>
    </div>
  )
}

type CourtScoreRowProps = {
  name: string
  score: number
  won: boolean
  className?: string
}

function CourtScoreRow({ name, score, won, className }: CourtScoreRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between text-[12px]',
        won ? 'text-serve-500' : 'text-chalk-100',
        className,
      )}
    >
      <span>{name}</span>
      <Mono
        size={12}
        weight={700}
        className={won ? 'text-serve-500' : 'text-chalk-50'}
      >
        {score}
      </Mono>
    </div>
  )
}
