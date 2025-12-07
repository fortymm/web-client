import { useParams, useNavigate } from 'react-router-dom'
import GameScoreForm from './MatchScorePage/GameScoreForm'
import { useMatch } from './MatchScorePage/useMatch'
import { useSaveGame, getGamesToWin, getGameWins } from './MatchScorePage/useSaveGame'
import type { GameScore } from './lib/matchesDb'

// Placeholder player data until we have match context
const DEFAULT_PLAYER_1 = { id: 'player-1', name: 'You' }
const DEFAULT_PLAYER_2 = { id: 'player-2', name: 'Opponent' }

function MatchScorePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { match, isLoading } = useMatch(id)
  const saveGame = useSaveGame()

  const handleSave = (score: GameScore) => {
    if (!id) return

    saveGame.mutate(
      { matchId: id, game: score },
      {
        onSuccess: (result) => {
          if (result.isMatchComplete) {
            navigate(`/matches/${id}`)
          }
          // If match is not complete, stay on page to enter next game score
          // The UI will automatically update to show the next game number
        },
      }
    )
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

  const matchLength = match?.matchLength ?? 5
  const games = match?.games ?? []
  const currentGameNumber = games.length + 1
  const gamesToWin = getGamesToWin(matchLength)

  // Calculate current scores
  const player1Wins = getGameWins(games, DEFAULT_PLAYER_1.id)
  const player2Wins = getGameWins(games, DEFAULT_PLAYER_2.id)

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Match progress header */}
        {games.length > 0 && (
          <div className="mb-4 text-center">
            <div className="badge badge-neutral badge-lg gap-2">
              <span className="font-medium">{DEFAULT_PLAYER_1.name}</span>
              <span className="font-bold">{player1Wins}</span>
              <span className="text-base-content/50">–</span>
              <span className="font-bold">{player2Wins}</span>
              <span className="font-medium">{DEFAULT_PLAYER_2.name}</span>
            </div>
            <p className="text-xs text-base-content/50 mt-1">
              First to {gamesToWin} wins
            </p>
          </div>
        )}

        <GameScoreForm
          gameNumber={currentGameNumber}
          totalGames={matchLength}
          player1={DEFAULT_PLAYER_1}
          player2={DEFAULT_PLAYER_2}
          matchState={{ player1Wins, player2Wins, gamesToWin }}
          onSave={handleSave}
          onCancel={handleCancel}
          disabled={saveGame.isPending}
        />
      </div>
    </div>
  )
}

export default MatchScorePage
