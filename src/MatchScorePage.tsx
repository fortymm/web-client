import { useParams, useNavigate } from 'react-router-dom'
import GameScoreForm from './MatchScorePage/GameScoreForm'
import { useMatch } from './MatchScorePage/useMatch'
import { useSaveGame } from './MatchScorePage/useSaveGame'
import { getCurrentGameNumber } from './lib/matchLogic'

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
  const { data: match, isLoading } = useMatch(id)
  const saveGame = useSaveGame()

  const handleSave = async (score: GameScore) => {
    if (!id) return

    const result = await saveGame.mutateAsync({
      matchId: id,
      game: score,
    })

    if (result.isMatchComplete) {
      navigate(`/matches/${id}`)
    }
    // If not complete, the match data will be invalidated and re-fetched,
    // which will update the game number automatically
  }

  const handleCancel = () => {
    navigate(`/matches/${id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  const games = match?.games ?? []
  const currentGameNumber = getCurrentGameNumber(games)
  const totalGames = match?.matchLength

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto max-w-md px-4 py-6">
        <GameScoreForm
          gameNumber={currentGameNumber}
          totalGames={totalGames}
          player1={DEFAULT_PLAYER_1}
          player2={DEFAULT_PLAYER_2}
          onSave={handleSave}
          onCancel={handleCancel}
          disabled={saveGame.isPending}
        />
      </div>
    </div>
  )
}

export default MatchScorePage
