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
  player1: Player
  player2: Player
  onSave: (score: GameScore) => void
  onCancel: () => void
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
    errors.general = 'Scores cannot be tied. Enter a winner.'
    return { valid: false, errors }
  }

  return { valid: true, num1, num2 }
}

const GameScoreForm: FC<GameScoreFormProps> = ({
  gameNumber,
  player1,
  player2,
  onSave,
  onCancel,
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">Enter score</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Game {gameNumber} · {player1.name} vs {player2.name}
        </p>
      </div>

      {/* Score inputs card */}
      <div className="card bg-base-200/50 border border-base-300">
        <div className="card-body p-4 gap-4">
          <span className="text-xs font-medium text-base-content/50 uppercase tracking-wide">
            Game score
          </span>
          <div className="flex flex-col gap-3">
            <PlayerScoreInput
              playerName={player1.name}
              playerId={player1.id}
              value={score1}
              onChange={handleScore1Change}
              error={errors.score1}
              disabled={disabled}
            />
            <PlayerScoreInput
              playerName={player2.name}
              playerId={player2.id}
              value={score2}
              onChange={handleScore2Change}
              error={errors.score2}
              disabled={disabled}
            />
          </div>
          <p className="text-xs text-base-content/50 text-center mt-2">
            First to 11, win by 2. You can override if needed.
          </p>
        </div>
      </div>

      {/* Winner summary */}
      <WinnerSummary
        player1={player1}
        player2={player2}
        score1={score1}
        score2={score2}
      />

      {/* General error */}
      {errors.general && (
        <p className="text-error text-sm text-center" role="alert">
          {errors.general}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          type="submit"
          className="btn btn-primary btn-block h-12"
          disabled={disabled || !canSubmit}
        >
          Save game
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={onCancel}
          disabled={disabled}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default GameScoreForm
