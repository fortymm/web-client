import { useNavigate } from 'react-router-dom'
import { NewMatchButton } from './NewMatchButton'
import CTAPanel from '@common/CTAPanel'
import { usePrefetchRecentOpponents } from './usePrefetchRecentOpponents'
import { useMatches } from './useMatches'
import MatchList from './MatchList'
import ActiveMatchBanner from './ActiveMatchBanner'
import { useDeleteMatch } from './useDeleteMatch'

function LandingPage() {
  const navigate = useNavigate()
  usePrefetchRecentOpponents()
  const { matches, isLoading } = useMatches()
  const deleteMatch = useDeleteMatch()

  const inProgressMatch = matches.find((m) => m.status === 'in_progress')
  const completedMatches = matches.filter((m) => m.status === 'completed')
  const hasCompletedMatches = completedMatches.length > 0

  const handleEndMatch = () => {
    if (inProgressMatch) {
      deleteMatch.mutate(inProgressMatch.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  return (
    <>
      {/* Active match banner - full width, breaks out of main padding */}
      {inProgressMatch && (
        <div className="-mx-4 -mt-4 mb-4">
          <ActiveMatchBanner
            match={inProgressMatch}
            onEndMatch={handleEndMatch}
          />
        </div>
      )}

      <div className="max-w-md mx-auto pb-40">
        {/* Match history or empty state */}
        {hasCompletedMatches ? (
          <MatchList matches={completedMatches} />
        ) : !inProgressMatch ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-120px)] -mx-4 px-4 pb-8">
            <div className="-mt-16 card max-w-xs bg-base-200 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🏓</span>
              </div>
              <h2 className="text-lg font-bold">No matches yet</h2>
              <p className="mt-2 text-sm text-base-content/70">
                Your match history will appear here.
              </p>
              <p className="mt-3 text-xs text-base-content/50">
                Tap <span className="font-medium">New match</span> to log your first result.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <CTAPanel>
        <NewMatchButton
          onClick={() => navigate('/matches/new')}
          disabled={!!inProgressMatch}
          disabledReason="Finish or end your current match first"
        />
      </CTAPanel>
    </>
  )
}

export default LandingPage
