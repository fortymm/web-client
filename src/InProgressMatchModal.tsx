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
  onEndAndStartNew: () => void
  onClose: () => void
}

function InProgressMatchModal({
  match,
  opponentName = 'Opponent',
  isOpen,
  onContinue,
  onEndAndStartNew,
  onClose,
}: InProgressMatchModalProps) {
  const player1Wins = getGameWins(match.games, DEFAULT_PLAYER_1_ID)
  const player2Wins = getGameWins(match.games, DEFAULT_PLAYER_2_ID)
  const score = `${player1Wins}-${player2Wins}`
  const startedAt = formatRelativeTime(
    match.createdAt instanceof Date
      ? match.createdAt.toISOString()
      : match.createdAt
  )

  return (
    <dialog
      className={`modal modal-bottom sm:modal-middle ${isOpen ? 'modal-open' : ''}`}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">You have a match in progress</h3>

        <div className="py-4">
          <div className="flex items-center gap-3 bg-base-200 rounded-lg p-4">
            <div className="flex-1">
              <p className="font-medium">vs {opponentName}</p>
              <p className="text-sm text-base-content/60">
                {score} · started {startedAt}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-action flex-col gap-2">
          <button
            className="btn btn-primary btn-block"
            onClick={onContinue}
          >
            Continue that match
          </button>
          <button
            className="btn btn-outline btn-block"
            onClick={onEndAndStartNew}
          >
            End it and start new
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} aria-label="Close modal">close</button>
      </form>
    </dialog>
  )
}

export default InProgressMatchModal
