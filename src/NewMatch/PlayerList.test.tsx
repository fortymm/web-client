import { describe, it, expect, vi, afterEach } from 'vitest'
import { playerListPage } from './PlayerList.page'

describe('PlayerList', () => {
  const useFakeTime = () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-03-20T12:00:00.000Z'))
  }

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('list structure', () => {
    it('renders as an unordered list with role="list"', () => {
      playerListPage.render()
      expect(playerListPage.list).toBeInTheDocument()
      expect(playerListPage.list).toHaveAttribute('role', 'list')
    })

    it('renders list items for each player', () => {
      playerListPage.render({
        players: [
          {
            id: 'p1',
            username: 'Alice',
            avatarUrl: null,
            isEphemeral: false,
          },
          {
            id: 'p2',
            username: 'Bob',
            avatarUrl: null,
            isEphemeral: false,
          },
          {
            id: 'p3',
            username: 'Charlie',
            avatarUrl: null,
            isEphemeral: false,
          },
        ],
      })

      expect(playerListPage.listItems).toHaveLength(3)
    })

    it('has divider styling between items', () => {
      playerListPage.render()
      expect(playerListPage.list).toHaveClass('divide-y', 'divide-base-200')
    })
  })

  describe('player rendering', () => {
    it('renders PlayerRow for each player', () => {
      playerListPage.render({
        players: [
          {
            id: 'p1',
            username: 'Alice',
            avatarUrl: null,
            isEphemeral: false,
          },
          {
            id: 'p2',
            username: 'Bob',
            avatarUrl: null,
            isEphemeral: false,
          },
        ],
      })

      expect(playerListPage.playerRows).toHaveLength(2)
      expect(playerListPage.getPlayerRowByName('Alice')).toBeInTheDocument()
      expect(playerListPage.getPlayerRowByName('Bob')).toBeInTheDocument()
    })

    it('displays player names', () => {
      playerListPage.render({
        players: [
          {
            id: 'p1',
            username: 'JohnDoe',
            avatarUrl: null,
            isEphemeral: false,
          },
        ],
      })

      expect(playerListPage.getPlayerRowByName('JohnDoe')).toBeInTheDocument()
    })

    it('renders empty list when no players', () => {
      playerListPage.render({ players: [] })
      expect(playerListPage.list).toBeInTheDocument()
      expect(playerListPage.playerRows).toHaveLength(0)
    })
  })

  describe('player selection', () => {
    it('calls onSelectPlayer with player id when clicked', async () => {
      const { onSelectPlayer, user } = playerListPage.render({
        players: [
          {
            id: 'player-abc',
            username: 'TestPlayer',
            avatarUrl: null,
            isEphemeral: false,
          },
        ],
      })

      await user.click(playerListPage.getPlayerRowByName('TestPlayer'))

      expect(onSelectPlayer).toHaveBeenCalledTimes(1)
      expect(onSelectPlayer).toHaveBeenCalledWith('player-abc')
    })

    it('calls onSelectPlayer with correct id for multiple players', async () => {
      const { onSelectPlayer, user } = playerListPage.render({
        players: [
          {
            id: 'id-alice',
            username: 'Alice',
            avatarUrl: null,
            isEphemeral: false,
          },
          {
            id: 'id-bob',
            username: 'Bob',
            avatarUrl: null,
            isEphemeral: false,
          },
        ],
      })

      await user.click(playerListPage.getPlayerRowByName('Bob'))

      expect(onSelectPlayer).toHaveBeenCalledWith('id-bob')
    })
  })

  describe('loading state', () => {
    it('shows loading spinner only for the loading player', () => {
      playerListPage.render({
        players: [
          {
            id: 'p1',
            username: 'Alice',
            avatarUrl: null,
            isEphemeral: false,
          },
          {
            id: 'p2',
            username: 'Bob',
            avatarUrl: null,
            isEphemeral: false,
          },
        ],
        loadingPlayerId: 'p1',
      })

      const aliceRow = playerListPage.getPlayerRowByName('Alice')
      const bobRow = playerListPage.getPlayerRowByName('Bob')

      expect(aliceRow.querySelector('.loading')).toBeInTheDocument()
      expect(bobRow.querySelector('.loading')).not.toBeInTheDocument()
    })

    it('disables only the loading player row', () => {
      playerListPage.render({
        players: [
          {
            id: 'p1',
            username: 'Alice',
            avatarUrl: null,
            isEphemeral: false,
          },
          {
            id: 'p2',
            username: 'Bob',
            avatarUrl: null,
            isEphemeral: false,
          },
        ],
        loadingPlayerId: 'p1',
      })

      const aliceRow = playerListPage.getPlayerRowByName('Alice')
      const bobRow = playerListPage.getPlayerRowByName('Bob')

      expect(aliceRow).toBeDisabled()
      expect(bobRow).not.toBeDisabled()
    })

    it('shows no loading spinners when loadingPlayerId is null', () => {
      playerListPage.render({
        players: [
          {
            id: 'p1',
            username: 'Alice',
            avatarUrl: null,
            isEphemeral: false,
          },
        ],
        loadingPlayerId: null,
      })

      expect(document.querySelector('.loading')).not.toBeInTheDocument()
    })
  })

  describe('head to head and match history', () => {
    it('passes hasHistory as true when player has headToHead', () => {
      useFakeTime()
      playerListPage.render({
        players: [
          {
            id: 'p1',
            username: 'WithHistory',
            avatarUrl: null,
            isEphemeral: false,
            headToHead: { wins: 5, losses: 3 },
            lastMatch: {
              result: 'win',
              score: '11-7',
              playedAt: '2025-03-20T10:00:00.000Z',
            },
          },
        ],
      })

      const row = playerListPage.getPlayerRowByName('WithHistory')
      expect(row).toHaveTextContent('5-3')
    })

    it('passes hasHistory as false when player has no headToHead', () => {
      playerListPage.render({
        players: [
          {
            id: 'p1',
            username: 'NoHistory',
            avatarUrl: null,
            isEphemeral: false,
          },
        ],
      })

      const row = playerListPage.getPlayerRowByName('NoHistory')
      expect(row).toHaveTextContent('No matches yet')
    })
  })
})
