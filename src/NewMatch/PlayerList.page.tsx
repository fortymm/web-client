import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import PlayerList, {
  type PlayerListProps,
  type PlayerListPlayer,
} from './PlayerList'

interface RenderOptions {
  players?: PlayerListPlayer[]
  context?: PlayerListProps['context']
  onSelectPlayer?: PlayerListProps['onSelectPlayer']
  loadingPlayerId?: PlayerListProps['loadingPlayerId']
}

const defaultPlayers: PlayerListPlayer[] = [
  {
    id: 'player-1',
    username: 'Player1',
    avatarUrl: null,
    isEphemeral: false,
    headToHead: { wins: 3, losses: 2 },
    lastMatch: {
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
      result: 'loss',
      score: '7-11',
      playedAt: '2025-03-19T10:00:00.000Z',
    },
  },
]

export const playerListPage = {
  render(options: RenderOptions = {}) {
    const {
      players = defaultPlayers,
      context = 'recents',
      onSelectPlayer = vi.fn(),
      loadingPlayerId = null,
    } = options

    const user = userEvent.setup()

    render(
      <PlayerList
        players={players}
        context={context}
        onSelectPlayer={onSelectPlayer}
        loadingPlayerId={loadingPlayerId}
      />
    )

    return { onSelectPlayer, user }
  },

  get list() {
    return screen.getByRole('list')
  },

  get listItems() {
    return screen.getAllByRole('listitem')
  },

  get playerRows() {
    return screen.queryAllByRole('button')
  },

  getPlayerRowByName(name: string) {
    return screen.getByRole('button', { name: new RegExp(name, 'i') })
  },

  getListItemByIndex(index: number) {
    return this.listItems[index]
  },

  async clickPlayerByName(name: string) {
    const row = this.getPlayerRowByName(name)
    await userEvent.click(row)
  },

  async clickPlayerByIndex(index: number) {
    const row = this.playerRows[index]
    await userEvent.click(row)
  },
}
