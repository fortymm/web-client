import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RecentPlayersPanel, {
  type RecentPlayersPanelProps,
} from './RecentPlayersPanel'
import { type Opponent } from '../hooks/useOpponents'
import { sectionHeaderPage } from './SectionHeader.page'
import { skeletonRowsPage } from './SkeletonRows.page'
import { playerListPage } from './PlayerList.page'
import { recentsErrorCardPage } from './RecentsErrorCard.page'
import { noRecentsEmptyStatePage } from './NoRecentsEmptyState.page'
import { buildOpponent } from './RecentPlayersPanel/factories'

type RenderOptions =
  | { state: 'loading' }
  | { state: 'error'; retryCount?: number; onRetry?: () => Promise<void> | void }
  | { state: 'empty' }
  | { state?: 'success'; players?: Opponent[]; isRefetching?: boolean }

type CommonOptions = {
  onSelectPlayer?: (playerId: string) => void
}

const defaultPlayers: Opponent[] = [
  buildOpponent({
    id: 'player-1',
    username: 'Player1',
  }),
  buildOpponent({
    id: 'player-2',
    username: 'Player2',
  }),
]

export const recentPlayersPanelPage = {
  render(
    options: RenderOptions & CommonOptions = { state: 'success' }
  ) {
    const user = userEvent.setup()
    const onSelectPlayer = options.onSelectPlayer ?? vi.fn()

    let props: RecentPlayersPanelProps

    if (options.state === 'loading') {
      props = {
        state: 'loading',
        onSelectPlayer,
      }
    } else if (options.state === 'error') {
      props = {
        state: 'error',
        onRetry: options.onRetry ?? vi.fn(),
        retryCount: options.retryCount ?? 0,
        onSelectPlayer,
      }
    } else if (options.state === 'empty') {
      props = {
        state: 'empty',
        onSelectPlayer,
      }
    } else {
      props = {
        state: 'success',
        players: options.players ?? defaultPlayers,
        isRefetching: options.isRefetching ?? false,
        onSelectPlayer,
      }
    }

    render(<RecentPlayersPanel {...props} />)

    return {
      onSelectPlayer,
      onRetry: props.state === 'error' ? props.onRetry : undefined,
      user,
    }
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
