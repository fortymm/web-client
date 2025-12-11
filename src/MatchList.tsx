import { Link } from 'react-router-dom'
import { type StoredMatch } from './lib/matchesDb'
import { getGameWins, getGamesToWin } from './MatchScorePage/useSaveGame'

const DEFAULT_PLAYER_1_ID = 'player-1'
const DEFAULT_PLAYER_2_ID = 'player-2'

interface MatchListProps {
  matches: StoredMatch[]
}

function MatchList({ matches }: MatchListProps) {
  const inProgressMatches = matches.filter((m) => m.status === 'in_progress')
  const completedMatches = matches.filter((m) => m.status === 'completed')

  return (
    <div className="space-y-5">
      {inProgressMatches.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-base-content/50 mb-3 px-1">
            In Progress
          </h2>
          <div className="space-y-2">
            {inProgressMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {completedMatches.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-base-content/50 mb-3 px-1">
            Recent Matches
          </h2>
          <div className="space-y-2">
            {completedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

interface MatchCardProps {
  match: StoredMatch
}

function MatchCard({ match }: MatchCardProps) {
  const player1Wins = getGameWins(match.games, DEFAULT_PLAYER_1_ID)
  const player2Wins = getGameWins(match.games, DEFAULT_PLAYER_2_ID)
  const gamesToWin = getGamesToWin(match.matchLength)
  const gamesPlayed = player1Wins + player2Wins
  const isCompleted = match.status === 'completed'
  const player1Won = match.winnerId === DEFAULT_PLAYER_1_ID

  const linkTo = isCompleted
    ? `/matches/${match.id}`
    : `/matches/${match.id}/score`

  return (
    <Link
      to={linkTo}
      className="block card bg-base-200/50 border border-base-300 hover:bg-base-200 active:scale-[0.98] active:bg-base-300/50 transition-all duration-150"
    >
      <div className="card-body p-4">
        {/* Row 1: Score and status */}
        <div className="flex items-center justify-between">
          {/* Score display */}
          <div className="flex items-center">
            <span className="text-sm font-medium text-base-content w-8">You</span>
            <span
              className={`text-2xl font-bold tabular-nums w-6 text-center ${
                isCompleted && player1Won ? 'text-success' : ''
              }`}
            >
              {player1Wins}
            </span>
            <span className="text-base-content/30 mx-2">–</span>
            <span
              className={`text-2xl font-bold tabular-nums w-6 text-center ${
                isCompleted && !player1Won ? 'text-success' : ''
              }`}
            >
              {player2Wins}
            </span>
            <span className="text-sm text-base-content/50 w-12 text-right">Opponent</span>
          </div>

          {/* Status badge */}
          {isCompleted ? (
            <span
              className={`badge badge-sm ${player1Won ? 'badge-success' : 'badge-error badge-outline'}`}
            >
              {player1Won ? 'Won' : 'Lost'}
            </span>
          ) : (
            <span className="badge badge-warning badge-sm">In progress</span>
          )}
        </div>

        {/* Row 2: Match info */}
        <div className="mt-1">
          <span className="text-xs text-base-content/50">
            Best of {match.matchLength} · First to {gamesToWin}
          </span>
        </div>

        {/* Progress indicator for in-progress matches */}
        {!isCompleted && (
          <div className="mt-2">
            <GameProgressBar
              gamesPlayed={gamesPlayed}
              totalGames={match.matchLength}
              player1Wins={player1Wins}
              player2Wins={player2Wins}
            />
          </div>
        )}
      </div>
    </Link>
  )
}

interface GameProgressBarProps {
  gamesPlayed: number
  totalGames: number
  player1Wins: number
  player2Wins: number
}

function GameProgressBar({
  totalGames,
  player1Wins,
  player2Wins,
}: GameProgressBarProps) {
  const gamesPlayed = player1Wins + player2Wins
  return (
    <div
      className="flex gap-1"
      role="progressbar"
      aria-valuenow={gamesPlayed}
      aria-valuemin={0}
      aria-valuemax={totalGames}
    >
      {Array.from({ length: totalGames }).map((_, i) => {
        let segmentClass = 'bg-base-300' // Unplayed
        if (i < player1Wins) {
          segmentClass = 'bg-success' // Player 1 win
        } else if (i < player1Wins + player2Wins) {
          segmentClass = 'bg-error/70' // Player 2 win
        }
        return (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${segmentClass} transition-colors`}
          />
        )
      })}
    </div>
  )
}

export default MatchList
export { MatchCard }
