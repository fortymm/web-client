import { type FC } from 'react'

export interface MatchDetailErrorProps {
  onRetry: () => void
}

const MatchDetailError: FC<MatchDetailErrorProps> = ({ onRetry }) => {
  return (
    <div
      className="card bg-base-200 p-6 text-center"
      data-testid="match-detail-error"
      role="alert"
    >
      <div className="flex flex-col items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h2 className="text-lg font-semibold">
            We couldn't load this match
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Something went wrong. Please try again.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default MatchDetailError
