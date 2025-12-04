import { type FC } from 'react'
import GameScoreRow from './GameScoreRow'

interface GameScore {
  player: number
  opponent: number
}

interface MatchScoreFormProps {
  matchLength: number
  games: GameScore[]
  playerName: string
  opponentName: string
  onGameScoreChange: (gameIndex: number, player: 'player' | 'opponent', delta: number) => void
}

const MatchScoreForm: FC<MatchScoreFormProps> = ({
  matchLength,
  games,
  playerName,
  opponentName,
  onGameScoreChange,
}) => {
  // Calculate wins
  const playerWins = games.filter((g) => isGameComplete(g) && g.player > g.opponent).length
  const opponentWins = games.filter((g) => isGameComplete(g) && g.opponent > g.player).length
  const gamesToWin = Math.ceil(matchLength / 2)
  const isMatchComplete = playerWins >= gamesToWin || opponentWins >= gamesToWin

  // Find the active game (first incomplete game, or none if match is complete)
  const activeGameIndex = isMatchComplete
    ? -1
    : games.findIndex((g) => !isGameComplete(g))

  return (
    <div className="flex flex-col gap-2">
      {/* Match score header */}
      <div className="flex items-center justify-between px-3 py-2 bg-base-200/30 rounded-lg mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{playerName}</span>
          <span className={`text-2xl font-bold tabular-nums ${playerWins > opponentWins ? 'text-success' : ''}`}>
            {playerWins}
          </span>
        </div>
        <span className="text-base-content/30">–</span>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold tabular-nums ${opponentWins > playerWins ? 'text-success' : ''}`}>
            {opponentWins}
          </span>
          <span className="text-sm font-medium">{opponentName}</span>
        </div>
      </div>

      {/* Game rows */}
      <div className="flex flex-col gap-1.5" role="list" aria-label="Game scores">
        {games.map((game, index) => {
          const isComplete = isGameComplete(game)
          const isActive = index === activeGameIndex
          // Disable games that are past the active game (can't score future games)
          // But allow editing completed games
          const isDisabled = !isActive && !isComplete && index > activeGameIndex

          return (
            <GameScoreRow
              key={index}
              gameNumber={index + 1}
              playerScore={game.player}
              opponentScore={game.opponent}
              playerName={playerName}
              opponentName={opponentName}
              isComplete={isComplete}
              isActive={isActive}
              isDisabled={isDisabled}
              onPlayerScoreChange={(delta) => onGameScoreChange(index, 'player', delta)}
              onOpponentScoreChange={(delta) => onGameScoreChange(index, 'opponent', delta)}
            />
          )
        })}
      </div>

      {/* Match status */}
      {isMatchComplete && (
        <div className="text-center py-3 mt-2">
          <span className={`text-lg font-bold ${playerWins > opponentWins ? 'text-success' : 'text-error'}`}>
            {playerWins > opponentWins ? `${playerName} wins!` : `${opponentName} wins!`}
          </span>
        </div>
      )}
    </div>
  )
}

// Check if a game has a valid winner (11+ points and 2+ point lead)
function isGameComplete(game: GameScore): boolean {
  const { player, opponent } = game
  const maxScore = Math.max(player, opponent)
  const minScore = Math.min(player, opponent)

  // Need at least 11 points and 2 point lead
  if (maxScore >= 11 && maxScore - minScore >= 2) {
    return true
  }

  // Deuce scenario: both at 10+, need 2 point lead
  if (player >= 10 && opponent >= 10 && Math.abs(player - opponent) >= 2) {
    return true
  }

  return false
}

export default MatchScoreForm
