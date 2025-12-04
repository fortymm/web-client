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
  get statusMessage() {
    // Status message contains more than just "G1" - it has context like lead info
    // Use getAllByText and filter to the one inside the ScoreCard (bg-base-200 container)
    const matches = screen.getAllByText(/G\d|Match complete/i)
    // Return the one that's inside the ScoreCard (the paragraph, not the badge)
    return matches.find(el =>
      el.tagName === 'P' || el.textContent?.includes('•') || el.textContent?.includes('complete')
    ) || matches[0]
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
    return screen.queryByRole('button', { name: /save & start game/i })
  },

  get saveMatchButton() {
    return screen.queryByRole('button', { name: /save match/i })
  },

  get endMatchEarlyButton() {
    return screen.queryByRole('button', { name: /end match early/i })
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

  async clickSaveMatch() {
    const btn = this.saveMatchButton
    if (btn) await userEvent.click(btn)
  },

  async clickEndMatchEarly() {
    const btn = this.endMatchEarlyButton
    if (btn) await userEvent.click(btn)
  },

  async goBack() {
    await userEvent.click(this.backLink)
  },
}
