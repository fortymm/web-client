import { Link, useParams } from 'react-router-dom'
import { useMatch } from './MatchScorePage/useMatch'
import { getGamesToWin, getGameWins } from './MatchScorePage/useSaveGame'
import type { GameScore } from './lib/matchesDb'
import CTAPanel from './CTAPanel'

const DEFAULT_PLAYER_1 = { id: 'player-1', name: 'You' }
const DEFAULT_PLAYER_2 = { id: 'player-2', name: 'Opponent' }

function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { match, isLoading, error } = useMatch(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-2">Match not found</h1>
        <p className="text-base-content/60 mb-6">
          The match you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/matches/new" className="btn btn-primary">
          Start new match
        </Link>
      </div>
    )
  }

  const player1Wins = getGameWins(match.games, DEFAULT_PLAYER_1.id)
  const player2Wins = getGameWins(match.games, DEFAULT_PLAYER_2.id)
  const gamesToWin = getGamesToWin(match.matchLength)
  const isCompleted = match.status === 'completed'
  const winnerName =
    match.winnerId === DEFAULT_PLAYER_1.id
      ? DEFAULT_PLAYER_1.name
      : match.winnerId === DEFAULT_PLAYER_2.id
        ? DEFAULT_PLAYER_2.name
        : null

  return (
    <div className="max-w-md mx-auto pb-40">
      {/* Status badge */}
      <div className="mb-6 text-center">
        <div
          className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'} badge-lg`}
        >
          {isCompleted ? 'Completed' : 'In Progress'}
        </div>
      </div>

      {/* Score summary */}
      <div className="text-center mb-8">
        <h1 className="text-lg font-semibold text-base-content/60 mb-2">
          Match Score
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-base-content/60 text-sm mb-1">
              {DEFAULT_PLAYER_1.name}
            </p>
            <p className="text-4xl font-bold">{player1Wins}</p>
          </div>
          <span className="text-2xl text-base-content/30">–</span>
          <div className="text-center">
            <p className="text-base-content/60 text-sm mb-1">
              {DEFAULT_PLAYER_2.name}
            </p>
            <p className="text-4xl font-bold">{player2Wins}</p>
          </div>
        </div>
        <p className="text-sm text-base-content/50 mt-2">
          Best of {match.matchLength} · First to {gamesToWin}
        </p>
      </div>

      {/* Winner announcement */}
      {isCompleted && winnerName && (
        <div className="alert alert-success mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">{winnerName} wins the match!</span>
        </div>
      )}

      {/* Games list */}
      {match.games.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Games</h2>
          <div className="space-y-2">
            {match.games.map((game: GameScore, index: number) => (
              <GameRow
                key={index}
                gameNumber={index + 1}
                game={game}
                player1Name={DEFAULT_PLAYER_1.name}
                player2Name={DEFAULT_PLAYER_2.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA Panel */}
      <CTAPanel>
        {!isCompleted && (
          <Link
            to={`/matches/${id}/score`}
            className="btn btn-primary btn-block h-12"
          >
            Continue match
          </Link>
        )}
        <Link
          to="/matches/new"
          className={`btn ${isCompleted ? 'btn-primary' : 'btn-ghost'} btn-block h-12`}
        >
          New match
        </Link>
      </CTAPanel>
    </div>
  )
}

interface GameRowProps {
  gameNumber: number
  game: GameScore
  player1Name: string
  player2Name: string
}

function GameRow({ gameNumber, game, player1Name, player2Name }: GameRowProps) {
  const player1Won = game.winnerId === 'player-1'

  return (
    <div className="flex items-center justify-between bg-base-200/50 rounded-lg px-4 py-3">
      <span className="text-base-content/60 text-sm">Game {gameNumber}</span>
      <div className="flex items-center gap-3">
        <span className={`font-medium ${player1Won ? 'text-success' : ''}`}>
          {player1Name}: {game.player1Score}
        </span>
        <span className="text-base-content/30">–</span>
        <span className={`font-medium ${!player1Won ? 'text-success' : ''}`}>
          {player2Name}: {game.player2Score}
        </span>
      </div>
    </div>
  )
}

export default MatchDetailPage
