import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { createElement } from 'react'
import MatchScorePage from './MatchScorePage'
import { scoreDisplayPage } from './MatchScorePage/ScoreDisplay.page'
import { gameProgressPage } from './MatchScorePage/GameProgress.page'
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

  // Delegate to child page objects
  scoreDisplay: scoreDisplayPage,
  gameProgress: gameProgressPage,

  // Player panels
  get playerPanel() {
    return screen.getByRole('button', { name: /Add point to You/i })
  },

  get opponentPanel() {
    return screen.getByRole('button', { name: /Add point to Opponent/i })
  },

  // Undo
  get undoButton() {
    return screen.getByRole('button', { name: /undo/i })
  },

  get undoLabel() {
    return screen.queryByText(/\(\d+-\d+\)/)
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

  // Actions
  async tapPlayer() {
    await userEvent.click(this.playerPanel)
  },

  async tapOpponent() {
    await userEvent.click(this.opponentPanel)
  },

  async undo() {
    await userEvent.click(this.undoButton)
  },

  async save() {
    await userEvent.click(this.saveButton)
  },

  async goBack() {
    await userEvent.click(this.backLink)
  },

  // Helpers
  getPlayerScore() {
    return this.playerPanel.querySelector('.text-7xl')?.textContent
  },

  getOpponentScore() {
    return this.opponentPanel.querySelector('.text-7xl')?.textContent
  },
}
