import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { recentPlayersPanelPage } from './RecentPlayersPanel.page'

describe('RecentPlayersPanel', () => {
  describe('loading state', () => {
    it('shows skeleton rows when initially loading', () => {
      recentPlayersPanelPage.render({ isInitialLoading: true })

      expect(recentPlayersPanelPage.isShowingSkeleton).toBe(true)
    })

    it('shows header when initially loading', () => {
      recentPlayersPanelPage.render({ isInitialLoading: true })

      expect(recentPlayersPanelPage.header).toBeInTheDocument()
    })

    it('does not show loading spinner in header when initially loading', () => {
      recentPlayersPanelPage.render({ isInitialLoading: true })

      expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
    })
  })

  describe('loaded state', () => {
    it('shows header with RECENT PLAYERS title', () => {
      recentPlayersPanelPage.render()

      expect(recentPlayersPanelPage.header).toBeInTheDocument()
      expect(recentPlayersPanelPage.header).toHaveTextContent('RECENT PLAYERS')
    })

    it('does not show skeleton rows when loaded', () => {
      recentPlayersPanelPage.render()

      expect(recentPlayersPanelPage.isShowingSkeleton).toBe(false)
    })

    it('shows player list', () => {
      recentPlayersPanelPage.render()

      expect(recentPlayersPanelPage.list).toBeInTheDocument()
    })

    it('displays all players', () => {
      recentPlayersPanelPage.render()

      expect(recentPlayersPanelPage.playerRows).toHaveLength(2)
    })
  })

  describe('refetching state', () => {
    it('shows loading spinner in header when refetching', () => {
      recentPlayersPanelPage.render({ isRefetching: true })

      expect(recentPlayersPanelPage.loadingSpinner).toBeInTheDocument()
    })

    it('still shows player list when refetching', () => {
      recentPlayersPanelPage.render({ isRefetching: true })

      expect(recentPlayersPanelPage.list).toBeInTheDocument()
    })
  })

  describe('player selection', () => {
    it('calls onSelectPlayer when clicking a player', async () => {
      const onSelectPlayer = vi.fn()
      recentPlayersPanelPage.render({ onSelectPlayer })

      await recentPlayersPanelPage.clickPlayerByIndex(0)

      expect(onSelectPlayer).toHaveBeenCalledWith('player-1')
    })

    it('passes correct playerId when clicking different players', async () => {
      const onSelectPlayer = vi.fn()
      recentPlayersPanelPage.render({ onSelectPlayer })

      await recentPlayersPanelPage.clickPlayerByIndex(1)

      expect(onSelectPlayer).toHaveBeenCalledWith('player-2')
    })
  })

  describe('error state', () => {
    it('shows error card when hasError is true', () => {
      recentPlayersPanelPage.render({ hasError: true, players: null })

      expect(recentPlayersPanelPage.errorCard.alert).toBeInTheDocument()
    })

    it('shows header when error card is displayed', () => {
      recentPlayersPanelPage.render({ hasError: true, players: null })

      expect(recentPlayersPanelPage.header).toBeInTheDocument()
    })

    it('does not show player list when error card is displayed', () => {
      recentPlayersPanelPage.render({ hasError: true, players: null })

      expect(screen.queryByTestId('player-list')).not.toBeInTheDocument()
    })

    it('does not show skeleton when error card is displayed', () => {
      recentPlayersPanelPage.render({ hasError: true, players: null })

      expect(recentPlayersPanelPage.isShowingSkeleton).toBe(false)
    })
  })

  describe('empty state', () => {
    it('shows empty state when players array is empty', () => {
      recentPlayersPanelPage.render({ players: [] })

      expect(recentPlayersPanelPage.emptyState.title).toBeInTheDocument()
    })

    it('shows header when empty state is displayed', () => {
      recentPlayersPanelPage.render({ players: [] })

      expect(recentPlayersPanelPage.header).toBeInTheDocument()
    })

    it('displays correct empty state message', () => {
      recentPlayersPanelPage.render({ players: [] })

      expect(recentPlayersPanelPage.emptyState.title).toHaveTextContent(
        'Your recent opponents will appear here'
      )
      expect(recentPlayersPanelPage.emptyState.subtitle).toHaveTextContent(
        'After your first match, starting a rematch is just one tap.'
      )
    })

    it('does not show player list when empty state is displayed', () => {
      recentPlayersPanelPage.render({ players: [] })

      expect(screen.queryByTestId('player-list')).not.toBeInTheDocument()
    })

    it('does not show skeleton when empty state is displayed', () => {
      recentPlayersPanelPage.render({ players: [] })

      expect(recentPlayersPanelPage.isShowingSkeleton).toBe(false)
    })

    it('does not show error card when empty state is displayed', () => {
      recentPlayersPanelPage.render({ players: [] })

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})
