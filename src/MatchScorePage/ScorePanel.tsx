import { type FC } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'

interface ScorePanelProps {
  playerName: string
  score: number
  isServing: boolean
  isWinner?: boolean
  onTap: () => void
  disabled?: boolean
}

const ScorePanel: FC<ScorePanelProps> = ({
  playerName,
  score,
  isServing,
  isWinner = false,
  onTap,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={disabled}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-6 transition-all active:scale-[0.98] active:bg-base-300 disabled:opacity-50 disabled:active:scale-100 ${
        isWinner ? 'bg-success/10' : 'bg-base-200 hover:bg-base-300/50'
      }`}
      aria-label={`Add point to ${playerName}`}
    >
      {/* Player name */}
      <span className="text-sm font-semibold text-base-content/80 truncate max-w-[140px]">
        {playerName}
      </span>

      {/* Serving indicator */}
      {isServing && (
        <span className="flex items-center gap-1 text-xs text-primary font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Serving
        </span>
      )}
      {!isServing && <span className="h-4" />}

      {/* Score */}
      <span className="text-7xl font-bold tabular-nums leading-none my-2">{score}</span>

      {/* Tap affordance */}
      {!disabled && (
        <span className="flex items-center gap-1 text-xs text-base-content/40 font-medium">
          <PlusIcon className="w-3 h-3" />
          Tap to score
        </span>
      )}
    </button>
  )
}

export default ScorePanel
