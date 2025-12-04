import { render, screen, waitFor } from '@testing-library/react'
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
    const elements = screen.getAllByText(/Game \d+ of \d+|Match Complete/i)
    return elements[0]
  },

  // ScoreCard elements
  get gamePill() {
    return screen.getByText(/^G\d+$/)
  },

  get statusText() {
    // Status text in center of card header - uses specific patterns to avoid helper text
    const patterns = [
      /^You lead by \d+$/i,
      /^Opponent leads by \d+$/i,
      /^Tied \d+–\d+$/i,
      /^You win$/i,
      /^Opponent wins$/i,
    ]
    for (const pattern of patterns) {
      const el = screen.queryByText(pattern)
      if (el) return el
    }
    return null
  },

  get helperText() {
    // Helper text is in the ScoreCard, matches specific patterns
    const patterns = [
      /^To 11 · Win by 2$/,
      /^Win by 2$/,
      /^Game complete – You win$/,
      /^Game complete – Opponent wins$/,
      /^Match complete – You win!$/,
      /^Match complete – Opponent wins$/,
    ]
    for (const pattern of patterns) {
      const el = screen.queryByText(pattern)
      if (el) return el
    }
    return screen.getByText(/To 11|Win by 2|Game complete|Match complete/i)
  },

  get playerScore() {
    const scores = document.querySelectorAll('.text-5xl')
    return parseInt(scores[0]?.textContent || '0', 10)
  },

  get opponentScore() {
    const scores = document.querySelectorAll('.text-5xl')
    return parseInt(scores[1]?.textContent || '0', 10)
  },

  get playerAddButton() {
    return screen.getByRole('button', { name: /add point for you/i })
  },

  get opponentAddButton() {
    return screen.getByRole('button', { name: /add point for opponent/i })
  },

  get playerSubtractButton() {
    return screen.getByRole('button', { name: /decrease you score/i })
  },

  get opponentSubtractButton() {
    return screen.getByRole('button', { name: /decrease opponent score/i })
  },

  get nextGameButton() {
    return screen.queryByRole('button', { name: /save game & start next/i })
  },

  get finishMatchButton() {
    return screen.queryByRole('button', { name: /save game & finish match/i })
  },

  // Completed games badges
  get completedGameBadges() {
    // Find badges by their class, not by text content (which could match status message)
    return document.querySelectorAll('.badge.badge-lg.badge-ghost')
  },

  // Actions
  async addPlayerPoint() {
    await userEvent.click(this.playerAddButton)
  },

  async addOpponentPoint() {
    await userEvent.click(this.opponentAddButton)
  },

  async subtractPlayerPoint() {
    await userEvent.click(this.playerSubtractButton)
  },

  async subtractOpponentPoint() {
    await userEvent.click(this.opponentSubtractButton)
  },

  async clickNextGame() {
    const btn = this.nextGameButton
    if (btn) await userEvent.click(btn)
  },

  async clickFinishMatch() {
    const btn = this.finishMatchButton
    if (btn) await userEvent.click(btn)
  },

  async goBack() {
    await userEvent.click(this.backLink)
  },
}
