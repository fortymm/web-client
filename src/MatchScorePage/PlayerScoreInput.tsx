import { type FC, type ChangeEvent } from 'react'

interface PlayerScoreInputProps {
  playerName: string
  playerId: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

const PlayerScoreInput: FC<PlayerScoreInputProps> = ({
  playerName,
  playerId,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const inputId = `score-${playerId}`

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '')
    onChange(newValue)
  }

  const handleIncrement = () => {
    const current = parseInt(value, 10) || 0
    onChange(String(current + 1))
  }

  const handleDecrement = () => {
    const current = parseInt(value, 10) || 0
    if (current > 0) {
      onChange(String(current - 1))
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor={inputId}
          className="text-base font-medium text-base-content flex-1 min-w-0 truncate"
        >
          {playerName}
        </label>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className="btn btn-ghost btn-square min-h-[48px] min-w-[48px] text-xl"
            onClick={handleDecrement}
            disabled={disabled || parseInt(value, 10) <= 0}
            aria-label={`Decrease ${playerName} score`}
          >
            −
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id={inputId}
            name={inputId}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={`input input-bordered w-18 h-14 text-center text-2xl font-semibold ${
              error ? 'input-error' : ''
            }`}
            aria-describedby={error ? `${inputId}-error` : undefined}
            aria-invalid={error ? 'true' : undefined}
          />
          <button
            type="button"
            className="btn btn-ghost btn-square min-h-[48px] min-w-[48px] text-xl"
            onClick={handleIncrement}
            disabled={disabled}
            aria-label={`Increase ${playerName} score`}
          >
            +
          </button>
        </div>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-error text-sm text-right">
          {error}
        </p>
      )}
    </div>
  )
}

export default PlayerScoreInput
