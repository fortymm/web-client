import { useParams, useNavigate } from 'react-router-dom'
import MatchScoreEntry from './MatchScoreEntry/MatchScoreEntry'
import type { MatchConfig, GameScore } from './MatchScoreEntry/types'

function MatchScorePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // TODO: Replace with actual data fetching hook
  // This is placeholder data for development
  const config: MatchConfig = {
    id: id ?? 'unknown',
    playerYou: { id: 'player-1', name: 'You', isCurrentUser: true },
    playerOpponent: { id: 'player-2', name: 'Opponent' },
    bestOf: 5,
    pointsToWin: 11,
    winBy: 2,
  }

  const handleSave = async (scores: GameScore[]) => {
    // TODO: Implement actual save logic with API call
    console.log('Saving scores:', scores)
    // Navigate back to match detail page after save
    navigate(`/matches/${id}`)
  }

  const handleCancel = () => {
    navigate(`/matches/${id}`)
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <MatchScoreEntry
        config={config}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default MatchScorePage
