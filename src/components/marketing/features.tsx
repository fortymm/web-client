import { useState } from 'react'
import { cn } from '@/lib/utils'
import { BracketMock } from './mocks/bracket-mock'
import { MatchLogMock } from './mocks/match-log-mock'
import { RatingMock } from './mocks/rating-mock'
import { SpectatorMock } from './mocks/spectator-mock'
import { SectionEyebrow } from './section-eyebrow'

type TabId = 'track' | 'rate' | 'run' | 'watch'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'track', label: 'Track matches' },
  { id: 'rate', label: 'See your ratings' },
  { id: 'run', label: 'Run tournaments' },
  { id: 'watch', label: 'Spectator view' },
]

type Panel = {
  heading: string
  body: string
  bullets: string[]
  Mock: React.ComponentType
}

const PANELS: Record<TabId, Panel> = {
  track: {
    heading: 'Scores in, history out.',
    body: "Tap the score after every rally. Games end themselves. The app watches for deuce, win-by-2, change-of-ends. Save the match and it's on your profile, in your club feed, and in your head-to-head record. No forms. No dropdowns.",
    bullets: [
      'Score with one finger on the bench',
      'Auto-detect deuce & game point',
      'Head-to-head and rating delta on save',
    ],
    Mock: MatchLogMock,
  },
  rate: {
    heading: 'A rating you can trust.',
    body: "Glicko-2 under the hood. Every match moves your number. Every number has a confidence range. Nothing is gamed, nothing is pay-to-win — because there's nothing to pay for.",
    bullets: [
      'Provisional → stable as you play',
      'Separate singles and doubles ratings',
      'Club-level and global leaderboards',
    ],
    Mock: RatingMock,
  },
  run: {
    heading: 'The schedule, solved.',
    body: "Constraints in, schedule out. Tell it how many courts you have, how long the lunch break is, who can't play back-to-back — and the scheduler returns a schedule that respects every rule. No spreadsheet surgery at 11pm the night before.",
    bullets: [
      'Round-robin, single-elim, double-elim, Swiss',
      "Live scoring from the scorers' table",
      'Public bracket link for spectators',
    ],
    Mock: BracketMock,
  },
  watch: {
    heading: 'Broadcast, without a broadcaster.',
    body: 'Every tournament has a public spectator URL. Big type. Live scores. Upcoming matches on the right. Share it with anyone — works without an account, without an app.',
    bullets: [
      'Full-screen court view',
      'Per-player follow links',
      "Embed on your club's website",
    ],
    Mock: SpectatorMock,
  },
}

const BULLETS = [
  {
    n: '01',
    title: 'Match log',
    body: 'Tap in scores. Games auto-advance. Rating delta shows up the moment you save.',
  },
  {
    n: '02',
    title: 'Clubs & ladders',
    body: 'Every club gets a feed, a ladder, and a challenge board. Set it up in a minute.',
  },
  {
    n: '03',
    title: 'Schedules that actually work',
    body: 'Our match scheduler respects your constraints — courts, breaks, back-to-backs. You get a bracket that holds up in the real world.',
  },
  {
    n: '04',
    title: 'Ephemeral accounts',
    body: 'You get an account when you start playing. Upgrade it to a real one by adding an email — whenever.',
  },
  {
    n: '05',
    title: 'Live spectator view',
    body: 'Share a link. Parents, friends, your grandma — they all get the live bracket.',
  },
  {
    n: '06',
    title: 'Export your data',
    body: "One JSON download. Full match history. It's yours. Delete your account and take it with you.",
  },
] as const

export function Features() {
  const [active, setActive] = useState<TabId>('track')
  const panel = PANELS[active]
  const { Mock } = panel

  return (
    <section id="product" className="py-26">
      <div className="mx-auto max-w-[1200px] px-10">
        <div className="mb-14 max-w-[880px]">
          <SectionEyebrow>The product</SectionEyebrow>
          <h2 className="font-display text-[56px] leading-none tracking-[0.01em] text-chalk-50 uppercase lg:text-[76px]">
            Everything a club needs.
            <br />
            <span className="text-chalk-300">
              Nothing anyone would try to sell you.
            </span>
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Features"
          className="mb-7 flex flex-wrap gap-1.5"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                'rounded-full border px-4.5 py-2.5 text-[13px] font-semibold tracking-[0.02em] transition-all',
                active === t.id
                  ? 'border-ball-500 bg-ball-500 text-ink-950'
                  : 'border-ink-600 text-chalk-100 hover:border-ink-500 hover:bg-white/5 hover:text-chalk-50',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mb-20 grid grid-cols-1 items-center gap-14 rounded-xl border border-ink-600 bg-ink-900 p-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0">
            <h3 className="mb-4 text-[34px] leading-[1.15] font-semibold tracking-[-0.02em] text-chalk-50">
              {panel.heading}
            </h3>
            <p className="mb-6 max-w-[440px] text-base leading-[1.55] text-chalk-100">
              {panel.body}
            </p>
            <ul className="flex flex-col gap-3">
              {panel.bullets.map((b) => (
                <li
                  key={b}
                  className="relative pl-5.5 text-sm font-medium text-chalk-100"
                >
                  <span className="absolute top-[0.55em] left-0 size-2 rounded-full bg-ball-500 shadow-[0_0_8px_rgba(255,122,26,0.6)]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <Mock />
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-ink-600 bg-ink-600 md:grid-cols-2 lg:grid-cols-3">
          {BULLETS.map((b) => (
            <div
              key={b.n}
              className="bg-ink-900 p-8 transition-colors hover:bg-ink-800"
            >
              <div className="mb-3.5 font-mono text-[12px] font-bold tracking-[0.14em] text-ball-500">
                {b.n}
              </div>
              <h3 className="mb-2 text-[19px] font-semibold tracking-[-0.01em] text-chalk-50">
                {b.title}
              </h3>
              <p className="text-sm leading-[1.55] text-chalk-100">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
