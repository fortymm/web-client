import { type FC, type ChangeEvent, useRef } from 'react'

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
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '')
    onChange(newValue)
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center justify-between gap-4 p-3 -m-3 rounded-lg cursor-text ${
          disabled ? '' : 'hover:bg-base-300/30 active:bg-base-300/50'
        }`}
        onClick={handleContainerClick}
      >
        <label
          htmlFor={inputId}
          className="text-base font-medium text-base-content flex-1 min-w-0 truncate cursor-text"
        >
          {playerName}
        </label>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id={inputId}
          name={inputId}
          value={value}
          placeholder="0"
          onChange={handleChange}
          disabled={disabled}
          className={`input input-bordered w-20 h-14 text-center text-3xl font-bold placeholder:text-base-content/20 placeholder:text-2xl placeholder:font-normal ${
            error ? 'input-error' : ''
          }`}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={error ? 'true' : undefined}
        />
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
