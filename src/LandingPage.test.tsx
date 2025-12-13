import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { landingPagePage } from './LandingPage.page'
import { newMatchPage } from './NewMatch.page'
import { saveMatch, type StoredMatch } from '@lib/matchesDb'

function createTestMatch(overrides: Partial<StoredMatch> = {}): StoredMatch {
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

describe('LandingPage', () => {
  describe('new match button', () => {
    it('displays the new match button', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()
      expect(landingPagePage.newMatchButton).toBeInTheDocument()
    })

    it('has the correct button text', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()
      expect(landingPagePage.newMatchButton).toHaveTextContent('New match')
    })

    it('has the correct styling', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()
      expect(landingPagePage.newMatchButton).toHaveClass('btn', 'btn-primary')
    })

    it('navigates to new match page when clicked with no in-progress match', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      await landingPagePage.clickNewMatchButton()

      expect(newMatchPage.heroHeading).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('displays empty state when no matches exist', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      expect(landingPagePage.emptyState).toBeInTheDocument()
    })
  })

  describe('in-progress match modal', () => {
    beforeEach(async () => {
      const inProgressMatch = createTestMatch({
        id: 'in-progress-match',
        status: 'in_progress',
        games: [
          { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
          { player1Score: 8, player2Score: 11, winnerId: 'player-2' },
        ],
      })
      await saveMatch(inProgressMatch)
    })

    it('shows the modal when clicking New match with an in-progress match', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      await landingPagePage.clickNewMatchButton()

      expect(landingPagePage.inProgressMatchModal.dialog).toBeInTheDocument()
      expect(landingPagePage.inProgressMatchModal.title).toBeInTheDocument()
    })

    it('displays the match card with score in the modal', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      await landingPagePage.clickNewMatchButton()

      // Check the modal displays the in progress badge and match info
      expect(landingPagePage.inProgressMatchModal.inProgressBadge).toBeInTheDocument()
      expect(landingPagePage.inProgressMatchModal.helperText).toBeInTheDocument()
    })

    it('navigates to the match score page when clicking Resume', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      await landingPagePage.clickNewMatchButton()
      await landingPagePage.inProgressMatchModal.clickResume()

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /enter score/i })
        ).toBeInTheDocument()
      })
    })

    it('shows confirmation when clicking End match', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      await landingPagePage.clickNewMatchButton()
      await landingPagePage.inProgressMatchModal.clickEndMatch()

      expect(landingPagePage.inProgressMatchModal.confirmTitle).toBeInTheDocument()
    })

    it('navigates to new match page after confirming end match', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      await landingPagePage.clickNewMatchButton()
      await landingPagePage.inProgressMatchModal.clickEndMatch()
      await landingPagePage.inProgressMatchModal.clickConfirmEnd()

      await waitFor(() => {
        expect(newMatchPage.heroHeading).toBeInTheDocument()
      })
    })

    it('closes the modal when clicking Cancel', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      await landingPagePage.clickNewMatchButton()
      expect(landingPagePage.inProgressMatchModal.dialog).toHaveClass('modal-open')

      await landingPagePage.inProgressMatchModal.clickCancel()

      await waitFor(() => {
        const dialog = document.querySelector('dialog')
        expect(dialog).not.toHaveClass('modal-open')
      })
    })

    it('closes the modal when clicking the backdrop', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      await landingPagePage.clickNewMatchButton()
      expect(landingPagePage.inProgressMatchModal.dialog).toHaveClass('modal-open')

      await landingPagePage.inProgressMatchModal.clickClose()

      await waitFor(() => {
        const dialog = document.querySelector('dialog')
        expect(dialog).not.toHaveClass('modal-open')
      })
    })
  })
})
