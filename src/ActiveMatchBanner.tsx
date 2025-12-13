import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { type StoredMatch } from '@lib/matchesDb'
import { getGameWins } from './MatchScorePage/useSaveGame'

const DEFAULT_PLAYER_1_ID = 'player-1'
const DEFAULT_PLAYER_2_ID = 'player-2'

interface ActiveMatchBannerProps {
  match: StoredMatch
  onEndMatch: () => void
}

function ActiveMatchBanner({ match, onEndMatch }: ActiveMatchBannerProps) {
  const navigate = useNavigate()
  const modalRef = useRef<HTMLDialogElement>(null)

  const player1Wins = getGameWins(match.games, DEFAULT_PLAYER_1_ID)
  const player2Wins = getGameWins(match.games, DEFAULT_PLAYER_2_ID)

  const matchLengthLabel = match.matchLength === 1 ? 'Single' : `Bo${match.matchLength}`

  const handleBannerClick = () => {
    navigate(`/matches/${match.id}/score`)
  }

  const handleEndClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    modalRef.current?.showModal()
  }

  const handleConfirmEnd = () => {
    modalRef.current?.close()
    onEndMatch()
  }

  const handleCancelEnd = () => {
    modalRef.current?.close()
  }

  return (
    <>
      <div
        role="banner"
        onClick={handleBannerClick}
        className="w-full bg-base-200/40 cursor-pointer hover:bg-base-200/70 active:bg-base-200 transition-colors"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2">
          {/* Match info - single row */}
          <div className="flex items-center gap-2 min-w-0 text-sm">
            <span className="text-base-content/60">Match in progress</span>
            <span className="text-base-content/30">•</span>
            <span className="font-medium whitespace-nowrap">
              You vs Opp
              <span className="text-base-content/30 mx-1.5">•</span>
              <span className="tabular-nums font-bold">{player1Wins}–{player2Wins}</span>
              <span className="text-base-content/30 mx-1.5">•</span>
              <span className="text-base-content/60">{matchLengthLabel}</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleBannerClick}
              className="btn btn-primary btn-sm"
            >
              Resume
            </button>
            <button
              onClick={handleEndClick}
              className="text-sm text-base-content/50 hover:text-error transition-colors"
            >
              End
            </button>
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">End this match?</h3>
          <p className="py-4 text-base-content/70">
            This will delete the match. You can only have one active match at a time.
          </p>
          <div className="modal-action">
            <button onClick={handleCancelEnd} className="btn">
              Cancel
            </button>
            <button onClick={handleConfirmEnd} className="btn btn-error">
              End match
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default ActiveMatchBanner
