import { useMemo } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DashboardState } from './data'
import { ME, STATE_LABELS, TD_EVENT, TOURNAMENT } from './data'
import { Mono, Overline } from './primitives'

type GreetingCopy = { line: string; sub: string }

function timeOfDay(h: number) {
  if (h < 5) return 'Late'
  if (h < 12) return 'Morning'
  if (h < 17) return 'Afternoon'
  if (h < 21) return 'Evening'
  return 'Late'
}

const GREETINGS: Record<
  DashboardState,
  (firstName: string, tod: string) => GreetingCopy
> = {
  idle: (firstName, tod) => ({
    line: `${tod}, ${firstName}.`,
    sub: 'Nothing on the schedule. Go find a match.',
  }),
  live_match: (firstName) => ({
    line: `You're on court, ${firstName}.`,
    sub: 'Everything else can wait.',
  }),
  in_tournament: (firstName, tod) => ({
    line: `${tod}, ${firstName}.`,
    sub: `Day ${TOURNAMENT.day} of ${TOURNAMENT.ofDays} · ${TOURNAMENT.name}.`,
  }),
  in_tournament_playing: (firstName) => ({
    line: `Game 4, ${firstName}. Lead at 2–1.`,
    sub: `${TOURNAMENT.name} · ${TOURNAMENT.myPath[2].round}.`,
  }),
  td: (_firstName, tod) => ({
    line: `${tod}, director.`,
    sub: `${TD_EVENT.name} · ${TD_EVENT.matches.done}/${
      TD_EVENT.matches.done +
      TD_EVENT.matches.live +
      TD_EVENT.matches.upcoming
    } matches done.`,
  }),
  td_playing: () => ({
    line: `You're on court AND running the show.`,
    sub: `Both hats on. Full-bleed is off so you can see the floor.`,
  }),
}

export function Greeting({ state }: { state: DashboardState }) {
  const { tod, todayLabel } = useMemo(() => {
    const now = new Date()
    return {
      tod: timeOfDay(now.getHours()),
      todayLabel: now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    }
  }, [])

  const firstName = ME.name.split(' ')[0]
  const g = GREETINGS[state](firstName, tod)

  return (
    <div className="flex flex-wrap items-end justify-between gap-8 px-10 pt-7 pb-5">
      <div className="min-w-0 flex-[1_1_420px]">
        <Overline className="mb-2">
          <span className="ball-dot mr-2 inline-block size-2 align-middle" />
          {todayLabel} · {STATE_LABELS[state].label}
        </Overline>
        <div
          className="mb-3 max-w-[720px] font-display uppercase tracking-[0.01em] text-chalk-50"
          style={{
            fontSize: 'clamp(36px, 4.2vw, 52px)',
            lineHeight: 1.02,
            textWrap: 'balance',
          }}
        >
          {g.line}
        </div>
        <div className="max-w-[640px] font-sans text-[15px] text-chalk-300">
          {g.sub}
        </div>
      </div>
      <div className="flex shrink-0 gap-2 self-end">
        <Button variant="ghost-secondary">
          <Calendar />
          This week
        </Button>
        <Button variant="primary">
          <Plus />
          Log a match
        </Button>
      </div>
    </div>
  )
}

export function ContextRow({ state }: { state: DashboardState }) {
  const inTourney = state === 'in_tournament_playing'
  return (
    <div className="flex items-center gap-4 border-b border-ink-600 bg-ink-950 px-10 py-3.5">
      <Overline>{inTourney ? 'CURRENTLY' : 'NOT MUCH ELSE TO SEE'}</Overline>
      <div className="font-sans text-[14px] text-chalk-100">
        {inTourney
          ? "The dashboard is quiet while you're on court. QF match is locked in below — everything else can wait."
          : "When you're on court, the scoreboard takes over. We'll get out of your way."}
      </div>
      <div className="flex-1" />
      <Mono size={11} className="text-chalk-300">
        AUTO-FULL-BLEED
      </Mono>
    </div>
  )
}
