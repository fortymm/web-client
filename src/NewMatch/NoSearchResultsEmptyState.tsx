import { type FC } from 'react'

export interface NoSearchResultsEmptyStateProps {
  query: string
}

const NoSearchResultsEmptyState: FC<NoSearchResultsEmptyStateProps> = ({ query }) => {
  return (
    <div
      data-testid="no-search-results-empty-state"
      className="flex flex-col items-center px-6 py-5 text-center"
    >
      <div className="text-4xl mb-2">🔍</div>
      <h3 className="text-sm font-medium text-base-content/80 mb-2">
        No players found for "{query}"
      </h3>
      <p className="text-sm text-base-content/60">
        Try a different search term or check the spelling.
      </p>
    </div>
  )
}

export default NoSearchResultsEmptyState
