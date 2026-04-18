import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ClubFeed } from '@/components/dashboard/club-feed'
import type { DashboardState } from '@/components/dashboard/data'
import { DASHBOARD_STATES, LIVE_MATCH } from '@/components/dashboard/data'
import { DashboardFooter } from '@/components/dashboard/footer'
import { ContextRow, Greeting } from '@/components/dashboard/greeting'
import { IdleHero } from '@/components/dashboard/idle-hero'
import { LiveMatchScoreboard } from '@/components/dashboard/live-match'
import { RatingPanel } from '@/components/dashboard/rating-panel'
import { RecentMatches } from '@/components/dashboard/recent-matches'
import { TDPanel } from '@/components/dashboard/td-panel'
import { TopBar } from '@/components/dashboard/topbar'
import { TournamentPanel } from '@/components/dashboard/tournament-panel'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const [state, setState] = useState<DashboardState>('in_tournament_playing')

  const cycleState = () => {
    const i = DASHBOARD_STATES.indexOf(state)
    setState(DASHBOARD_STATES[(i + 1) % DASHBOARD_STATES.length])
  }

  const showLiveFullBleed =
    state === 'live_match' || state === 'in_tournament_playing'
  const showLiveCompact = state === 'td_playing'
  const showTournament =
    state === 'in_tournament' || state === 'in_tournament_playing'
  const showTD = state === 'td' || state === 'td_playing'
  const showIdleHero = state === 'idle'

  return (
    <div className="min-h-svh bg-ink-950">
      <TopBar state={state} onCycleState={cycleState} />

      {showLiveFullBleed && (
        <LiveMatchScoreboard
          match={LIVE_MATCH}
          onExit={() => setState('in_tournament')}
        />
      )}

      {!showLiveFullBleed && <Greeting state={state} />}
      {showLiveFullBleed && <ContextRow state={state} />}

      <div
        className="grid items-start gap-6 px-10 pt-2 pb-14"
        style={{
          gridTemplateColumns: 'minmax(0, 2.4fr) minmax(340px, 1fr)',
        }}
      >
        <div className="flex flex-col gap-5">
          {showIdleHero && <IdleHero />}
          {showTD && <TDPanel />}
          {showLiveCompact && (
            <LiveMatchScoreboard
              match={LIVE_MATCH}
              compact
              onExit={() => setState('td')}
            />
          )}
          {showTournament && <TournamentPanel />}
          <RecentMatches />
        </div>

        <div className="flex flex-col gap-5">
          <RatingPanel />
          <ClubFeed />
        </div>
      </div>

      <DashboardFooter />
    </div>
  )
}
