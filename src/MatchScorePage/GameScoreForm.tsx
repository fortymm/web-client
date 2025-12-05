import { type FC, useState } from 'react'
import PlayerScoreInput from './PlayerScoreInput'
import WinnerSummary from './WinnerSummary'

interface Player {
  id: string
  name: string
}

interface GameScore {
  player1Score: number
  player2Score: number
  winnerId: string
}

interface GameScoreFormProps {
  gameNumber: number
  totalGames?: number
  player1: Player
  player2: Player
  onSave: (score: GameScore) => void
  disabled?: boolean
}

interface FormErrors {
  score1?: string
  score2?: string
  general?: string
}

function validateForm(
  score1: string,
  score2: string
): { valid: true; num1: number; num2: number } | { valid: false; errors: FormErrors } {
  const errors: FormErrors = {}

  if (score1 === '') {
    errors.score1 = 'Enter a score'
  }
  if (score2 === '') {
    errors.score2 = 'Enter a score'
  }

  if (errors.score1 || errors.score2) {
    return { valid: false, errors }
  }

  const num1 = parseInt(score1, 10)
  const num2 = parseInt(score2, 10)

  if (num1 === num2) {
    errors.general = 'Game scores must have a winner. Adjust one of the scores.'
    return { valid: false, errors }
  }

  return { valid: true, num1, num2 }
}

const GameScoreForm: FC<GameScoreFormProps> = ({
  gameNumber,
  totalGames,
  player1,
  player2,
  onSave,
  disabled = false,
}) => {
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    const result = validateForm(score1, score2)

    if (!result.valid) {
      setErrors(result.errors)
      return
    }

    setErrors({})
    const winnerId = result.num1 > result.num2 ? player1.id : player2.id

    onSave({
      player1Score: result.num1,
      player2Score: result.num2,
      winnerId,
    })
  }

  const handleScore1Change = (value: string) => {
    setScore1(value)
    if (submitted && errors.score1) {
      setErrors((prev) => ({ ...prev, score1: undefined }))
    }
  }

  const handleScore2Change = (value: string) => {
    setScore2(value)
    if (submitted && errors.score2) {
      setErrors((prev) => ({ ...prev, score2: undefined }))
    }
  }

  const canSubmit = score1 !== '' && score2 !== ''
  const isTied = score1 !== '' && score2 !== '' && score1 === score2
  const hasError = errors.general || isTied

  // Build context string
  const gameContext = totalGames
    ? `Game ${gameNumber} of ${totalGames}`
    : `Game ${gameNumber}`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">Enter score</h2>
        <p className="text-sm text-base-content/60 mt-2">
          {gameContext} · {player1.name} vs {player2.name}
        </p>
      </div>

      {/* Score inputs card */}
      <div
        className={`card bg-base-200/50 border transition-colors ${
          hasError ? 'border-error/50' : 'border-base-300'
        }`}
      >
        <div className="card-body p-4 gap-4">
          <span className="text-xs font-medium text-base-content/50 tracking-wide">
            Game score
          </span>
          <div className="flex flex-col">
            <PlayerScoreInput
              playerName={player1.name}
              playerId={player1.id}
              value={score1}
              onChange={handleScore1Change}
              error={errors.score1}
              disabled={disabled}
            />
            <div className="divider my-2" />
            <PlayerScoreInput
              playerName={player2.name}
              playerId={player2.id}
              value={score2}
              onChange={handleScore2Change}
              error={errors.score2}
              disabled={disabled}
            />
          </div>
          <p className="text-[11px] text-base-content/40 text-center mt-1">
            Default: first to 11, win by 2. You can override if needed.
          </p>
        </div>
      </div>

      {/* Winner summary / validation feedback - reserve space */}
      <div className="min-h-[72px]">
        <WinnerSummary
          player1={player1}
          player2={player2}
          score1={score1}
          score2={score2}
        />
        {errors.general && !isTied && (
          <div
            className="bg-error/10 border border-error/20 rounded-lg p-3 text-center"
            role="alert"
          >
            <p className="text-error text-sm font-medium">{errors.general}</p>
          </div>
        )}
      </div>

      {/* Sticky CTA Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="container mx-auto max-w-md">
          <button
            type="submit"
            className="btn btn-primary btn-block h-12"
            disabled={disabled || !canSubmit}
          >
            Save score
          </button>
        </div>
      </div>
    </form>
  )
}

export default GameScoreForm
