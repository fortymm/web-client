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
    it('shows skeleton with "RECENT OPPONENTS" header during initial load', () => {
      contentPanelPage.render({
        isInitialLoading: true,
        opponents: null,
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
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
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
    })
  })

  describe('Recent Opponents View', () => {
    it('shows "RECENT OPPONENTS" header with player list when data loaded', () => {
      contentPanelPage.render({
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.playerRows).toHaveLength(2)
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
    })

    it('shows empty state when no recent opponents', () => {
      contentPanelPage.render({
        opponents: [],
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasEmptyState).toBe(true)
    })

    it('shows loading spinner during background refetch', () => {
      contentPanelPage.render({
        isFetching: true,
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.playerRows).toHaveLength(2)
    })

    it('shows error card on initial load error', () => {
      contentPanelPage.render({
        hasError: true,
        opponents: null,
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasErrorCard).toBe(true)
    })
  })

  describe('Searching State', () => {
    it('shows "SEARCH RESULTS" header with spinner when fetching', () => {
      contentPanelPage.render({
        queryParam: 'john',
        isFetching: true,
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      // Shows SearchTodoCard in search mode
      expect(contentPanelPage.hasSearchTodoCard).toBe(true)
    })

    it('shows skeleton when fetching with no data', () => {
      contentPanelPage.render({
        queryParam: 'john',
        isFetching: true,
        isInitialLoading: true,
        opponents: null,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
      expect(contentPanelPage.isShowingSkeleton).toBe(true)
    })
  })

  describe('Search View', () => {
    it('shows "SEARCH RESULTS" header with search todo card when search completes', () => {
      contentPanelPage.render({
        queryParam: 'john',
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasSearchTodoCard).toBe(true)
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
    })

    it('shows loading spinner during search refetch', () => {
      contentPanelPage.render({
        queryParam: 'john',
        isFetching: true,
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.hasSearchTodoCard).toBe(true)
    })

    it('shows search todo card for empty search results', () => {
      contentPanelPage.render({
        queryParam: 'xyz',
        opponents: [],
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasSearchTodoCard).toBe(true)
    })
  })

  describe('Clearing Search', () => {
    it('shows "RECENT OPPONENTS" header when query is cleared', () => {
      contentPanelPage.render({
        queryParam: '',
        opponents: defaultOpponents,
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
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
