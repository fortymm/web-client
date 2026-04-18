import type { LucideIcon } from 'lucide-react'
import {
  ExternalLink,
  Megaphone,
  PencilLine,
  RadioTower,
  UserX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
          accent={t.players.noShow ? 'var(--color-warn)' : undefined}
        />
        <TDStat
          label="Unscored"
          value={String(t.matches.unscored)}
          sub="needs your attention"
          accent={
            t.matches.unscored ? 'var(--color-warn)' : 'var(--color-serve-500)'
          }
        />
        <TDStat
          label="Solver"
          value={`${t.solver.ms}ms`}
          sub={`${t.solver.conflicts} conflicts · optimal`}
          accent="var(--color-serve-500)"
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
      <Mono size={26} color={accent ?? 'var(--color-chalk-50)'} weight={700}>
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

function NeedsYouRow({ n }: { n: NeedsYouItem }) {
  const Icon = NEEDS_YOU_ICON[n.kind]
  const tone = n.urgent
    ? {
        fg: 'var(--color-warn)',
        bg: 'rgba(255,196,61,0.08)',
        br: 'rgba(255,196,61,0.3)',
        iconBg: 'rgba(255,196,61,0.18)',
      }
    : {
        fg: 'var(--color-chalk-300)',
        bg: 'var(--color-ink-900)',
        br: 'var(--color-ink-600)',
        iconBg: 'var(--color-ink-800)',
      }
  return (
    <div
      className="flex items-center gap-3 rounded-sm border px-3 py-2.5"
      style={{ background: tone.bg, borderColor: tone.br }}
    >
      <div
        className="flex size-[30px] shrink-0 items-center justify-center rounded-sm"
        style={{ background: tone.iconBg, color: tone.fg }}
      >
        <Icon size={14} />
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-medium text-chalk-50">{n.label}</div>
        <Mono size={10} color="var(--color-chalk-300)">
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
    return (
      <div
        className="rounded-sm border p-2.5"
        style={{
          background: c.you ? 'rgba(255,122,26,0.08)' : 'var(--color-ink-900)',
          borderColor: c.you
            ? 'rgba(255,122,26,0.35)'
            : 'rgba(0,226,154,0.25)',
          boxShadow: c.you
            ? '0 0 16px rgba(255,122,26,0.1)'
            : '0 0 14px rgba(0,226,154,0.06)',
        }}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <Mono
            size={11}
            color={
              c.you ? 'var(--color-ball-500)' : 'var(--color-chalk-100)'
            }
            weight={700}
          >
            CT {c.n}
            {c.you ? ' · YOU' : ''}
          </Mono>
          <LiveDot
            color={
              c.you
                ? 'var(--color-ball-500)'
                : 'var(--color-serve-500)'
            }
            size={6}
          />
        </div>
        <div
          className="flex items-center justify-between text-[12px]"
          style={{
            color:
              c.win === 'a'
                ? 'var(--color-serve-500)'
                : 'var(--color-chalk-100)',
          }}
        >
          <span>{c.a}</span>
          <Mono
            size={12}
            color={
              c.win === 'a'
                ? 'var(--color-serve-500)'
                : 'var(--color-chalk-50)'
            }
            weight={700}
          >
            {c.sa}
          </Mono>
        </div>
        <div
          className="mt-0.5 flex items-center justify-between text-[12px]"
          style={{
            color:
              c.win === 'b'
                ? 'var(--color-serve-500)'
                : 'var(--color-chalk-100)',
          }}
        >
          <span>{c.b}</span>
          <Mono
            size={12}
            color={
              c.win === 'b'
                ? 'var(--color-serve-500)'
                : 'var(--color-chalk-50)'
            }
            weight={700}
          >
            {c.sb}
          </Mono>
        </div>
        <Mono size={9} color="var(--color-chalk-300)" className="mt-1.5 block">
          GAME {c.g}
        </Mono>
      </div>
    )
  }
  if (c.state === 'open') {
    return (
      <div className="flex min-h-[92px] flex-col justify-between rounded-sm border border-dashed border-ink-500 p-2.5">
        <div className="flex justify-between">
          <Mono size={11} color="var(--color-chalk-300)">
            CT {c.n}
          </Mono>
          <Mono size={9} color="var(--color-serve-500)" weight={700}>
            OPEN
          </Mono>
        </div>
        <div className="text-[11px] text-chalk-300">
          Next: <span className="text-chalk-50">{c.next}</span>
        </div>
        <button
          type="button"
          className="cursor-pointer self-start rounded-sm border border-ball-500 bg-transparent px-2 py-1 font-sans text-[11px] font-semibold text-ball-500 hover:bg-ball-500/10"
        >
          Call to court
        </button>
      </div>
    )
  }
  return (
    <div className="flex min-h-[92px] flex-col rounded-sm border border-ink-600 bg-white/[0.01] p-2.5">
      <div className="flex justify-between">
        <Mono size={11} color="var(--color-ink-400)">
          CT {c.n}
        </Mono>
        <Mono size={9} color="var(--color-ink-400)" weight={700}>
          SETUP
        </Mono>
      </div>
      <div className="flex flex-1 items-center justify-center text-[11px] text-ink-400">
        —
      </div>
    </div>
  )
}
