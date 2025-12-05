import { useParams, useNavigate } from 'react-router-dom'
import GameScoreForm from './MatchScorePage/GameScoreForm'

// Placeholder player data until we have match context
const DEFAULT_PLAYER_1 = { id: 'player-1', name: 'You' }
const DEFAULT_PLAYER_2 = { id: 'player-2', name: 'Opponent' }

interface GameScore {
  player1Score: number
  player2Score: number
  winnerId: string
}

function MatchScorePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const handleSave = (score: GameScore) => {
    // TODO: Save the game score to the match
    console.log('Game score saved:', score)
    navigate(`/matches/${id}`)
  }

  const handleCancel = () => {
    navigate(`/matches/${id}`)
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto max-w-md px-4 py-6">
        <GameScoreForm
          gameNumber={1}
          player1={DEFAULT_PLAYER_1}
          player2={DEFAULT_PLAYER_2}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default MatchScorePage
