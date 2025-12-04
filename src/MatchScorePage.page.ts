import { render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { createElement } from 'react'
import MatchScorePage from './MatchScorePage'
import { saveMatch, clearAllMatches, type StoredMatch } from './lib/matchesDb'

interface RenderOptions {
  matchId?: string
  match?: Partial<StoredMatch>
}

export const matchScorePagePage = {
  async render(options: RenderOptions = {}) {
    const { matchId = 'test-match-id', match } = options

    // Clear any existing matches and optionally seed with test data
    await clearAllMatches()
    if (match) {
      await saveMatch({
        id: matchId,
        playerId: match.playerId ?? null,
        opponentId: match.opponentId ?? null,
        matchLength: match.matchLength ?? 5,
        status: match.status ?? 'in_progress',
        createdAt: match.createdAt ?? new Date(),
      })
    }

    render(
      createElement(
        MemoryRouter,
        { initialEntries: [`/matches/${matchId}/score`] },
        createElement(
          Routes,
          null,
          createElement(Route, {
            path: '/matches/:id/score',
            element: createElement(MatchScorePage),
          }),
          createElement(Route, {
            path: '/',
            element: createElement('div', null, 'Home'),
          })
        )
      )
    )

    // Wait for loading to complete
    await waitFor(() => {
      if (screen.queryByLabelText(/Loading match/i)) {
        throw new Error('Still loading')
      }
    }, { timeout: 3000 })
  },

  // Heading (sr-only but accessible via getByRole)
  get heading() {
    return screen.getByRole('heading', { name: /Score Match/i })
  },

  // Header elements
  get backLink() {
    return screen.getByRole('link', { name: /back/i })
  },

  get gameCounter() {
    // Get all matching elements and return the one in the header (first one)
    const elements = screen.getAllByText(/Game \d+ of \d+|Match Complete/i)
    return elements[0]
  },

  // Game score form
  get gameList() {
    return screen.getByRole('list', { name: /game scores/i })
  },

  get gameRows() {
    return screen.getAllByRole('group')
  },

  getGameRow(gameNumber: number) {
    return screen.getByRole('group', { name: `Game ${gameNumber}` })
  },

  // End/Save button (text changes based on match state)
  get endMatchButton() {
    return screen.getByRole('button', { name: /end match|save match/i })
  },

  get saveButton() {
    return screen.getByRole('button', { name: /save match/i })
  },

  // Loading state
  get loadingSpinner() {
    return screen.queryByRole('status')
  },

  // Actions for game scores
  async incrementPlayerScore(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const buttons = within(row).getAllByRole('button', { name: /increase score/i })
    await userEvent.click(buttons[0])
  },

  async decrementPlayerScore(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const buttons = within(row).getAllByRole('button', { name: /decrease score/i })
    await userEvent.click(buttons[0])
  },

  async incrementOpponentScore(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const buttons = within(row).getAllByRole('button', { name: /increase score/i })
    await userEvent.click(buttons[1])
  },

  async decrementOpponentScore(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const buttons = within(row).getAllByRole('button', { name: /decrease score/i })
    await userEvent.click(buttons[1])
  },

  async save() {
    await userEvent.click(this.endMatchButton)
  },

  async goBack() {
    await userEvent.click(this.backLink)
  },

  // Helpers
  getGameScores(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const scores = within(row).getAllByText(/^\d+$/)
    return {
      player: parseInt(scores[0]?.textContent || '0', 10),
      opponent: parseInt(scores[1]?.textContent || '0', 10),
    }
  },

  get matchCompleteMessage() {
    return screen.queryByText(/wins!/i)
  },

  getMatchWins() {
    // Find the .text-2xl elements in the match score header
    const scores = screen.getAllByText(/^\d+$/).filter(
      el => el.classList.contains('text-2xl')
    )
    return {
      player: parseInt(scores[0]?.textContent || '0', 10),
      opponent: parseInt(scores[1]?.textContent || '0', 10),
    }
  },
}
