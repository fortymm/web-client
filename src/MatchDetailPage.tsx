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
  const player1Won = match.winnerId === DEFAULT_PLAYER_1.id
  const player2Won = match.winnerId === DEFAULT_PLAYER_2.id

  return (
    <div className="max-w-md mx-auto pb-40">
      {/* Match summary card */}
      <div className="card bg-base-200/50 border border-base-300 mb-4">
        <div className="card-body p-4">
          {/* Status badge */}
          <div className="flex justify-between items-center mb-2">
            <span
              className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}
            >
              {isCompleted ? 'Completed' : 'In progress'}
            </span>
            <span className="text-xs text-base-content/50">
              Best of {match.matchLength}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="text-center">
              <p
                className={`text-3xl font-bold ${player1Won ? 'text-success' : ''}`}
              >
                {player1Wins}
              </p>
              <p className="text-sm text-base-content/60">
                {DEFAULT_PLAYER_1.name}
              </p>
            </div>
            <span className="text-xl text-base-content/30">–</span>
            <div className="text-center">
              <p
                className={`text-3xl font-bold ${player2Won ? 'text-success' : ''}`}
              >
                {player2Wins}
              </p>
              <p className="text-sm text-base-content/60">
                {DEFAULT_PLAYER_2.name}
              </p>
            </div>
          </div>

          {/* Winner message or progress */}
          {isCompleted ? (
            <p className="text-center text-sm text-success font-medium">
              {player1Won
                ? `You won ${player1Wins}–${player2Wins}`
                : `Opponent won ${player2Wins}–${player1Wins}`}
            </p>
          ) : (
            <p className="text-center text-xs text-base-content/50">
              First to {gamesToWin} wins
            </p>
          )}
        </div>
      </div>

      {/* Games list */}
      {match.games.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-medium text-base-content/60 mb-2 px-1">
            Games
          </h2>
          <div className="space-y-1">
            {match.games.map((game: GameScore, index: number) => (
              <GameRow key={index} gameNumber={index + 1} game={game} />
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
}

function GameRow({ gameNumber, game }: GameRowProps) {
  const player1Won = game.winnerId === 'player-1'

  return (
    <div className="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2">
      <span className="text-base-content/50 text-xs">Game {gameNumber}</span>
      <div className="flex items-center gap-2 text-sm">
        <span className={player1Won ? 'font-medium text-success' : 'text-base-content/60'}>
          {game.player1Score}
        </span>
        <span className="text-base-content/30">–</span>
        <span className={!player1Won ? 'font-medium text-success' : 'text-base-content/60'}>
          {game.player2Score}
        </span>
      </div>
    </div>
  )
}

export default MatchDetailPage
