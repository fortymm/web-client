import { type FC } from 'react'

export type MatchLength = 1 | 3 | 5 | 7

interface MatchLengthControlProps {
  value: MatchLength
  onChange: (value: MatchLength) => void
  disabled?: boolean
}

const MATCH_LENGTHS: MatchLength[] = [1, 3, 5, 7]

const MatchLengthControl: FC<MatchLengthControlProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-base-content/60">Match length</span>
      <div
        className="join w-full"
        role="group"
        aria-label="Match length selection"
      >
        {MATCH_LENGTHS.map((length) => (
          <input
            key={length}
            className={`join-item btn btn-sm flex-1 min-h-[44px] ${
              disabled ? 'btn-disabled' : ''
            }`}
            type="radio"
            name="match-length"
            aria-label={String(length)}
            checked={value === length}
            onChange={() => !disabled && onChange(length)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}

export default MatchLengthControl
