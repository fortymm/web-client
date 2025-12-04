import { type FC } from 'react'
import { MinusIcon } from '@heroicons/react/24/solid'

interface ScoreCardProps {
  gameNumber: number
  matchLength: number
  playerName: string
  opponentName: string
  playerScore: number
  opponentScore: number
  isGameComplete: boolean
  isMatchComplete: boolean
  onPlayerScoreChange: (delta: number) => void
  onOpponentScoreChange: (delta: number) => void
  onNextGame: () => void
  onEndMatch: () => void
}

const ScoreCard: FC<ScoreCardProps> = ({
  gameNumber,
  matchLength,
  playerName,
  opponentName,
  playerScore,
  opponentScore,
  isGameComplete,
  isMatchComplete,
  onPlayerScoreChange,
  onOpponentScoreChange,
  onNextGame,
  onEndMatch,
}) => {
  const playerWon = isGameComplete && playerScore > opponentScore
  const opponentWon = isGameComplete && opponentScore > playerScore
  const isDeuce = playerScore >= 10 && opponentScore >= 10

  // Determine status text (center of header)
  const getStatusText = () => {
    if (isGameComplete) {
      if (playerWon) return 'You win'
      return 'Opponent wins'
    }
    const diff = playerScore - opponentScore
    if (diff === 0) {
      if (playerScore === 0) return ''
      return `Tied ${playerScore}–${opponentScore}`
    }
    if (diff > 0) return `You lead by ${diff}`
    return `Opponent leads by ${Math.abs(diff)}`
  }

  // Helper text below scores
  const getHelperText = () => {
    if (isMatchComplete) {
      return playerWon ? 'Match complete – You win!' : 'Match complete – Opponent wins'
    }
    if (isGameComplete) {
      return playerWon ? 'Game complete – You win' : 'Game complete – Opponent wins'
    }
    if (isDeuce) {
      return 'Win by 2'
    }
    return 'To 11 · Win by 2'
  }

  // CTA button text
  const getCtaText = () => {
    if (isMatchComplete) {
      return 'Save match'
    }
    const isLastGame = gameNumber >= matchLength
    if (isLastGame) {
      return 'Save game & finish match'
    }
    return `Save game & start next`
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-base-100 border-t border-base-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-screen-sm mx-auto w-full px-4 pt-4 pb-5">
        {/* Card header: G# pill | Status | Edit (when complete) */}
        <div className="flex items-center justify-between mb-4">
          <span className="badge badge-sm badge-neutral">G{gameNumber}</span>
          <span className="text-sm text-base-content/70">
            {getStatusText()}
          </span>
          {/* Placeholder for Edit button - only when game is complete and saved */}
          <div className="w-12" />
        </div>

        {/* Two-column scoring area */}
        <div className="flex">
          {/* Player column */}
          <ScoreColumn
            name={playerName}
            score={playerScore}
            onIncrement={() => onPlayerScoreChange(1)}
            onDecrement={() => onPlayerScoreChange(-1)}
            disabled={isGameComplete}
            isWinner={playerWon}
          />

          {/* Vertical divider */}
          <div className="w-px bg-base-200 mx-2 self-stretch" />

          {/* Opponent column */}
          <ScoreColumn
            name={opponentName}
            score={opponentScore}
            onIncrement={() => onOpponentScoreChange(1)}
            onDecrement={() => onOpponentScoreChange(-1)}
            disabled={isGameComplete}
            isWinner={opponentWon}
          />
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-base-content/50 mt-4">
          {getHelperText()}
        </p>

        {/* Primary CTA when game is complete */}
        {isGameComplete && (
          <button
            type="button"
            onClick={isMatchComplete ? onEndMatch : onNextGame}
            className="btn btn-primary btn-block h-12 mt-4"
          >
            {getCtaText()}
          </button>
        )}

        {/* End match early - link style */}
        {!isGameComplete && (
          <button
            type="button"
            onClick={onEndMatch}
            className="block mx-auto mt-4 text-sm text-base-content/50 underline underline-offset-2 hover:text-base-content/70 transition-colors"
          >
            End match early
          </button>
        )}
      </div>
    </div>
  )
}

interface ScoreColumnProps {
  name: string
  score: number
  onIncrement: () => void
  onDecrement: () => void
  disabled: boolean
  isWinner: boolean
}

const ScoreColumn: FC<ScoreColumnProps> = ({
  name,
  score,
  onIncrement,
  onDecrement,
  disabled,
  isWinner,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Label */}
      <span className={`text-sm font-medium mb-2 ${isWinner ? 'text-success' : 'text-base-content/70'}`}>
        {name}
      </span>

      {/* Large score */}
      <span className={`text-5xl font-bold tabular-nums mb-3 ${isWinner ? 'text-success' : ''}`}>
        {score}
      </span>

      {/* Button row: - button (left) + button (right, wider) */}
      <div className="flex items-center gap-2 w-full justify-center">
        {/* Decrement button - ghost style, 40x40 min tap area */}
        <button
          type="button"
          onClick={onDecrement}
          disabled={disabled || score <= 0}
          className="btn btn-ghost btn-square h-11 w-11 min-h-[44px] min-w-[44px] border border-base-300 disabled:opacity-30 disabled:border-base-200"
          aria-label={`Decrease ${name} score`}
        >
          <MinusIcon className="w-5 h-5" />
        </button>

        {/* Increment button - primary, wide */}
        <button
          type="button"
          onClick={onIncrement}
          disabled={disabled}
          className="btn btn-primary flex-1 h-12 text-2xl font-bold disabled:opacity-30"
          aria-label={`Add point for ${name}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default ScoreCard
