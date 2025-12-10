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
      <div className="card bg-base-200/50 border border-base-300 mb-3">
        <div className="card-body px-4 py-3">
          {/* Status badge row */}
          <div className="flex justify-between items-center">
            <span
              className={`badge badge-sm ${isCompleted ? 'badge-success' : 'badge-warning'}`}
            >
              {isCompleted ? 'Completed' : 'In progress'}
            </span>
            <span className="text-xs text-base-content/40">
              Best of {match.matchLength}
            </span>
          </div>

          {/* Score - names on top, numbers below */}
          <div className="flex items-center justify-center gap-8 py-3">
            <div className="text-center">
              <p className="text-sm font-medium text-base-content/70 mb-1">
                {DEFAULT_PLAYER_1.name}
              </p>
              <p
                className={`text-4xl font-bold ${player1Won ? 'text-success' : ''}`}
              >
                {player1Wins}
              </p>
            </div>
            <span className="text-2xl text-base-content/20 font-light">–</span>
            <div className="text-center">
              <p className="text-sm text-base-content/50 mb-1">
                {DEFAULT_PLAYER_2.name}
              </p>
              <p
                className={`text-4xl font-bold ${player2Won ? 'text-success' : ''}`}
              >
                {player2Wins}
              </p>
            </div>
          </div>

          {/* Footer line */}
          <p className="text-center text-xs text-base-content/40">
            {isCompleted
              ? player1Won
                ? `You won ${player1Wins}–${player2Wins}`
                : `Opponent won ${player2Wins}–${player1Wins}`
              : `First to ${gamesToWin} wins`}
          </p>
        </div>
      </div>

      {/* Games list */}
      {match.games.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-medium text-base-content/50 mb-2 px-1 uppercase tracking-wide">
            Games
          </h2>
          <div className="space-y-1.5">
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
    <div className="flex items-center justify-between bg-base-200 rounded-lg px-3 py-2.5">
      <span className="text-base-content/50 text-sm">Game {gameNumber}</span>
      <div className="flex items-center gap-1.5 text-sm">
        <span
          className={
            player1Won ? 'font-semibold text-success' : 'text-base-content/50'
          }
        >
          {game.player1Score}
        </span>
        <span className="text-base-content/30">–</span>
        <span
          className={
            !player1Won ? 'font-semibold text-success' : 'text-base-content/50'
          }
        >
          {game.player2Score}
        </span>
      </div>
    </div>
  )
}

export default MatchDetailPage
