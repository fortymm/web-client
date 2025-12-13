import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import NewMatchHero from './NewMatch/NewMatchHero'
import NewMatchSearch from './NewMatch/NewMatchSearch'
import NewMatchContent from './NewMatch/NewMatchContent'
import MatchLengthControl, { type MatchLength } from './NewMatch/MatchLengthControl'
import QuickMatchButton from './NewMatch/QuickMatchButton'
import CTAPanel from '@common/CTAPanel'
import ContentPanel from './NewMatch/ContentPanel'
import { useOpponents } from './hooks/useOpponents'
import { useCreateMatch } from './NewMatch/useCreateMatch'
import { useDebounce } from '@uidotdev/usehooks'

function NewMatch() {
  // URL state (source of truth for search query)
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') ?? ''
  const debouncedQuery = useDebounce(queryParam, 250)

  // UI state
  const [matchLength, setMatchLength] = useState<MatchLength>(5)
  const [retryCount, setRetryCount] = useState(0)
  const navigate = useNavigate()

  // Match creation
  const createMatch = useCreateMatch()

  // Unified opponents data (recents or search based on query)
  const opponents = useOpponents({ query: debouncedQuery })

  // Derived state for hero subtitle
  const hasRecentsData = opponents.opponents !== null && opponents.opponents.length > 0

  const handleSearchChange = (value: string) => {
    if (value) {
      setSearchParams({ q: value }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  const handleClear = () => {
    setSearchParams({}, { replace: true })
  }

  const handleCreateMatch = (opponentId: string | null) => {
    const id = crypto.randomUUID()

    // Optimistically redirect immediately
    navigate(`/matches/${id}/score`)

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
    const result = await opponents.refetch()
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
          value={queryParam}
          onChange={handleSearchChange}
          onClear={handleClear}
        />
        <NewMatchContent>
          <ContentPanel
            queryParam={queryParam}
            activeQuery={debouncedQuery}
            opponents={opponents.opponents}
            isInitialLoading={opponents.isInitialLoading}
            isFetching={opponents.isFetching}
            hasError={opponents.status === 'error'}
            onSelectPlayer={handleSelectPlayer}
            onRetry={handleRetry}
            retryCount={retryCount}
          />
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
