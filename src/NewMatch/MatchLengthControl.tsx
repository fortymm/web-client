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
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-base-content/50">Match length</span>
      <div
        className="join w-full"
        role="group"
        aria-label="Match length selection"
      >
        {MATCH_LENGTHS.map((length) => (
          <label
            key={length}
            className={`join-item btn btn-sm flex-1 min-h-[44px] has-[:checked]:btn-primary has-[:checked]:text-primary-content ${
              disabled ? 'btn-disabled' : ''
            }`}
          >
            <input
              type="radio"
              name="match-length"
              className="sr-only"
              checked={value === length}
              onChange={() => !disabled && onChange(length)}
              disabled={disabled}
            />
            <span>Best of {length}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default MatchLengthControl
