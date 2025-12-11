import { useNavigate } from 'react-router-dom'
import { NewMatchButton } from './NewMatchButton'
import CTAPanel from './CTAPanel'
import { usePrefetchRecentOpponents } from './usePrefetchRecentOpponents'
import { useMatches } from './useMatches'
import MatchList from './MatchList'

function LandingPage() {
  const navigate = useNavigate()
  usePrefetchRecentOpponents()
  const { matches, isLoading } = useMatches()

  const hasMatches = matches.length > 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  return (
    <>
      {hasMatches ? (
        <div className="max-w-md mx-auto pb-40">
          <MatchList matches={matches} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-120px)] -mx-4 -mt-4 px-4 pb-8">
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
      )}

      <CTAPanel>
        <NewMatchButton onClick={() => navigate('/matches/new')} />
      </CTAPanel>
    </>
  )
}

export default LandingPage
