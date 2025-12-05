import { type FC } from 'react'

const NoRecentsEmptyState: FC = () => {
  return (
    <div
      data-testid="no-recents-empty-state"
      className="flex flex-col items-center justify-center px-8 py-12 text-center"
    >
      <div className="text-5xl mb-4">🏓</div>
      <h3 className="text-lg font-semibold text-base-content mb-1">
        No recent players yet
      </h3>
      <p className="text-sm text-base-content/60">
        Start a Quick Match to play your first game
      </p>
    </div>
  )
}

export default NoRecentsEmptyState
