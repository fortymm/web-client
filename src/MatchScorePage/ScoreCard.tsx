import { type FC } from 'react'
import { MinusIcon } from '@heroicons/react/24/solid'

interface ScoreCardProps {
  gameNumber: number
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
  // Determine status message
  const getStatusMessage = () => {
    if (isMatchComplete) {
      const playerWon = playerScore > opponentScore
      return playerWon ? 'Match complete • You won!' : 'Match complete • Opponent won'
    }
    if (isGameComplete) {
      const playerWon = playerScore > opponentScore
      return playerWon ? `G${gameNumber} complete • You won` : `G${gameNumber} complete • Opponent won`
    }
    const diff = playerScore - opponentScore
    if (diff === 0) return `G${gameNumber}`
    if (diff > 0) return `G${gameNumber} • You lead by ${diff}`
    return `G${gameNumber} • Opponent leads by ${Math.abs(diff)}`
  }

  return (
    <div className="bg-base-200 rounded-t-2xl px-4 pt-4 pb-6">
      {/* Status line */}
      <p className="text-center text-sm text-base-content/70 mb-4">
        {getStatusMessage()}
      </p>

      {/* Main scoring area */}
      <div className="flex gap-3">
        {/* Player side */}
        <ScoreSide
          name={playerName}
          score={playerScore}
          onIncrement={() => onPlayerScoreChange(1)}
          onDecrement={() => onPlayerScoreChange(-1)}
          disabled={isGameComplete}
          isWinner={isGameComplete && playerScore > opponentScore}
        />

        {/* Divider */}
        <div className="w-px bg-base-300 self-stretch" />

        {/* Opponent side */}
        <ScoreSide
          name={opponentName}
          score={opponentScore}
          onIncrement={() => onOpponentScoreChange(1)}
          onDecrement={() => onOpponentScoreChange(-1)}
          disabled={isGameComplete}
          isWinner={isGameComplete && opponentScore > playerScore}
        />
      </div>

      {/* Action area */}
      <div className="mt-5">
        {isMatchComplete ? (
          <button
            type="button"
            onClick={onEndMatch}
            className="btn btn-primary btn-block h-12"
          >
            Save Match
          </button>
        ) : isGameComplete ? (
          <button
            type="button"
            onClick={onNextGame}
            className="btn btn-primary btn-block h-12"
          >
            Save & Start Game {gameNumber + 1}
          </button>
        ) : (
          <button
            type="button"
            onClick={onEndMatch}
            className="btn btn-ghost btn-sm text-base-content/50 mx-auto block"
          >
            End match early
          </button>
        )}
      </div>
    </div>
  )
}

interface ScoreSideProps {
  name: string
  score: number
  onIncrement: () => void
  onDecrement: () => void
  disabled: boolean
  isWinner: boolean
}

const ScoreSide: FC<ScoreSideProps> = ({
  name,
  score,
  onIncrement,
  onDecrement,
  disabled,
  isWinner,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Name */}
      <span className={`text-sm font-medium mb-2 ${isWinner ? 'text-success' : 'text-base-content/70'}`}>
        {name}
      </span>

      {/* Score display */}
      <span className={`text-5xl font-bold tabular-nums mb-4 ${isWinner ? 'text-success' : ''}`}>
        {score}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Decrement button - smaller */}
        <button
          type="button"
          onClick={onDecrement}
          disabled={disabled || score <= 0}
          className="btn btn-ghost btn-sm btn-circle disabled:opacity-30"
          aria-label={`Decrease ${name} score`}
        >
          <MinusIcon className="w-4 h-4" />
        </button>

        {/* Increment button - BIG tappable area */}
        <button
          type="button"
          onClick={onIncrement}
          disabled={disabled}
          className="btn btn-primary btn-lg px-8 h-14 text-2xl font-bold disabled:opacity-30"
          aria-label={`Add point for ${name}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default ScoreCard
