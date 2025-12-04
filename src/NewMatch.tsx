import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NewMatchHero from './NewMatch/NewMatchHero'
import NewMatchSearch from './NewMatch/NewMatchSearch'
import NewMatchContent from './NewMatch/NewMatchContent'
import SectionHeader from './NewMatch/SectionHeader'
import SkeletonRows from './NewMatch/SkeletonRows'
import MatchLengthControl, { type MatchLength } from './NewMatch/MatchLengthControl'
import QuickMatchButton from './NewMatch/QuickMatchButton'
import CTAPanel from './CTAPanel'
import PlayerList from './NewMatch/PlayerList'
import { mockPlayers } from './NewMatch/mockPlayers'
import { useRecentOpponents } from './hooks/useRecentOpponents'
import { useCreateMatch } from './NewMatch/useCreateMatch'

function NewMatch() {
  // UI state
  const [matchLength, setMatchLength] = useState<MatchLength>(5)
  const [inputQuery, setInputQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const navigate = useNavigate()

  // Match creation
  const createMatch = useCreateMatch()

  // Recent opponents data
  const recents = useRecentOpponents()

  // Derived state for recents
  const hasRecentsData = recents.opponents !== null && recents.opponents.length > 0
  const hasEmptyRecents = recents.opponents !== null && recents.opponents.length === 0
  const recentsError = recents.status === 'error'

  // Mode derived from debounced query
  const mode = debouncedQuery.trim() === '' ? 'recents' : 'search'

  // Expose state for future integration (FM-301, FM-302)
  void inputQuery
  void setInputQuery
  void setDebouncedQuery
  void hasRecentsData
  void hasEmptyRecents
  void recentsError
  void mode
  void recents

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

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] -mx-4 -mt-4">
      {/* Main Content Wrapper */}
      <div className="max-w-screen-sm mx-auto w-full flex flex-col flex-1">
        <NewMatchHero />
        <NewMatchSearch />
        <NewMatchContent>
          {mode === 'recents' && recents.isInitialLoading && (
            <>
              <SectionHeader title="RECENT PLAYERS" isLoading={false} />
              <SkeletonRows count={6} />
            </>
          )}
          {mode === 'recents' && !recents.isInitialLoading && (
            <>
              <SectionHeader title="RECENT PLAYERS" isLoading={recents.isRefetching} />
              <PlayerList
                players={mockPlayers}
                context="recents"
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
