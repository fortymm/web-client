import { useState } from 'react'
import { type StoredMatch } from '@lib/matchesDb'
import { getGameWins } from './MatchScorePage/useSaveGame'
import { formatRelativeTime } from '@lib/formatRelativeTime'

const DEFAULT_PLAYER_1_ID = 'player-1'
const DEFAULT_PLAYER_2_ID = 'player-2'

export interface InProgressMatchModalProps {
  match: StoredMatch
  opponentName?: string
  isOpen: boolean
  onContinue: () => void
  onEndMatch: () => void
  onClose: () => void
}

function InProgressMatchModal({
  match,
  opponentName = 'Opponent',
  isOpen,
  onContinue,
  onEndMatch,
  onClose,
}: InProgressMatchModalProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const player1Wins = getGameWins(match.games, DEFAULT_PLAYER_1_ID)
  const player2Wins = getGameWins(match.games, DEFAULT_PLAYER_2_ID)
  const gamesPlayed = player1Wins + player2Wins
  const startedAt = formatRelativeTime(
    match.createdAt instanceof Date
      ? match.createdAt.toISOString()
      : match.createdAt
  )

  const matchLengthText =
    match.matchLength === 1 ? 'Single game' : `Best of ${match.matchLength}`

  const handleEndMatchClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmEnd = () => {
    setShowConfirm(false)
    onEndMatch()
  }

  const handleCancelConfirm = () => {
    setShowConfirm(false)
  }

  const handleClose = () => {
    setShowConfirm(false)
    onClose()
  }

  return (
    <dialog
      className={`modal modal-bottom sm:modal-middle ${isOpen ? 'modal-open' : ''}`}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-box max-w-sm">
        {showConfirm ? (
          <>
            <h3 className="font-bold text-lg">End match?</h3>
            <p className="py-4 text-base-content/70">
              This can't be undone. The match will be removed from your history.
            </p>
            <div className="modal-action flex-col gap-2">
              <button
                className="btn btn-error btn-block"
                onClick={handleConfirmEnd}
              >
                End match
              </button>
              <button
                className="btn btn-ghost btn-block"
                onClick={handleCancelConfirm}
              >
                Go back
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-bold text-lg">Match in progress</h3>
            <p className="text-sm text-base-content/70 mt-1">
              You can't start a new match until you finish or end the current
              one.
            </p>

            {/* Match card - same styling as MatchList */}
            <div className="py-4">
              <div className="card bg-base-200/50 border border-base-300">
                <div className="card-body p-4">
                  {/* Row 1: Score and status */}
                  <div className="flex items-center justify-between">
                    {/* Score display */}
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-base-content w-8">
                        You
                      </span>
                      <span className="text-2xl font-bold tabular-nums w-6 text-center">
                        {player1Wins}
                      </span>
                      <span className="text-base-content/30 mx-2">–</span>
                      <span className="text-2xl font-bold tabular-nums w-6 text-center">
                        {player2Wins}
                      </span>
                      <span className="text-sm text-base-content/50 w-16 text-right truncate">
                        {opponentName}
                      </span>
                    </div>

                    {/* Status badge */}
                    <span className="badge badge-warning badge-sm">
                      In progress
                    </span>
                  </div>

                  {/* Row 2: Match info */}
                  <div className="mt-1 flex items-center gap-2 text-xs text-base-content/50">
                    <span>{matchLengthText}</span>
                    <span>·</span>
                    <span>Started {startedAt}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2">
                    <div
                      className="flex gap-1.5"
                      role="progressbar"
                      aria-valuenow={gamesPlayed}
                      aria-valuemin={0}
                      aria-valuemax={match.matchLength}
                    >
                      {Array.from({ length: match.matchLength }).map((_, i) => {
                        let segmentClass =
                          'bg-base-300 border border-base-content/10'
                        if (i < player1Wins) {
                          segmentClass = 'bg-success border border-success'
                        } else if (i < player1Wins + player2Wins) {
                          segmentClass = 'bg-error/70 border border-error/50'
                        }
                        return (
                          <div
                            key={i}
                            className={`h-2 flex-1 rounded ${segmentClass} transition-colors`}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action flex-col gap-2">
              <button
                className="btn btn-primary btn-block"
                onClick={onContinue}
              >
                Resume match
              </button>
              <button className="btn btn-ghost btn-block" onClick={handleClose}>
                Cancel
              </button>
              <button
                className="btn btn-link btn-block text-error no-underline hover:underline"
                onClick={handleEndMatchClick}
              >
                End match
              </button>
            </div>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} aria-label="Close modal">
          close
        </button>
      </form>
    </dialog>
  )
}

export default InProgressMatchModal
