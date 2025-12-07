import { type FC, useState } from 'react'
import CTAPanel from '../CTAPanel'
import PlayerScoreInput from './PlayerScoreInput'

interface Player {
  id: string
  name: string
}

interface GameScore {
  player1Score: number
  player2Score: number
  winnerId: string
}

interface MatchState {
  player1Wins: number
  player2Wins: number
  gamesToWin: number
}

interface GameScoreFormProps {
  gameNumber: number
  totalGames?: number
  player1: Player
  player2: Player
  matchState?: MatchState
  onSave: (score: GameScore) => void
  onCancel: () => void
  disabled?: boolean
}

interface FormErrors {
  score1?: string
  score2?: string
  general?: string
}

function getMatchContextMessage(matchState: MatchState): string | null {
  const { player1Wins, player2Wins, gamesToWin } = matchState
  const player1NeedsToWin = gamesToWin - player1Wins
  const player2NeedsToWin = gamesToWin - player2Wins

  // First game - no context needed, header shows "First to X wins"
  if (player1Wins === 0 && player2Wins === 0) {
    return null
  }

  if (player1Wins > player2Wins) {
    // Ahead
    if (player1NeedsToWin === 1) {
      return `You lead ${player1Wins}–${player2Wins}. Win 1 more game to win the match.`
    }
    return `You lead ${player1Wins}–${player2Wins} in the match.`
  }

  if (player1Wins === player2Wins) {
    // Tied
    if (player1NeedsToWin === 1) {
      return `Match tied ${player1Wins}–${player2Wins}. Winner of this game wins the match.`
    }
    return `Match tied ${player1Wins}–${player2Wins}.`
  }

  // Behind
  return `You trail ${player1Wins}–${player2Wins}. You need ${player2NeedsToWin} more game win${player2NeedsToWin > 1 ? 's' : ''} to take the match.`
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
  matchState,
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

  const isTied = score1 !== '' && score2 !== '' && score1 === score2
  const hasError = errors.general || isTied

  // Build context string
  const gameContext = totalGames
    ? `Game ${gameNumber} of ${totalGames}`
    : `Game ${gameNumber}`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-40">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">Enter score</h2>
        <p className="text-sm text-base-content/60 mt-1">
          {gameContext} · {player1.name} vs {player2.name}
        </p>
      </div>

      {/* Score inputs card */}
      <div
        className={`card bg-base-200/50 border transition-colors -mt-2 ${
          hasError ? 'border-error/50' : 'border-base-300'
        }`}
      >
        <div className="card-body p-4 gap-3">
          <span className="text-xs text-base-content/50">Game score</span>
          <div className="flex flex-col gap-1">
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
        </div>
      </div>

      {/* Match context or validation error */}
      <div className="text-center">
        {errors.general || isTied ? (
          <p className="text-error text-sm" role="alert">
            Game scores must have a winner.
          </p>
        ) : (
          matchState && getMatchContextMessage(matchState) && (
            <p className="text-xs text-base-content/50">
              {getMatchContextMessage(matchState)}
            </p>
          )
        )}
      </div>

      <CTAPanel>
        <button
          type="submit"
          className="btn btn-primary btn-block h-12"
          disabled={disabled}
        >
          Save score
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={onCancel}
          disabled={disabled}
        >
          Cancel
        </button>
      </CTAPanel>
    </form>
  )
}

export default GameScoreForm
