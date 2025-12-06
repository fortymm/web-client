import { type FC, useEffect, useRef } from 'react'
import SectionHeader from './SectionHeader'
import SkeletonRows from './SkeletonRows'
import PlayerList from './PlayerList'
import RecentsErrorCard from './RecentsErrorCard'
import NoRecentsEmptyState from './NoRecentsEmptyState'
import SearchTodoCard from './SearchTodoCard'
import { useFlash } from '../useFlash'
import { type RecentOpponent } from '../hooks/useRecentOpponents'
import { type SearchResult } from '../hooks/usePlayerSearch'

export interface ContentPanelProps {
  queryParam: string
  recents: {
    isInitialLoading: boolean
    isRefetching: boolean
    hasError: boolean
    opponents: RecentOpponent[] | null
  }
  search: {
    isLoading: boolean
    isFetching: boolean
    hasError: boolean
    results: SearchResult[] | null
  }
  onSelectPlayer: (playerId: string) => void
  onRetry: () => Promise<void> | void
  retryCount: number
}

type ViewState =
  | { type: 'initial-load-recents' }
  | { type: 'initial-load-search' }
  | { type: 'recents-idle'; opponents: RecentOpponent[] }
  | { type: 'recents-empty' }
  | { type: 'recents-error' }
  | { type: 'recents-refetching'; opponents: RecentOpponent[] }
  | { type: 'recents-searching'; opponents: RecentOpponent[] }
  | { type: 'recents-searching-empty' }
  | { type: 'search-idle'; results: SearchResult[] }
  | { type: 'search-empty' }
  | { type: 'search-fetching'; results: SearchResult[] }
  | { type: 'search-fetching-empty' }

function computeViewState(props: ContentPanelProps): ViewState {
  const { queryParam, recents, search } = props
  const hasQuery = queryParam.trim() !== ''

  // Initial load of recents (no data yet)
  if (recents.isInitialLoading) {
    return hasQuery ? { type: 'initial-load-search' } : { type: 'initial-load-recents' }
  }

  // Recents error on initial load
  if (recents.hasError && recents.opponents === null) {
    return { type: 'recents-error' }
  }

  // Determine if we're in search mode (query present and debounced)
  const hasRecentsData = recents.opponents !== null

  // User has a query
  if (hasQuery) {
    // Search results available
    if (search.results !== null) {
      if (search.isFetching) {
        return search.results.length === 0
          ? { type: 'search-fetching-empty' }
          : { type: 'search-fetching', results: search.results }
      }
      return search.results.length === 0
        ? { type: 'search-empty' }
        : { type: 'search-idle', results: search.results }
    }

    // No search data yet - show recents while searching
    if (hasRecentsData) {
      return recents.opponents!.length === 0
        ? { type: 'recents-searching-empty' }
        : { type: 'recents-searching', opponents: recents.opponents! }
    }

    // No recents data either (edge case)
    return { type: 'initial-load-search' }
  }

  // No query - show recents
  if (hasRecentsData) {
    if (recents.isRefetching) {
      return recents.opponents!.length === 0
        ? { type: 'recents-empty' }
        : { type: 'recents-refetching', opponents: recents.opponents! }
    }
    return recents.opponents!.length === 0
      ? { type: 'recents-empty' }
      : { type: 'recents-idle', opponents: recents.opponents! }
  }

  // Fallback
  return { type: 'initial-load-recents' }
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

    case 'recents-refetching':
      return { title: 'RECENT OPPONENTS', isLoading: true }

    case 'initial-load-search':
    case 'recents-searching':
    case 'recents-searching-empty':
      return { title: 'SEARCH RESULTS', isLoading: true }

    case 'search-idle':
    case 'search-empty':
      return { title: 'SEARCH RESULTS', isLoading: false }

    case 'search-fetching':
    case 'search-fetching-empty':
      return { title: 'SEARCH RESULTS', isLoading: true }
  }
}

const ContentPanel: FC<ContentPanelProps> = (props) => {
  const { recents, search, onSelectPlayer, onRetry, retryCount } = props
  const { showFlash } = useFlash()

  const viewState = computeViewState(props)
  const headerConfig = getHeaderConfig(viewState)

  // Track previous errors for toast notifications
  const prevRecentsErrorRef = useRef<Error | null>(null)
  const prevSearchErrorRef = useRef<Error | null>(null)

  // Toast on recents background error (refetching failure)
  useEffect(() => {
    const hasNewError = recents.hasError && recents.opponents !== null
    const hadPreviousError = prevRecentsErrorRef.current !== null

    if (hasNewError && !hadPreviousError) {
      showFlash('Failed to refresh recent opponents', { type: 'error', timeout: 5000 })
    }

    prevRecentsErrorRef.current = hasNewError ? new Error('recents error') : null
  }, [recents.hasError, recents.opponents, showFlash])

  // Toast on search background error
  useEffect(() => {
    const hasNewError = search.hasError && search.results !== null
    const hadPreviousError = prevSearchErrorRef.current !== null

    if (hasNewError && !hadPreviousError) {
      showFlash('Failed to search players', { type: 'error', timeout: 5000 })
    }

    prevSearchErrorRef.current = hasNewError ? new Error('search error') : null
  }, [search.hasError, search.results, showFlash])

  // Render content based on view state
  const renderContent = () => {
    switch (viewState.type) {
      case 'initial-load-recents':
      case 'initial-load-search':
        return <SkeletonRows count={6} />

      case 'recents-error':
        return <RecentsErrorCard onRetry={onRetry} retryCount={retryCount} />

      case 'recents-empty':
      case 'recents-searching-empty':
        return (
          <div className="mx-4 rounded-lg border border-base-300 bg-base-200/30">
            <NoRecentsEmptyState />
          </div>
        )

      case 'recents-idle':
      case 'recents-refetching':
      case 'recents-searching':
        return (
          <PlayerList
            players={viewState.opponents}
            context="recents"
            onSelectPlayer={onSelectPlayer}
          />
        )

      case 'search-idle':
      case 'search-fetching':
        return <SearchTodoCard />

      case 'search-empty':
      case 'search-fetching-empty':
        return <SearchTodoCard />
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
