import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import MatchDetailPage from './MatchDetailPage'
import { createTestQueryClient } from './test/utils'
import { saveMatch, type StoredMatch } from '@lib/matchesDb'

interface RenderOptions {
  matchId?: string
  match?: Partial<StoredMatch>
}

function createTestMatch(
  id: string,
  overrides: Partial<StoredMatch> = {}
): StoredMatch {
  return {
    id,
    playerId: 'player-1',
    opponentId: 'player-2',
    matchLength: 5,
    status: 'in_progress',
    games: [],
    winnerId: null,
    createdAt: new Date(),
    ...overrides,
  }
}

export const matchDetailPagePage = {
  async render(options: RenderOptions = {}) {
    const { matchId = 'test-match-123', match = {} } = options
    const queryClient = createTestQueryClient()

    const testMatch = createTestMatch(matchId, match)
    await saveMatch(testMatch)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/matches/${matchId}`]}>
          <Routes>
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route
              path="/matches/:id/score"
              element={<div data-testid="score-page">Score Page</div>}
            />
            <Route
              path="/matches/new"
              element={<div data-testid="new-match-page">New Match</div>}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(
        screen.queryByText('loading', { selector: '.loading-spinner' }) ||
          screen.queryByText(/best of \d+/i) ||
          screen.queryByText(/match not found/i)
      ).toBeTruthy()
    })

    return { queryClient, testMatch }
  },

  renderNotFound(matchId: string = 'non-existent') {
    const queryClient = createTestQueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/matches/${matchId}`]}>
          <Routes>
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route
              path="/matches/new"
              element={<div data-testid="new-match-page">New Match</div>}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )

    return { queryClient }
  },

  get loadingSpinner() {
    return screen.queryByText('', { selector: '.loading-spinner' })
  },

  get notFoundHeading() {
    return screen.queryByRole('heading', { name: /match not found/i })
  },

  get startNewMatchLink() {
    return screen.queryByRole('link', { name: /start new match/i })
  },

  get statusBadge() {
    return (
      screen.queryByText('Completed') || screen.queryByText('In progress')
    )
  },

  get completedBadge() {
    return screen.queryByText('Completed')
  },

  get inProgressBadge() {
    return screen.queryByText('In progress')
  },

  get summaryCard() {
    return screen.queryByText(/best of \d+/i)?.closest('.card')
  },

  getMatchLengthInfo(length: number) {
    return screen.queryByText(new RegExp(`Best of ${length}`))
  },

  get progressInfo() {
    return screen.queryByText(/first to \d+/i)
  },

  get winnerMessage() {
    return screen.queryByText(/won \d+–\d+/i)
  },

  get gamesHeading() {
    return screen.queryByText('Games')
  },

  getGameRow(gameNumber: number) {
    return screen
      .queryByText(new RegExp(`Game ${gameNumber}`))
      ?.closest('.bg-base-200')
  },

  get continueMatchLink() {
    return screen.queryByRole('link', { name: /continue match/i })
  },

  get newMatchLink() {
    return screen.queryByRole('link', { name: /new match/i })
  },

  get scorePage() {
    return screen.queryByTestId('score-page')
  },

  get newMatchPage() {
    return screen.queryByTestId('new-match-page')
  },

  async clickContinueMatch() {
    const link = screen.getByRole('link', { name: /continue match/i })
    await userEvent.click(link)
  },

  async clickNewMatch() {
    const link = screen.getByRole('link', { name: /new match/i })
    await userEvent.click(link)
  },
}

export { createTestMatch }
export type { RenderOptions }
