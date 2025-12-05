import { type FC } from 'react'

const NoRecentsEmptyState: FC = () => {
  return (
    <div
      data-testid="no-recents-empty-state"
      className="flex flex-col items-center px-6 py-5 text-center"
    >
      <div className="text-4xl mb-2">🏓</div>
      <h3 className="text-sm font-medium text-base-content/80 mb-2">
        Your recent opponents will appear here
      </h3>
      <p className="text-sm text-base-content/60">
        To get started, tap <span className="font-medium text-base-content">Quick Match</span> below.
      </p>
    </div>
  )
}

export default NoRecentsEmptyState
