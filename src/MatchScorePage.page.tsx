import { render, screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import MatchScorePage from './MatchScorePage'
import { gameScoreFormPage } from './MatchScorePage/GameScoreForm.page'
import { createTestQueryClient } from './test/utils'
import { saveMatch, clearAllMatches, type StoredMatch } from './lib/matchesDb'
import { createMockMatch } from './MatchScorePage/useMatch.page'

interface RenderOptions {
  matchId?: string
  match?: StoredMatch | null
}

export const matchScorePagePage = {
  async render(options: RenderOptions = {}) {
    const { matchId = 'test-match-123', match } = options
    const queryClient = createTestQueryClient()

    // Clear any existing data and set up match if provided
    await clearAllMatches()
    if (match !== null) {
      const matchToSave = match ?? createMockMatch({ id: matchId })
      await saveMatch(matchToSave)
    }

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/matches/${matchId}/score`]}>
          <Routes>
            <Route path="/matches/:id/score" element={<MatchScorePage />} />
            <Route path="/matches/:id" element={<div data-testid="match-detail">Match Detail</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    return { queryClient }
  },

  async waitForLoaded() {
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /enter score/i })).toBeInTheDocument()
    })
  },

  get container() {
    return screen.getByRole('heading', { name: /enter score/i }).closest('div')
  },

  get loadingSpinner() {
    return screen.queryByRole('status')
  },

  get matchDetailPage() {
    return screen.queryByTestId('match-detail')
  },

  async waitForMatchDetailPage() {
    await waitFor(() => {
      expect(screen.queryByTestId('match-detail')).toBeInTheDocument()
    })
  },

  // Delegate to GameScoreForm page object
  gameScoreForm: gameScoreFormPage,
}
