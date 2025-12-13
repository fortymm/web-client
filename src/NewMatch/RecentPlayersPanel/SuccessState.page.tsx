import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import SuccessState from './SuccessState'
import { type Opponent } from '../../hooks/useOpponents'
import { sectionHeaderPage } from '../SectionHeader.page'
import { skeletonRowsPage } from '../SkeletonRows.page'
import { playerListPage } from '../PlayerList.page'
import { buildOpponent } from './factories'

interface RenderOptions {
  players?: Opponent[]
  isRefetching?: boolean
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

export const successStatePage = {
  render(options: RenderOptions = {}) {
    const players = options.players ?? defaultPlayers
    const isRefetching = options.isRefetching ?? false
    const onSelectPlayer = options.onSelectPlayer ?? vi.fn()
    const user = userEvent.setup()

    render(
      <SuccessState
        state="success"
        players={players}
        isRefetching={isRefetching}
        onSelectPlayer={onSelectPlayer}
      />
    )

    return { onSelectPlayer, user }
  },

  get header() {
    return sectionHeaderPage.recentOpponentsHeader
  },

  get loadingSpinner() {
    return sectionHeaderPage.loadingSpinner
  },

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

  get isShowingSkeleton() {
    return skeletonRowsPage.queryContainer() !== null
  },
}
