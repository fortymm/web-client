import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import NewMatchHero from './NewMatch/NewMatchHero'
import NewMatchSearch from './NewMatch/NewMatchSearch'
import NewMatchContent from './NewMatch/NewMatchContent'
import MatchLengthControl, { type MatchLength } from './NewMatch/MatchLengthControl'
import QuickMatchButton from './NewMatch/QuickMatchButton'
import CTAPanel from './CTAPanel'
import RecentPlayersPanel from './NewMatch/RecentPlayersPanel'
import SectionHeader from './NewMatch/SectionHeader'
import PlayerList from './NewMatch/PlayerList'
import { usePlayerResults } from './hooks/usePlayerResults'
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

  // Mode: show recents immediately when cleared, otherwise wait for debounce
  // (Initial load works because useDebounce returns initial value immediately)
  const mode =
    queryParam.trim() === ''
      ? 'recents'
      : debouncedQuery.trim() !== ''
        ? 'search'
        : 'recents'

  // Player results - returns recents when query is empty, search results otherwise
  const playerResults = usePlayerResults({ query: debouncedQuery })

  // Derived state
  const hasPlayersData = playerResults.players !== null && playerResults.players.length > 0
  const isSearchMode = mode === 'search'
  const hasSearchResults = isSearchMode && hasPlayersData

  // Error state (initial load failed, no cached data)
  const hasInitialLoadError = playerResults.status === 'error' && playerResults.players === null

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
    const result = await playerResults.refetch()
    if (result.status === 'success') {
      setRetryCount(0)
    }
  }

  // Show recents panel when in recents mode OR when searching but no results yet
  const showRecentsPanel = mode === 'recents' || (mode === 'search' && !hasSearchResults)

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] -mx-4 -mt-4">
      {/* Main Content Wrapper */}
      <div className="max-w-screen-sm mx-auto w-full flex flex-col flex-1">
        <NewMatchHero hasRecentPlayers={hasPlayersData} />
        <NewMatchSearch
          value={queryParam}
          onChange={handleSearchChange}
          onClear={handleClear}
        />
        <NewMatchContent>
          {showRecentsPanel && (
            <RecentPlayersPanel
              isInitialLoading={playerResults.isInitialLoading}
              isRefetching={playerResults.isRefetching}
              hasError={hasInitialLoadError}
              players={playerResults.players}
              onSelectPlayer={handleSelectPlayer}
              onRetry={handleRetry}
              retryCount={retryCount}
            />
          )}
          {mode === 'search' && hasSearchResults && (
            <>
              <SectionHeader
                title="SEARCH RESULTS"
                isLoading={playerResults.isFetching}
              />
              <PlayerList
                players={playerResults.players!}
                context="search"
                onSelectPlayer={handleSelectPlayer}
              />
            </>
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
