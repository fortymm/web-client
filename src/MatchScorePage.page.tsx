import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import MatchScorePage from './MatchScorePage'
import { createTestQueryClient } from './test/utils'
import { saveMatch, type StoredMatch } from './lib/matchesDb'

interface RenderOptions {
  matchId?: string
  match?: Partial<StoredMatch>
}

function createTestMatch(id: string, overrides: Partial<StoredMatch> = {}): StoredMatch {
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

export const matchScorePagePage = {
  async render(options: RenderOptions = {}) {
    const { matchId = 'test-match-123', match = {} } = options
    const queryClient = createTestQueryClient()

    // Save the match to IndexedDB before rendering
    const testMatch = createTestMatch(matchId, match)
    await saveMatch(testMatch)

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

    // Wait for the match to load
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /enter score/i })).toBeInTheDocument()
    })

    return { queryClient, testMatch }
  },

  get container() {
    return screen.getByRole('heading', { name: /enter score/i }).closest('div')
  },

  get matchDetailPage() {
    return screen.queryByTestId('match-detail')
  },

  get loadingSpinner() {
    return screen.queryByText('', { selector: '.loading-spinner' })
  },

  get matchProgress() {
    return screen.queryByText(/first to \d+ wins/i)
  },

  getScoreBadge(player1Wins: number, player2Wins: number) {
    // The badge text is split across multiple elements, so we need to use a function matcher
    return screen.queryByText(
      (_content, element) => {
        if (!element || element.className !== 'badge badge-neutral badge-lg gap-2') {
          return false
        }
        const textContent = element.textContent || ''
        return textContent.includes(String(player1Wins)) && textContent.includes(String(player2Wins))
      }
    )
  },

  // Game score form interactions
  gameScoreForm: {
    get heading() {
      return screen.getByRole('heading', { name: /enter score/i })
    },

    get saveButton() {
      return screen.getByRole('button', { name: /save score/i })
    },

    get cancelButton() {
      return screen.getByRole('button', { name: /cancel/i })
    },

    getSubtitleFor(gameNumber: number, totalGames?: number) {
      if (totalGames) {
        return screen.getByText(new RegExp(`game ${gameNumber} of ${totalGames} ·`, 'i'))
      }
      return screen.getByText(new RegExp(`game ${gameNumber} ·`, 'i'))
    },

    getInputFor(playerName: string) {
      return screen.getByLabelText(playerName)
    },

    async enterScore(playerName: string, score: string) {
      const input = this.getInputFor(playerName)
      await userEvent.clear(input)
      await userEvent.type(input, score)
    },

    async clickSave() {
      await userEvent.click(this.saveButton)
    },

    async clickCancel() {
      await userEvent.click(this.cancelButton)
    },
  },

  async saveGameAndWaitForUpdate(player1Score: string, player2Score: string, nextGameNumber: number) {
    await this.gameScoreForm.enterScore('You', player1Score)
    await this.gameScoreForm.enterScore('Opponent', player2Score)
    await this.gameScoreForm.clickSave()

    // Wait for the UI to update to the next game
    await waitFor(() => {
      expect(screen.queryByText(new RegExp(`game ${nextGameNumber}`, 'i'))).toBeInTheDocument()
    })
  },

  async saveGameAndWaitForMatchComplete(player1Score: string, player2Score: string) {
    await this.gameScoreForm.enterScore('You', player1Score)
    await this.gameScoreForm.enterScore('Opponent', player2Score)
    await this.gameScoreForm.clickSave()

    // Wait for navigation to match detail page
    await waitFor(() => {
      expect(screen.queryByTestId('match-detail')).toBeInTheDocument()
    })
  },
}
