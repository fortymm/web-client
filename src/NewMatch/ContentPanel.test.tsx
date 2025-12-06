import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { contentPanelPage, defaultRecentsData, defaultSearchData } from './ContentPanel.page'
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
        recents: { isInitialLoading: true, opponents: null },
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.isShowingSkeleton).toBe(true)
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
    })

    it('shows skeleton with "SEARCH RESULTS" header when user types during initial load', () => {
      contentPanelPage.render({
        queryParam: 'john',
        recents: { isInitialLoading: true, opponents: null },
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.isShowingSkeleton).toBe(true)
    })
  })

  describe('Recent Opponents View', () => {
    it('shows "RECENT OPPONENTS" header with player list when data loaded', () => {
      contentPanelPage.render({
        recents: { opponents: defaultRecentsData },
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.playerRows).toHaveLength(2)
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
    })

    it('shows empty state when no recent opponents', () => {
      contentPanelPage.render({
        recents: { opponents: [] },
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasEmptyState).toBe(true)
    })

    it('shows loading spinner during background refetch', () => {
      contentPanelPage.render({
        recents: { isRefetching: true, opponents: defaultRecentsData },
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.playerRows).toHaveLength(2)
    })

    it('shows error card on initial load error', () => {
      contentPanelPage.render({
        recents: { hasError: true, opponents: null },
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasErrorCard).toBe(true)
    })
  })

  describe('RO_Searching State (Transitioning to Search)', () => {
    it('shows "SEARCH RESULTS" header immediately when user types', () => {
      contentPanelPage.render({
        queryParam: 'john',
        recents: { opponents: defaultRecentsData },
        search: { isFetching: true, results: null },
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      // Still shows recents data while search is loading
      expect(contentPanelPage.playerRows).toHaveLength(2)
    })

    it('shows empty state with "SEARCH RESULTS" header when typing with no recents', () => {
      contentPanelPage.render({
        queryParam: 'john',
        recents: { opponents: [] },
        search: { isFetching: true, results: null },
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.hasEmptyState).toBe(true)
    })
  })

  describe('Search View', () => {
    it('shows "SEARCH RESULTS" header with search todo card when search completes', () => {
      contentPanelPage.render({
        queryParam: 'john',
        recents: { opponents: defaultRecentsData },
        search: { results: defaultSearchData },
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasSearchTodoCard).toBe(true)
      expect(contentPanelPage.hasLoadingSpinner).toBe(false)
    })

    it('shows loading spinner during search refetch', () => {
      contentPanelPage.render({
        queryParam: 'john',
        recents: { opponents: defaultRecentsData },
        search: { isFetching: true, results: defaultSearchData },
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasLoadingSpinner).toBe(true)
      expect(contentPanelPage.hasSearchTodoCard).toBe(true)
    })

    it('shows search todo card for empty search results', () => {
      contentPanelPage.render({
        queryParam: 'xyz',
        recents: { opponents: defaultRecentsData },
        search: { results: [] },
      })

      expect(contentPanelPage.searchResultsHeader).toBeInTheDocument()
      expect(contentPanelPage.hasSearchTodoCard).toBe(true)
    })
  })

  describe('S_Returning State (Clearing Search)', () => {
    it('shows "RECENT OPPONENTS" header immediately when query is cleared', () => {
      contentPanelPage.render({
        queryParam: '',
        recents: { opponents: defaultRecentsData },
        search: { results: defaultSearchData },
      })

      expect(contentPanelPage.recentOpponentsHeader).toBeInTheDocument()
      expect(contentPanelPage.playerRows).toHaveLength(2)
    })
  })

  describe('Player Selection', () => {
    it('calls onSelectPlayer when a player is clicked', async () => {
      const { onSelectPlayer } = contentPanelPage.render({
        recents: { opponents: defaultRecentsData },
      })

      await contentPanelPage.clickPlayerByName('AliceSmith')

      expect(onSelectPlayer).toHaveBeenCalledWith('player-1')
    })
  })

  describe('Retry Functionality', () => {
    it('calls onRetry when retry button is clicked on error card', async () => {
      const { onRetry, user } = contentPanelPage.render({
        recents: { hasError: true, opponents: null },
      })

      const retryButton = contentPanelPage.errorCard.retryButton
      await user.click(retryButton)

      expect(onRetry).toHaveBeenCalled()
    })
  })

  describe('Toast Notifications', () => {
    it('has access to flash state for showing toasts', () => {
      contentPanelPage.render({
        recents: { opponents: defaultRecentsData },
      })

      // Verify flash state is accessible (toasts would be triggered on error state changes)
      expect(contentPanelPage.getFlashState()).not.toBeNull()
    })
  })
})
