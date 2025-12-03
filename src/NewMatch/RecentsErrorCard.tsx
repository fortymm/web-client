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

  const message =
    retryCount >= 3
      ? 'Still having trouble. Check your connection.'
      : "Couldn't load players"

  return (
    <div className="flex flex-col items-center px-8 py-6 text-center">
      <ExclamationTriangleIcon className="w-10 h-10 text-warning mb-3" />
      <h3 className="text-base font-semibold text-base-content mb-3">{message}</h3>
      <button
        onClick={handleRetry}
        className={`btn btn-primary btn-sm ${isRetrying ? 'loading' : ''}`}
        disabled={isRetrying}
      >
        {isRetrying ? 'Retrying...' : 'Try again'}
      </button>
    </div>
  )
}

export default RecentsErrorCard
