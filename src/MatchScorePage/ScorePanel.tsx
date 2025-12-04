import { type FC } from 'react'

interface ScorePanelProps {
  label: string
  score: number
  isServing: boolean
  isWinner?: boolean
  onTap: () => void
}

const ScorePanel: FC<ScorePanelProps> = ({
  label,
  score,
  isServing,
  isWinner = false,
  onTap,
}) => {
  return (
    <button
      type="button"
      onClick={onTap}
      className={`flex-1 flex flex-col items-center justify-center gap-2 py-8 transition-colors active:bg-base-300 ${
        isWinner ? 'bg-success/10' : 'bg-base-200'
      }`}
      aria-label={`Add point to ${label}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-base-content/70 uppercase tracking-wide">
          {label}
        </span>
        {isServing && (
          <span
            className="w-2 h-2 rounded-full bg-primary"
            aria-label="Serving"
          />
        )}
      </div>
      <span className="text-7xl font-bold tabular-nums">{score}</span>
    </button>
  )
}

export default ScorePanel
