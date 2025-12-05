import { type FC } from 'react'

const NoRecentsEmptyState: FC = () => {
  return (
    <div
      data-testid="no-recents-empty-state"
      className="flex flex-col items-center justify-center px-8 py-6 text-center"
    >
      <div className="text-4xl mb-3">🏓</div>
      <h3 className="text-base font-semibold text-base-content mb-1">
        Your recent opponents will appear here
      </h3>
      <p className="text-sm text-base-content/60">
        After your first match, starting a rematch is just one tap.
      </p>
    </div>
  )
}

export default NoRecentsEmptyState
