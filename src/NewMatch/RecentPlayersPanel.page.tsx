import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RecentPlayersPanel, {
  type RecentPlayersPanelProps,
} from './RecentPlayersPanel'
import { type RecentOpponent } from '../hooks/useRecentOpponents'
import { sectionHeaderPage } from './SectionHeader.page'
import { skeletonRowsPage } from './SkeletonRows.page'
import { playerListPage } from './PlayerList.page'
import { recentsErrorCardPage } from './RecentsErrorCard.page'
import { noRecentsEmptyStatePage } from './NoRecentsEmptyState.page'

interface RenderOptions {
  isInitialLoading?: boolean
  isRefetching?: boolean
  hasError?: boolean
  players?: RecentOpponent[] | null
  onSelectPlayer?: RecentPlayersPanelProps['onSelectPlayer']
  onRetry?: RecentPlayersPanelProps['onRetry']
  retryCount?: number
}

const defaultPlayers: RecentOpponent[] = [
  {
    id: 'player-1',
    username: 'Player1',
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
    username: 'Player2',
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

export const recentPlayersPanelPage = {
  render(options: RenderOptions = {}) {
    const {
      isInitialLoading = false,
      isRefetching = false,
      hasError = false,
      players = defaultPlayers,
      onSelectPlayer = vi.fn(),
      onRetry = vi.fn(),
      retryCount = 0,
    } = options

    const user = userEvent.setup()

    render(
      <RecentPlayersPanel
        isInitialLoading={isInitialLoading}
        isRefetching={isRefetching}
        hasError={hasError}
        players={players}
        onSelectPlayer={onSelectPlayer}
        onRetry={onRetry}
        retryCount={retryCount}
      />
    )

    return { onSelectPlayer, onRetry, user }
  },

  // Delegate to SectionHeader page object
  get header() {
    return sectionHeaderPage.recentOpponentsHeader
  },

  get loadingSpinner() {
    return sectionHeaderPage.loadingSpinner
  },

  // Delegate to SkeletonRows page object
  skeletonRows: skeletonRowsPage,

  get isShowingSkeleton() {
    return skeletonRowsPage.queryContainer() !== null
  },

  // Delegate to PlayerList page object
  playerList: playerListPage,

  get list() {
    return playerListPage.list
  },

  get playerRows() {
    return playerListPage.playerRows
  },

  getPlayerRowByName(name: string) {
    return playerListPage.getPlayerRowByName(name)
  },

  async clickPlayerByName(name: string) {
    await playerListPage.clickPlayerByName(name)
  },

  async clickPlayerByIndex(index: number) {
    await playerListPage.clickPlayerByIndex(index)
  },

  // Delegate to RecentsErrorCard page object
  errorCard: recentsErrorCardPage,

  // Delegate to NoRecentsEmptyState page object
  emptyState: noRecentsEmptyStatePage,
}
