import { type FC } from 'react'

export interface MatchDetailErrorProps {
  onRetry: () => void
}

const MatchDetailError: FC<MatchDetailErrorProps> = ({ onRetry }) => {
  return (
    <div
      className="card bg-base-200 rounded-2xl p-8 text-center"
      data-testid="match-detail-error"
      role="alert"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            We couldn't load this match
          </h2>
          <p className="text-sm text-base-content/50 mt-1">
            Something went wrong. Please try again.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary rounded-xl"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default MatchDetailError
