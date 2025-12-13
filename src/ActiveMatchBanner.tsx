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
        className="w-full bg-base-200/50 border border-base-300 cursor-pointer hover:bg-base-200/70 active:bg-base-200 transition-colors"
      >
        <div className="flex items-center gap-4 px-4 py-2.5">
          {/* Left group: pill + summary - truncates on overflow */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="badge badge-sm badge-ghost border-base-content/20 whitespace-nowrap">In progress</span>
            <span className="text-sm font-medium truncate">
              You vs Opp
              <span className="text-base-content/40 mx-1.5">•</span>
              <span className="tabular-nums font-bold">{player1Wins}–{player2Wins}</span>
              <span className="text-base-content/40 mx-1.5 hidden sm:inline">•</span>
              <span className="text-base-content/70 hidden sm:inline">{matchLengthLabel}</span>
            </span>
          </div>

          {/* Right group: actions - never shrinks */}
          <div className="flex items-center gap-3 flex-none">
            <button
              onClick={handleBannerClick}
              className="btn btn-primary btn-sm"
            >
              Resume
            </button>
            <button
              onClick={handleEndClick}
              className="text-sm text-base-content/50 hover:text-error transition-colors whitespace-nowrap"
            >
              Abort
            </button>
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box relative">
          <button
            onClick={handleCancelEnd}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="Close"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg pr-8">Abort this match?</h3>
          <div className="mt-2 mb-1">
            <p className="text-sm font-medium text-base-content">
              You vs Opp
              <span className="text-base-content/40 mx-1.5">·</span>
              <span className="tabular-nums font-bold">{player1Wins}–{player2Wins}</span>
            </p>
          </div>
          <p className="py-2 text-base-content/70">
            This will mark the match as aborted. It will stay in your history, but you can’t resume it.
          </p>
          <div className="modal-action gap-2 mt-4 flex-col sm:flex-row">
            <button onClick={handleCancelEnd} className="btn btn-primary w-full sm:w-auto">
              Resume match
            </button>
            <button onClick={handleConfirmEnd} className="btn btn-outline btn-error w-full sm:w-auto">
              Abort match
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
