import { type FC } from 'react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'

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
  onFinishMatch: () => void
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
  onFinishMatch,
}) => {
  const playerWon = isGameComplete && playerScore > opponentScore
  const opponentWon = isGameComplete && opponentScore > playerScore
  const isDeuce = playerScore >= 10 && opponentScore >= 10
  const isLastGame = gameNumber >= matchLength

  // Determine status text (centered in header)
  const getStatusText = () => {
    if (isGameComplete) {
      if (playerWon) return 'You win'
      return 'Opponent wins'
    }
    const diff = playerScore - opponentScore
    if (diff === 0) {
      if (playerScore === 0) return ''
      return `Tied at ${playerScore}–${opponentScore}`
    }
    if (diff > 0) return `You lead by ${diff}`
    return `Opponent leads by ${Math.abs(diff)}`
  }

  // Caption text under button - rules when in progress, completion status when done
  const getCaptionText = () => {
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
    if (isMatchComplete || isLastGame) {
      return 'Save game & finish match'
    }
    return 'Save game & start next'
  }

  const handleCtaClick = () => {
    if (isMatchComplete || isLastGame) {
      onFinishMatch()
    } else {
      onNextGame()
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-base-100 border-t border-base-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-screen-sm mx-auto w-full px-4 pt-4 pb-4">
        {/* Status line - centered */}
        <div className="text-center mb-4">
          <span className="text-sm text-base-content/70">
            {getStatusText()}
          </span>
        </div>

        {/* Two-column scoring area */}
        <div className="flex">
          {/* Player column */}
          <ScoreColumn
            name={playerName}
            score={playerScore}
            onIncrement={() => onPlayerScoreChange(1)}
            onDecrement={() => onPlayerScoreChange(-1)}
            isWinner={playerWon}
          />

          {/* Vertical divider */}
          <div className="w-px bg-base-200 mx-3 self-stretch" />

          {/* Opponent column */}
          <ScoreColumn
            name={opponentName}
            score={opponentScore}
            onIncrement={() => onOpponentScoreChange(1)}
            onDecrement={() => onOpponentScoreChange(-1)}
            isWinner={opponentWon}
          />
        </div>

        {/* CTA button - always present, disabled when game in progress */}
        <button
          type="button"
          onClick={handleCtaClick}
          disabled={!isGameComplete}
          className={`btn btn-block h-12 mt-4 ${
            isGameComplete
              ? 'btn-primary'
              : 'btn-ghost border border-base-300 text-base-content/50'
          }`}
        >
          {getCtaText()}
        </button>

        {/* Caption under button - rules or completion status */}
        <p className="text-center text-xs text-base-content/50 mt-2">
          {getCaptionText()}
        </p>
      </div>
    </div>
  )
}

interface ScoreColumnProps {
  name: string
  score: number
  onIncrement: () => void
  onDecrement: () => void
  isWinner: boolean
}

const ScoreColumn: FC<ScoreColumnProps> = ({
  name,
  score,
  onIncrement,
  onDecrement,
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

      {/* Button row: equal-weight - and + buttons */}
      <div className="flex items-center gap-2 w-full px-2">
        {/* Decrement button - secondary/ghost style, equal height */}
        <button
          type="button"
          onClick={onDecrement}
          disabled={score <= 0}
          className="btn btn-ghost flex-1 h-12 min-h-[48px] border border-base-300 disabled:opacity-30 disabled:border-base-200"
          aria-label={`Decrease ${name} score`}
        >
          <MinusIcon className="w-5 h-5" />
        </button>

        {/* Increment button - primary, equal height */}
        <button
          type="button"
          onClick={onIncrement}
          className="btn btn-primary flex-1 h-12 min-h-[48px]"
          aria-label={`Add point for ${name}`}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default ScoreCard
