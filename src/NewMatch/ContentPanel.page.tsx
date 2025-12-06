import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ContentPanel, { type ContentPanelProps } from './ContentPanel'
import { FlashTestWrapper } from '../test/FlashTestWrapper'
import { flashStateRef } from '../test/flashStateRef'
import { sectionHeaderPage } from './SectionHeader.page'
import { skeletonRowsPage } from './SkeletonRows.page'
import { playerListPage } from './PlayerList.page'
import { recentsErrorCardPage } from './RecentsErrorCard.page'
import { noRecentsEmptyStatePage } from './NoRecentsEmptyState.page'
import { type RecentOpponent } from '../hooks/useRecentOpponents'
import { type SearchResult } from '../hooks/usePlayerSearch'

export const defaultRecentsData: RecentOpponent[] = [
  {
    id: 'player-1',
    username: 'AliceSmith',
    avatarUrl: null,
    isEphemeral: false,
    headToHead: { wins: 3, losses: 2 },
    lastMatch: {
      id: 'match-1',
      result: 'win',
      score: '11-7',
      playedAt: '2025-03-20T10:00:00.000Z',
    },
  },
  {
    id: 'player-2',
    username: 'BobJones',
    avatarUrl: null,
    isEphemeral: false,
    headToHead: { wins: 1, losses: 4 },
    lastMatch: {
      id: 'match-2',
      result: 'loss',
      score: '7-11',
      playedAt: '2025-03-19T10:00:00.000Z',
    },
  },
]

export const defaultSearchData: SearchResult[] = [
  {
    id: 'search-1',
    username: 'JohnDoe',
    avatarUrl: null,
    isEphemeral: false,
    headToHead: { wins: 2, losses: 1 },
    lastMatch: {
      id: 'match-3',
      result: 'win',
      score: '11-9',
      playedAt: '2025-03-18T10:00:00.000Z',
    },
  },
]

interface RenderOptions {
  queryParam?: string
  recents?: Partial<ContentPanelProps['recents']>
  search?: Partial<ContentPanelProps['search']>
  onSelectPlayer?: ContentPanelProps['onSelectPlayer']
  onRetry?: ContentPanelProps['onRetry']
  retryCount?: number
}

export const contentPanelPage = {
  render(options: RenderOptions = {}) {
    const {
      queryParam = '',
      recents = {},
      search = {},
      onSelectPlayer = vi.fn(),
      onRetry = vi.fn(),
      retryCount = 0,
    } = options

    const recentsProps: ContentPanelProps['recents'] = {
      isInitialLoading: false,
      isRefetching: false,
      hasError: false,
      opponents: defaultRecentsData,
      ...recents,
    }

    const searchProps: ContentPanelProps['search'] = {
      isLoading: false,
      isFetching: false,
      hasError: false,
      results: null,
      ...search,
    }

    const user = userEvent.setup()

    render(
      <FlashTestWrapper>
        <ContentPanel
          queryParam={queryParam}
          recents={recentsProps}
          search={searchProps}
          onSelectPlayer={onSelectPlayer}
          onRetry={onRetry}
          retryCount={retryCount}
        />
      </FlashTestWrapper>
    )

    return { onSelectPlayer, onRetry, user }
  },

  // Flash state access
  getFlashState() {
    return flashStateRef.current
  },

  get flashes() {
    return flashStateRef.current?.flashes ?? []
  },

  // Header delegation
  queryRecentOpponentsHeader() {
    return screen.queryByRole('heading', { name: 'RECENT OPPONENTS', level: 2 })
  },

  querySearchResultsHeader() {
    return screen.queryByRole('heading', { name: 'SEARCH RESULTS', level: 2 })
  },

  get recentOpponentsHeader() {
    return sectionHeaderPage.recentOpponentsHeader
  },

  get searchResultsHeader() {
    return sectionHeaderPage.searchResultsHeader
  },

  queryLoadingSpinner() {
    return screen.queryByLabelText('Loading')
  },

  get loadingSpinner() {
    return sectionHeaderPage.loadingSpinner
  },

  get hasLoadingSpinner() {
    return this.queryLoadingSpinner() !== null
  },

  // Skeleton delegation
  skeletonRows: skeletonRowsPage,

  get isShowingSkeleton() {
    return skeletonRowsPage.queryContainer() !== null
  },

  // Player list delegation
  playerList: playerListPage,

  get playerRows() {
    return playerListPage.playerRows
  },

  async clickPlayerByName(name: string) {
    await playerListPage.clickPlayerByName(name)
  },

  // Error card delegation
  errorCard: recentsErrorCardPage,

  queryErrorAlert() {
    return screen.queryByRole('alert')
  },

  get hasErrorCard() {
    return this.queryErrorAlert() !== null
  },

  // Empty state delegation
  emptyState: noRecentsEmptyStatePage,

  queryEmptyState() {
    return screen.queryByText(/Your recent opponents will appear here/i)
  },

  get hasEmptyState() {
    return this.queryEmptyState() !== null
  },

  // Search todo card
  querySearchTodoCard() {
    return screen.queryByText(/Search results coming soon/i)
  },

  get hasSearchTodoCard() {
    return this.querySearchTodoCard() !== null
  },
}
