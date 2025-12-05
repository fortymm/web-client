import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NewMatchHero from './NewMatch/NewMatchHero'
import NewMatchSearch from './NewMatch/NewMatchSearch'
import NewMatchContent from './NewMatch/NewMatchContent'
import MatchLengthControl, { type MatchLength } from './NewMatch/MatchLengthControl'
import QuickMatchButton from './NewMatch/QuickMatchButton'
import CTAPanel from './CTAPanel'
import RecentPlayersPanel from './NewMatch/RecentPlayersPanel'
import { useRecentOpponents } from './hooks/useRecentOpponents'
import { useCreateMatch } from './NewMatch/useCreateMatch'
import { useDebounce } from '@uidotdev/usehooks'

function NewMatch() {
  // UI state
  const [matchLength, setMatchLength] = useState<MatchLength>(5)
  const [inputQuery, setInputQuery] = useState('')
  const debouncedQuery = useDebounce(inputQuery, 250)
  const [retryCount, setRetryCount] = useState(0)
  const navigate = useNavigate()

  // Match creation
  const createMatch = useCreateMatch()

  // Recent opponents data
  const recents = useRecentOpponents()

  // Derived state for recents
  const hasRecentsData = recents.opponents !== null && recents.opponents.length > 0

  // Mode derived from debounced query
  const mode = debouncedQuery.trim() === '' ? 'recents' : 'search'

  // Error state (initial load failed, no cached data)
  const hasInitialLoadError = recents.status === 'error' && recents.opponents === null

  const handleClear = () => {
    setInputQuery('')
  }

  const handleCreateMatch = (opponentId: string | null) => {
    const id = crypto.randomUUID()

    // Optimistically redirect immediately
    navigate(`/matches/${id}`)

    // Persist the match in the background
    createMatch.mutate(
      {
        id,
        opponentId,
        matchLength,
      },
      {
        onError: (error) => {
          console.error('Failed to create match:', error)
        },
      }
    )
  }

  const handleQuickMatch = () => {
    handleCreateMatch(null)
  }

  const handleSelectPlayer = (playerId: string) => {
    handleCreateMatch(playerId)
  }

  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1)
    const result = await recents.refetch()
    if (result.status === 'success') {
      setRetryCount(0)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] -mx-4 -mt-4">
      {/* Main Content Wrapper */}
      <div className="max-w-screen-sm mx-auto w-full flex flex-col flex-1">
        <NewMatchHero hasRecentPlayers={hasRecentsData} />
        <NewMatchSearch
          value={inputQuery}
          onChange={setInputQuery}
          onClear={handleClear}
        />
        <NewMatchContent>
          {mode === 'recents' && (
            <RecentPlayersPanel
              isInitialLoading={recents.isInitialLoading}
              isRefetching={recents.isRefetching}
              hasError={hasInitialLoadError}
              players={recents.opponents}
              onSelectPlayer={handleSelectPlayer}
              onRetry={handleRetry}
              retryCount={retryCount}
            />
          )}
        </NewMatchContent>
      </div>

      <CTAPanel>
        <MatchLengthControl value={matchLength} onChange={setMatchLength} />
        <QuickMatchButton onClick={handleQuickMatch} />
      </CTAPanel>
    </div>
  )
}

export default NewMatch
