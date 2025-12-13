import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import ActiveMatchBanner from './ActiveMatchBanner'
import { type StoredMatch } from '@lib/matchesDb'

export function createTestMatch(overrides: Partial<StoredMatch> = {}): StoredMatch {
  return {
    id: 'test-match-123',
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

interface RenderOptions {
  match?: StoredMatch
  onEndMatch?: () => void
}

export const activeMatchBannerPage = {
  render(options: RenderOptions = {}) {
    const match = options.match ?? createTestMatch()
    const onEndMatch = options.onEndMatch ?? vi.fn()

    render(
      <MemoryRouter>
        <ActiveMatchBanner match={match} onEndMatch={onEndMatch} />
      </MemoryRouter>
    )

    return { match, onEndMatch }
  },

  get banner() {
    return screen.getByRole('banner')
  },

  get inProgressBadge() {
    return screen.getByText(/in progress/i)
  },

  get resumeButton() {
    return screen.getByRole('button', { name: /resume/i })
  },

  get endButton() {
    return screen.getByRole('button', { name: /end/i })
  },

  async clickBanner() {
    await userEvent.click(this.banner)
  },

  async clickResumeButton() {
    await userEvent.click(this.resumeButton)
  },

  async clickEndButton() {
    await userEvent.click(this.endButton)
  },

  // Confirm dialog methods
  get confirmDialog() {
    return screen.queryByRole('dialog')
  },

  get confirmDialogTitle() {
    return screen.queryByText(/end this match\?/i)
  },

  get confirmDialogMessage() {
    return screen.queryByText(/you can only have one active match/i)
  },

  get cancelButton() {
    return screen.getByRole('button', { name: /cancel/i })
  },

  get confirmEndButton() {
    // Get the button inside the modal (not the "End…" button in the banner)
    const dialog = this.confirmDialog
    if (!dialog) return null
    return within(dialog).getByRole('button', { name: /end match/i })
  },

  async clickCancelButton() {
    await userEvent.click(this.cancelButton)
  },

  async clickConfirmEndButton() {
    const button = this.confirmEndButton
    if (button) await userEvent.click(button)
  },

  get scoreDisplay() {
    // The score line shows "You vs Opp"
    return screen.getByText(/you vs opp/i)
  },

  getMatchLengthText(matchLength: number) {
    if (matchLength === 1) {
      return screen.getByText(/single/i)
    }
    return screen.getByText(new RegExp(`bo${matchLength}`, 'i'))
  },
}
