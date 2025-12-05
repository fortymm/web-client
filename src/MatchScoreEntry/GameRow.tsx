import { type FC, type ChangeEvent, useId } from 'react'
import type { GameScore, GameValidationResult, MatchConfig } from './types'

interface GameRowProps {
  gameNumber: number
  game: GameScore
  config: MatchConfig
  validation: GameValidationResult
  onChange: (game: GameScore) => void
  disabled?: boolean
}

const GameRow: FC<GameRowProps> = ({
  gameNumber,
  game,
  config,
  validation,
  onChange,
  disabled = false,
}) => {
  const baseId = useId()
  const youInputId = `${baseId}-you`
  const opponentInputId = `${baseId}-opponent`
  const statusId = `${baseId}-status`

  const handleYouScoreChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const score = value === '' ? null : parseInt(value, 10)
    onChange({
      ...game,
      youScore: isNaN(score as number) ? null : score,
    })
  }

  const handleOpponentScoreChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const score = value === '' ? null : parseInt(value, 10)
    onChange({
      ...game,
      opponentScore: isNaN(score as number) ? null : score,
    })
  }

  const getStatusText = (): string => {
    if (validation.error) {
      return validation.error
    }
    if (validation.winner === 'you') {
      return `Winner: ${config.playerYou.name}`
    }
    if (validation.winner === 'opponent') {
      return `Winner: ${config.playerOpponent.name}`
    }
    return 'Not played yet'
  }

  const hasScores = game.youScore !== null || game.opponentScore !== null
  const statusText = getStatusText()

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4 gap-3">
        <h3 className="text-sm font-semibold text-base-content/70">
          Game {gameNumber}
        </h3>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label
              htmlFor={youInputId}
              className="label pb-1"
            >
              <span className="label-text text-sm">{config.playerYou.name}</span>
            </label>
            <input
              id={youInputId}
              type="number"
              inputMode="numeric"
              min="0"
              className={`input input-bordered w-full text-center text-lg font-semibold ${
                validation.error ? 'input-error' : ''
              }`}
              value={game.youScore ?? ''}
              onChange={handleYouScoreChange}
              disabled={disabled}
              aria-describedby={statusId}
              aria-label={`Game ${gameNumber} - ${config.playerYou.name} score`}
            />
          </div>

          <span className="text-xl font-bold text-base-content/50 pt-7">–</span>

          <div className="flex-1">
            <label
              htmlFor={opponentInputId}
              className="label pb-1"
            >
              <span className="label-text text-sm">{config.playerOpponent.name}</span>
            </label>
            <input
              id={opponentInputId}
              type="number"
              inputMode="numeric"
              min="0"
              className={`input input-bordered w-full text-center text-lg font-semibold ${
                validation.error ? 'input-error' : ''
              }`}
              value={game.opponentScore ?? ''}
              onChange={handleOpponentScoreChange}
              disabled={disabled}
              aria-describedby={statusId}
              aria-label={`Game ${gameNumber} - ${config.playerOpponent.name} score`}
            />
          </div>
        </div>

        <p
          id={statusId}
          className={`text-sm ${
            validation.error
              ? 'text-error'
              : validation.winner
                ? 'text-success'
                : 'text-base-content/50'
          }`}
          role={validation.error ? 'alert' : undefined}
        >
          {hasScores || validation.winner ? statusText : 'Not played yet'}
        </p>
      </div>
    </div>
  )
}

export default GameRow
