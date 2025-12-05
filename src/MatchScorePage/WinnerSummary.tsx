import { type FC } from 'react'

interface Player {
  id: string
  name: string
}

interface WinnerSummaryProps {
  player1: Player
  player2: Player
  score1: string
  score2: string
}

type ValidationResult =
  | { status: 'empty' }
  | { status: 'tied' }
  | { status: 'valid'; winner: Player; winnerScore: number; loserScore: number }
  | { status: 'unusual'; winner: Player; winnerScore: number; loserScore: number }

function validateScores(
  player1: Player,
  player2: Player,
  score1: string,
  score2: string
): ValidationResult {
  const num1 = parseInt(score1, 10)
  const num2 = parseInt(score2, 10)

  if (isNaN(num1) || isNaN(num2) || score1 === '' || score2 === '') {
    return { status: 'empty' }
  }

  if (num1 === num2) {
    return { status: 'tied' }
  }

  const winner = num1 > num2 ? player1 : player2
  const winnerScore = Math.max(num1, num2)
  const loserScore = Math.min(num1, num2)

  // Standard table tennis: first to 11, win by 2
  const isStandardWin =
    winnerScore >= 11 && winnerScore - loserScore >= 2

  if (isStandardWin) {
    return { status: 'valid', winner, winnerScore, loserScore }
  }

  return { status: 'unusual', winner, winnerScore, loserScore }
}

const WinnerSummary: FC<WinnerSummaryProps> = ({
  player1,
  player2,
  score1,
  score2,
}) => {
  const result = validateScores(player1, player2, score1, score2)

  if (result.status === 'empty') {
    return null
  }

  if (result.status === 'tied') {
    return (
      <div
        className="bg-error/10 border border-error/20 rounded-lg p-3 text-center"
        role="alert"
      >
        <p className="text-error text-sm font-medium">
          Game scores must have a winner. Adjust one of the scores.
        </p>
      </div>
    )
  }

  const { winner, winnerScore, loserScore } = result

  return (
    <div className="flex flex-col gap-2">
      <div
        className="bg-success/10 border border-success/20 rounded-lg p-3 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-base-content/70">Winner</p>
        <p className="text-lg font-semibold text-success">{winner.name}</p>
        <p className="text-base-content/60 text-sm">
          {winnerScore}–{loserScore}
        </p>
      </div>
      {result.status === 'unusual' && (
        <p className="text-warning text-xs text-center">
          This score is unusual for standard rules (first to 11, win by 2).
        </p>
      )}
    </div>
  )
}

export default WinnerSummary
