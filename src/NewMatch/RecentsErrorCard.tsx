import { useState, type FC } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export interface RecentsErrorCardProps {
  onRetry: () => Promise<void> | void
  retryCount: number
}

const RecentsErrorCard: FC<RecentsErrorCardProps> = ({ onRetry, retryCount }) => {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  const title =
    retryCount >= 3
      ? "Still couldn't load your recent players."
      : "We couldn't load your recent players."

  const subtitle =
    retryCount >= 3
      ? 'Check your connection or try again later.'
      : 'Everything else still works.'

  return (
    <div className="mx-4 mt-2">
      <div
        role="alert"
        className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2"
      >
        <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-warning mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">{title}</p>
          <p className="text-xs text-base-content/60 leading-tight mt-0.5">{subtitle}</p>
        </div>
        <button
          onClick={handleRetry}
          className={`btn btn-warning btn-xs ${isRetrying ? 'loading' : ''}`}
          disabled={isRetrying}
        >
          {isRetrying ? 'Retrying...' : 'Try again'}
        </button>
      </div>
    </div>
  )
}

export default RecentsErrorCard
