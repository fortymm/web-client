import { type FC } from 'react'
import { MinusIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/solid'

interface GameScoreRowProps {
  gameNumber: number
  playerScore: number
  opponentScore: number
  playerName: string
  opponentName: string
  isComplete: boolean
  isActive: boolean
  isDisabled: boolean
  onPlayerScoreChange: (delta: number) => void
  onOpponentScoreChange: (delta: number) => void
}

const GameScoreRow: FC<GameScoreRowProps> = ({
  gameNumber,
  playerScore,
  opponentScore,
  playerName,
  opponentName,
  isComplete,
  isActive,
  isDisabled,
  onPlayerScoreChange,
  onOpponentScoreChange,
}) => {
  const playerWon = isComplete && playerScore > opponentScore
  const opponentWon = isComplete && opponentScore > playerScore

  return (
    <div
      className={`flex items-center gap-2 px-3 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary/10 ring-1 ring-primary/30'
          : isComplete
            ? 'bg-base-200/50'
            : 'bg-base-100'
      } ${isDisabled ? 'opacity-40' : ''}`}
      role="group"
      aria-label={`Game ${gameNumber}`}
    >
      {/* Game number */}
      <span className="w-8 text-sm font-bold text-base-content/50">
        G{gameNumber}
      </span>

      {/* Player score */}
      <div className="flex-1 flex items-center justify-end gap-1">
        <span className={`text-xs truncate max-w-[60px] ${playerWon ? 'text-success font-semibold' : 'text-base-content/60'}`}>
          {playerName}
        </span>
        <ScoreStepper
          value={playerScore}
          onIncrement={() => onPlayerScoreChange(1)}
          onDecrement={() => onPlayerScoreChange(-1)}
          disabled={isDisabled}
          highlight={playerWon}
        />
      </div>

      {/* Separator */}
      <span className="text-base-content/30 text-sm">–</span>

      {/* Opponent score */}
      <div className="flex-1 flex items-center gap-1">
        <ScoreStepper
          value={opponentScore}
          onIncrement={() => onOpponentScoreChange(1)}
          onDecrement={() => onOpponentScoreChange(-1)}
          disabled={isDisabled}
          highlight={opponentWon}
        />
        <span className={`text-xs truncate max-w-[60px] ${opponentWon ? 'text-success font-semibold' : 'text-base-content/60'}`}>
          {opponentName}
        </span>
      </div>

      {/* Status indicator */}
      <div className="w-6 flex justify-center">
        {isComplete && (
          <CheckIcon className="w-4 h-4 text-success" aria-label="Game complete" />
        )}
        {isActive && !isComplete && (
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-label="Current game" />
        )}
      </div>
    </div>
  )
}

interface ScoreStepperProps {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  disabled: boolean
  highlight: boolean
}

const ScoreStepper: FC<ScoreStepperProps> = ({
  value,
  onIncrement,
  onDecrement,
  disabled,
  highlight,
}) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled || value <= 0}
        className="btn btn-ghost btn-xs btn-square disabled:opacity-30"
        aria-label="Decrease score"
      >
        <MinusIcon className="w-3 h-3" />
      </button>
      <span
        className={`w-8 text-center text-lg font-bold tabular-nums ${
          highlight ? 'text-success' : ''
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        className="btn btn-ghost btn-xs btn-square disabled:opacity-30"
        aria-label="Increase score"
      >
        <PlusIcon className="w-3 h-3" />
      </button>
    </div>
  )
}

export default GameScoreRow
