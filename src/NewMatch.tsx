import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NewMatchHero from './NewMatch/NewMatchHero'
import NewMatchSearch from './NewMatch/NewMatchSearch'
import NewMatchContent from './NewMatch/NewMatchContent'
import SectionHeader from './NewMatch/SectionHeader'
import MatchLengthControl, { type MatchLength } from './NewMatch/MatchLengthControl'
import QuickMatchButton from './NewMatch/QuickMatchButton'
import StickyBottomPanel from './NewMatch/StickyBottomPanel'
import PlayerList from './NewMatch/PlayerList'
import { mockPlayers } from './NewMatch/mockPlayers'
import { useRecentOpponents } from './hooks/useRecentOpponents'

function NewMatch() {
  // UI state
  const [matchLength, setMatchLength] = useState<MatchLength>(5)
  const [inputQuery, setInputQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [loadingPlayerId, setLoadingPlayerId] = useState<string | null>(null)
  const navigate = useNavigate()

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

  const handleMatchCreated = (matchId: string) => {
    navigate(`/matches/${matchId}/score`)
  }

  const handleSelectPlayer = (playerId: string) => {
    setLoadingPlayerId(playerId)
    // Simulate match creation delay, then navigate
    setTimeout(() => {
      const matchId = crypto.randomUUID()
      navigate(`/matches/${matchId}/score`)
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] -mx-4 -mt-4">
      {/* Main Content Wrapper */}
      <div className="max-w-screen-sm mx-auto w-full flex flex-col flex-1">
        <NewMatchHero />
        <NewMatchSearch />
        <NewMatchContent>
          <SectionHeader title="RECENT PLAYERS" />
          <PlayerList
            players={mockPlayers}
            context="recents"
            onSelectPlayer={handleSelectPlayer}
            loadingPlayerId={loadingPlayerId}
          />
        </NewMatchContent>
      </div>

      <StickyBottomPanel>
        <MatchLengthControl value={matchLength} onChange={setMatchLength} />
        <QuickMatchButton
          matchLength={matchLength}
          onMatchCreated={handleMatchCreated}
        />
      </StickyBottomPanel>
    </div>
  )
}

export default NewMatch
