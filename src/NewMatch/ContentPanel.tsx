import { type FC, useEffect, useRef } from 'react'
import SectionHeader from './SectionHeader'
import SkeletonRows from './SkeletonRows'
import PlayerList from './PlayerList'
import RecentsErrorCard from './RecentsErrorCard'
import NoRecentsEmptyState from './NoRecentsEmptyState'
import NoSearchResultsEmptyState from './NoSearchResultsEmptyState'
import { useFlash } from '@lib/useFlash'
import { type Opponent } from '../hooks/useOpponents'

export interface ContentPanelProps {
  queryParam: string
  activeQuery: string
  opponents: Opponent[] | null
  isInitialLoading: boolean
  isFetching: boolean
  hasError: boolean
  onSelectPlayer: (playerId: string) => void
  onRetry: () => Promise<void> | void
  retryCount: number
}

type ViewState =
  | { type: 'initial-load-recents' }
  | { type: 'initial-load-search' }
  | { type: 'recents-idle'; opponents: Opponent[] }
  | { type: 'recents-empty' }
  | { type: 'recents-error' }
  | { type: 'recents-fetching'; opponents: Opponent[] }
  | { type: 'search-idle'; opponents: Opponent[] }
  | { type: 'search-empty' }
  | { type: 'search-fetching'; opponents: Opponent[] }
  | { type: 'search-fetching-no-data' }

function computeViewState(
  activeQuery: string,
  opponents: Opponent[] | null,
  isInitialLoading: boolean,
  isFetching: boolean,
  hasError: boolean
): ViewState {
  const hasQuery = activeQuery.trim() !== ''
  const hasData = opponents !== null

  // Initial load (no data yet)
  if (isInitialLoading && !hasData) {
    return hasQuery ? { type: 'initial-load-search' } : { type: 'initial-load-recents' }
  }

  // Error on initial load (no data available)
  if (hasError && !hasData) {
    return { type: 'recents-error' }
  }

  // User has a query (search mode)
  if (hasQuery) {
    if (opponents === null) {
      return { type: 'search-fetching-no-data' }
    }

    if (isFetching) {
      return opponents.length === 0
        ? { type: 'search-empty' }
        : { type: 'search-fetching', opponents }
    }

    return opponents.length === 0
      ? { type: 'search-empty' }
      : { type: 'search-idle', opponents }
  }

  // No query (recents mode)
  if (opponents === null) {
    return { type: 'initial-load-recents' }
  }

  if (isFetching) {
    return opponents.length === 0
      ? { type: 'recents-empty' }
      : { type: 'recents-fetching', opponents }
  }

  return opponents.length === 0
    ? { type: 'recents-empty' }
    : { type: 'recents-idle', opponents }
}

function getHeaderConfig(viewState: ViewState): {
  title: 'RECENT OPPONENTS' | 'SEARCH RESULTS'
  isLoading: boolean
} {
  switch (viewState.type) {
    case 'initial-load-recents':
    case 'recents-idle':
    case 'recents-empty':
    case 'recents-error':
      return { title: 'RECENT OPPONENTS', isLoading: false }

    case 'recents-fetching':
      return { title: 'RECENT OPPONENTS', isLoading: true }

    case 'initial-load-search':
    case 'search-fetching-no-data':
      return { title: 'SEARCH RESULTS', isLoading: false }

    case 'search-idle':
    case 'search-empty':
      return { title: 'SEARCH RESULTS', isLoading: false }

    case 'search-fetching':
      return { title: 'SEARCH RESULTS', isLoading: true }
  }
}

const ContentPanel: FC<ContentPanelProps> = ({
  queryParam,
  activeQuery,
  opponents,
  isInitialLoading,
  isFetching,
  hasError,
  onSelectPlayer,
  onRetry,
  retryCount,
}) => {
  const { showFlash } = useFlash()

  const viewState = computeViewState(
    activeQuery,
    opponents,
    isInitialLoading,
    isFetching,
    hasError
  )
  const headerConfig = getHeaderConfig(viewState)

  // Track previous error state for toast notifications
  const prevErrorRef = useRef<boolean>(false)

  // Toast on background error (refetching failure when we have data to show)
  useEffect(() => {
    const hasBackgroundError = hasError && opponents !== null

    if (hasBackgroundError && !prevErrorRef.current) {
      const message = activeQuery.trim() !== ''
        ? 'Failed to search players'
        : 'Failed to refresh recent opponents'
      showFlash(message, { type: 'error', timeout: 5000 })
    }

    prevErrorRef.current = hasBackgroundError
  }, [hasError, opponents, activeQuery, showFlash])

  // Render content based on view state
  const renderContent = () => {
    switch (viewState.type) {
      case 'initial-load-recents':
      case 'initial-load-search':
      case 'search-fetching-no-data':
        return <SkeletonRows count={6} />

      case 'recents-error':
        return <RecentsErrorCard onRetry={onRetry} retryCount={retryCount} />

      case 'recents-empty':
        return (
          <div className="mx-4 rounded-lg border border-base-300 bg-base-200/30">
            <NoRecentsEmptyState />
          </div>
        )

      case 'recents-idle':
      case 'recents-fetching':
        return (
          <PlayerList
            players={viewState.opponents}
            context="recents"
            onSelectPlayer={onSelectPlayer}
          />
        )

      case 'search-idle':
      case 'search-fetching':
        return (
          <PlayerList
            players={viewState.opponents}
            context="search"
            onSelectPlayer={onSelectPlayer}
          />
        )

      case 'search-empty':
        return (
          <div className="mx-4 rounded-lg border border-base-300 bg-base-200/30">
            <NoSearchResultsEmptyState query={queryParam} />
          </div>
        )
    }
  }

  return (
    <>
      <SectionHeader title={headerConfig.title} isLoading={headerConfig.isLoading} />
      {renderContent()}
    </>
  )
}

export default ContentPanel
