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
    <div className="space-y-6">
      {inProgressMatches.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-base-content/60 mb-2 px-1">
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
          <h2 className="text-sm font-semibold text-base-content/60 mb-2 px-1">
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
  const isCompleted = match.status === 'completed'
  const player1Won = match.winnerId === DEFAULT_PLAYER_1_ID

  const linkTo = isCompleted
    ? `/matches/${match.id}`
    : `/matches/${match.id}/score`

  return (
    <Link
      to={linkTo}
      className="block card bg-base-200/50 border border-base-300 hover:bg-base-200 transition-colors"
    >
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          {/* Score display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-base-content">You</span>
              <span
                className={`text-2xl font-bold ${
                  isCompleted && player1Won ? 'text-success' : ''
                }`}
              >
                {player1Wins}
              </span>
            </div>
            <span className="text-base-content/30">–</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${
                  isCompleted && !player1Won ? 'text-success' : ''
                }`}
              >
                {player2Wins}
              </span>
              <span className="text-sm text-base-content/60">Opp</span>
            </div>
          </div>

          {/* Status and action */}
          <div className="flex flex-col items-end gap-1">
            {isCompleted ? (
              <>
                <span className="badge badge-success badge-sm">
                  {player1Won ? 'Won' : 'Lost'}
                </span>
                <span className="text-xs text-base-content/50">
                  Best of {match.matchLength}
                </span>
              </>
            ) : (
              <>
                <span className="badge badge-warning badge-sm">In progress</span>
                <span className="text-xs text-base-content/50">
                  First to {gamesToWin}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Progress bar for in-progress matches */}
        {!isCompleted && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-base-content/50 mb-1">
              <span>
                {player1Wins + player2Wins} of {match.matchLength} games
              </span>
              <span>Tap to continue</span>
            </div>
            <progress
              className="progress progress-primary w-full h-1"
              value={player1Wins + player2Wins}
              max={match.matchLength}
            />
          </div>
        )}
      </div>
    </Link>
  )
}

export default MatchList
export { MatchCard }
