import { describe, it, expect, vi, afterEach } from 'vitest'
import { playerRowPage } from './PlayerRow.page'

describe('PlayerRow', () => {
  const useFakeTime = () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-03-20T12:00:00.000Z'))
  }

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('layout structure', () => {
    it('renders as a button', () => {
      playerRowPage.render()
      expect(playerRowPage.row).toBeInTheDocument()
    })

    it('has correct base styling', () => {
      playerRowPage.render()
      expect(playerRowPage.row).toHaveClass(
        'w-full',
        'flex',
        'items-center',
        'gap-3',
        'px-4',
        'py-3'
      )
    })

    it('has minimum height of 56px', () => {
      playerRowPage.render()
      expect(playerRowPage.row).toHaveClass('min-h-[56px]')
    })

    it('has hover state styling', () => {
      playerRowPage.render()
      expect(playerRowPage.row).toHaveClass('hover:bg-base-200')
    })

    it('has active/pressed state styling', () => {
      playerRowPage.render()
      expect(playerRowPage.row).toHaveClass('active:bg-base-300')
    })

    it('has focus visible styling', () => {
      playerRowPage.render()
      expect(playerRowPage.row).toHaveClass(
        'focus-visible:outline-2',
        'focus-visible:outline-primary'
      )
    })

    it('has transition for smooth feedback', () => {
      playerRowPage.render()
      expect(playerRowPage.row).toHaveClass('transition-colors')
    })
  })

  describe('display name', () => {
    it('displays player username', () => {
      playerRowPage.render({
        player: {
          id: 'p1',
          username: 'JohnDoe',
          avatarUrl: null,
          isEphemeral: false,
        },
      })

      expect(playerRowPage.getDisplayNameByText('JohnDoe')).toBeInTheDocument()
    })

    it('displays Anonymous for ephemeral users with Anonymous username', () => {
      playerRowPage.render({
        player: {
          id: 'p1',
          username: 'Anonymous',
          avatarUrl: null,
          isEphemeral: true,
        },
      })

      expect(playerRowPage.getDisplayNameByText('Anonymous')).toBeInTheDocument()
    })

    it('displays username for ephemeral users with non-Anonymous username', () => {
      playerRowPage.render({
        player: {
          id: 'p1',
          username: 'Guest123',
          avatarUrl: null,
          isEphemeral: true,
        },
      })

      expect(playerRowPage.getDisplayNameByText('Guest123')).toBeInTheDocument()
    })

    it('has truncation styling', () => {
      playerRowPage.render()

      const nameElement = document.querySelector('.font-medium')
      expect(nameElement).toHaveClass('truncate')
    })
  })

  describe('secondary text - no history', () => {
    it('shows "No matches yet" when hasHistory is false', () => {
      playerRowPage.render({ hasHistory: false })
      expect(playerRowPage.secondaryText).toHaveTextContent('No matches yet')
    })

    it('shows "No matches yet" when hasHistory is true but data is missing', () => {
      playerRowPage.render({
        hasHistory: true,
        headToHead: undefined,
        lastMatch: undefined,
      })
      expect(playerRowPage.secondaryText).toHaveTextContent('No matches yet')
    })
  })

  describe('secondary text - with history', () => {
    it('formats secondary text correctly with all data', () => {
      useFakeTime()
      playerRowPage.render({
        hasHistory: true,
        headToHead: { wins: 5, losses: 3 },
        lastMatch: {
          result: 'win',
          score: '11–7',
          playedAt: '2025-03-20T10:00:00.000Z',
        },
      })

      expect(playerRowPage.secondaryText).toHaveTextContent(
        'Last: Won 11–7 · 2h ago · Record 5-3'
      )
    })

    it('shows "Lost" for loss result', () => {
      useFakeTime()
      playerRowPage.render({
        hasHistory: true,
        headToHead: { wins: 2, losses: 4 },
        lastMatch: {
          result: 'loss',
          score: '7–11',
          playedAt: '2025-03-20T11:00:00.000Z',
        },
      })

      expect(playerRowPage.secondaryText).toHaveTextContent(
        'Last: Lost 7–11 · 1h ago · Record 2-4'
      )
    })

    it('handles zero wins and losses', () => {
      useFakeTime()
      playerRowPage.render({
        hasHistory: true,
        headToHead: { wins: 0, losses: 0 },
        lastMatch: {
          result: 'win',
          score: '11–5',
          playedAt: '2025-03-20T11:55:00.000Z',
        },
      })

      expect(playerRowPage.secondaryText).toHaveTextContent('Last: Won 11–5 · 5m ago · Record 0-0')
    })

    it('has truncation styling', () => {
      playerRowPage.render()
      expect(playerRowPage.secondaryText).toHaveClass('truncate')
    })
  })

  describe('tap behavior', () => {
    it('calls onSelect with player id when clicked', async () => {
      const { onSelect, user } = playerRowPage.render({
        player: {
          id: 'player-456',
          username: 'TestPlayer',
          avatarUrl: null,
          isEphemeral: false,
        },
      })

      await user.click(playerRowPage.row)

      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onSelect).toHaveBeenCalledWith('player-456')
    })
  })

  describe('avatar integration', () => {
    it('renders avatar component', () => {
      playerRowPage.render({
        player: {
          id: 'p1',
          username: 'JohnDoe',
          avatarUrl: null,
          isEphemeral: false,
        },
      })

      expect(document.querySelector('.avatar')).toBeInTheDocument()
    })

    it('passes player data to avatar', () => {
      playerRowPage.render({
        player: {
          id: 'p1',
          username: 'JohnDoe',
          avatarUrl: 'https://example.com/avatar.jpg',
          isEphemeral: false,
        },
      })

      const avatarImg = document.querySelector('.avatar img')
      expect(avatarImg).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })
  })

  describe('accessibility', () => {
    it('is keyboard accessible (button role)', () => {
      playerRowPage.render()
      expect(playerRowPage.row).toHaveAttribute('type', 'button')
    })
  })
})
