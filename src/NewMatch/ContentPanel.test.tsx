import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { contentPanelPage, defaultOpponents } from './ContentPanel.page'
import { flashStateRef } from '../test/flashStateRef'

describe('ContentPanel', () => {
  beforeEach(() => {
    flashStateRef.current = null
  })

  afterEach(() => {
    flashStateRef.current = null
  })

  describe('Initial Load States', () => {
    it('shows skeleton with "RECENT PLAYERS" header during initial load', () => {
      contentPanelPage.render({
        isInitialLoading: true,
        opponents: null,
      })

      expect(contentPanelPage.recentPlayersHeader).toBeInTheDocument()
      expect(contentPanelPage.isShowingSkeleton).toBe(true)
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
    })

    it('shows skeleton with "SEARCH RESULTS" header when user types during initial load', () => {
      contentPanelPage.render({
        queryParam: 'john',
        isInitialLoading: true,
        opponents: null,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.isShowingSkeleton).toBe(true)
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
    })
  })

  describe('Recent Players View', () => {
    it('shows "RECENT PLAYERS" header with player list when data loaded', () => {
      contentPanelPage.render({
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.recentPlayersHeader).toBeInTheDocument()
      expect(contentPanelPage.playerRows).toHaveLength(2)
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
    })

    it('shows empty state when no recent players', () => {
      contentPanelPage.render({
        opponents: [],
      })

      expect(contentPanelPage.recentPlayersHeader).toBeInTheDocument()
      expect(contentPanelPage.hasEmptyState).toBe(true)
    })

    it('shows loading spinner during background refetch', () => {
      contentPanelPage.render({
        isFetching: true,
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.recentPlayersHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.playerRows).toHaveLength(2)
    })

    it('shows error card on initial load error', () => {
      contentPanelPage.render({
        hasError: true,
        opponents: null,
      })

      expect(contentPanelPage.recentPlayersHeader).toBeInTheDocument()
      expect(contentPanelPage.hasErrorCard).toBe(true)
    })
  })

  describe('Searching State', () => {
    it('shows "SEARCH RESULTS" header with spinner and player list when fetching with data', () => {
      contentPanelPage.render({
        queryParam: 'john',
        isFetching: true,
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.playerRows).toHaveLength(2)
    })

    it('shows search loading placeholder when fetching with no data', () => {
      contentPanelPage.render({
        queryParam: 'john',
        isFetching: true,
        opponents: null,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.hasSearchLoadingPlaceholder).toBe(true)
    })

    it('shows skeleton when initial load with search query', () => {
      contentPanelPage.render({
        queryParam: 'john',
        isFetching: true,
        isInitialLoading: true,
        opponents: null,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.isShowingSkeleton).toBe(true)
    })
  })

  describe('Search View', () => {
    it('shows "SEARCH RESULTS" header with player list when search completes', () => {
      contentPanelPage.render({
        queryParam: 'john',
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.playerRows).toHaveLength(2)
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
    })

    it('shows loading spinner during search refetch with stale results visible', () => {
      contentPanelPage.render({
        queryParam: 'john',
        isFetching: true,
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.playerRows).toHaveLength(2)
    })

    it('shows "SEARCH RESULTS" header for empty search results (out of scope)', () => {
      contentPanelPage.render({
        queryParam: 'xyz',
        opponents: [],
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      // Empty search results state is out of scope for FM-305
    })
  })

  describe('Clearing Search', () => {
    it('shows "RECENT PLAYERS" header when query is cleared', () => {
      contentPanelPage.render({
        queryParam: '',
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.recentPlayersHeader).toBeInTheDocument()
      expect(contentPanelPage.playerRows).toHaveLength(2)
    })
  })

  describe('Player Selection', () => {
    it('calls onSelectPlayer when a player is clicked', async () => {
      const { onSelectPlayer } = contentPanelPage.render({
        opponents: defaultOpponents,
      })

      await contentPanelPage.clickPlayerByName('AliceSmith')

      expect(onSelectPlayer).toHaveBeenCalledWith('player-1')
    })
  })

  describe('Retry Functionality', () => {
    it('calls onRetry when retry button is clicked on error card', async () => {
      const { onRetry, user } = contentPanelPage.render({
        hasError: true,
        opponents: null,
      })

      const retryButton = contentPanelPage.errorCard.retryButton
      await user.click(retryButton)

      expect(onRetry).toHaveBeenCalled()
    })
  })

  describe('Toast Notifications', () => {
    it('has access to flash state for showing toasts', () => {
      contentPanelPage.render({
        opponents: defaultOpponents,
      })

      // Verify flash state is accessible (toasts would be triggered on error state changes)
      expect(contentPanelPage.getFlashState()).not.toBeNull()
    })
  })
})
