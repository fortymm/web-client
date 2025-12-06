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
import { type Opponent } from '../hooks/useOpponents'

export const defaultOpponents: Opponent[] = [
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

interface RenderOptions {
  queryParam?: string
  opponents?: Opponent[] | null
  isInitialLoading?: boolean
  isFetching?: boolean
  hasError?: boolean
  onSelectPlayer?: ContentPanelProps['onSelectPlayer']
  onRetry?: ContentPanelProps['onRetry']
  retryCount?: number
}

export const contentPanelPage = {
  render(options: RenderOptions = {}) {
    const {
      queryParam = '',
      opponents = defaultOpponents,
      isInitialLoading = false,
      isFetching = false,
      hasError = false,
      onSelectPlayer = vi.fn(),
      onRetry = vi.fn(),
      retryCount = 0,
    } = options

    const user = userEvent.setup()

    render(
      <FlashTestWrapper>
        <ContentPanel
          queryParam={queryParam}
          opponents={opponents}
          isInitialLoading={isInitialLoading}
          isFetching={isFetching}
          hasError={hasError}
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
