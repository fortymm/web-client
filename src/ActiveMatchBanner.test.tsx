import { describe, it, expect, vi } from 'vitest'
import { activeMatchBannerPage, createTestMatch } from './ActiveMatchBanner.page'

describe('ActiveMatchBanner', () => {
  describe('display', () => {
    it('displays "In progress" badge', () => {
      activeMatchBannerPage.render()
      expect(activeMatchBannerPage.inProgressBadge).toBeInTheDocument()
    })

    it('displays the score', () => {
      const match = createTestMatch({
        games: [
          { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
          { player1Score: 3, player2Score: 11, winnerId: 'player-2' },
        ],
      })
      activeMatchBannerPage.render({ match })
      expect(activeMatchBannerPage.scoreDisplay).toBeInTheDocument()
    })

    it('displays Bo5 for multi-game matches', () => {
      const match = createTestMatch({ matchLength: 5 })
      activeMatchBannerPage.render({ match })
      expect(activeMatchBannerPage.getMatchLengthText(5)).toBeInTheDocument()
    })

    it('displays "Single" for single-game matches', () => {
      const match = createTestMatch({ matchLength: 1 })
      activeMatchBannerPage.render({ match })
      expect(activeMatchBannerPage.getMatchLengthText(1)).toBeInTheDocument()
    })

    it('displays Resume button', () => {
      activeMatchBannerPage.render()
      expect(activeMatchBannerPage.resumeButton).toBeInTheDocument()
    })

    it('displays End button', () => {
      activeMatchBannerPage.render()
      expect(activeMatchBannerPage.endButton).toBeInTheDocument()
    })
  })

  describe('Resume button', () => {
    it('has primary styling', () => {
      activeMatchBannerPage.render()
      expect(activeMatchBannerPage.resumeButton).toHaveClass('btn-primary')
    })
  })

  describe('End button', () => {
    it('has muted styling that shows error on hover', () => {
      activeMatchBannerPage.render()
      expect(activeMatchBannerPage.endButton).toHaveClass('hover:text-error')
    })
  })

  describe('confirm dialog', () => {
    it('opens confirm dialog when End button is clicked', async () => {
      activeMatchBannerPage.render()

      await activeMatchBannerPage.clickEndButton()

      expect(activeMatchBannerPage.confirmDialogTitle).toBeInTheDocument()
    })

    it('displays the one-active-match constraint message', async () => {
      activeMatchBannerPage.render()

      await activeMatchBannerPage.clickEndButton()

      expect(activeMatchBannerPage.confirmDialogMessage).toBeInTheDocument()
    })

    it('calls onEndMatch when confirmed', async () => {
      const onEndMatch = vi.fn()
      activeMatchBannerPage.render({ onEndMatch })

      await activeMatchBannerPage.clickEndButton()
      await activeMatchBannerPage.clickConfirmEndButton()

      expect(onEndMatch).toHaveBeenCalled()
    })

    it('does not call onEndMatch when cancelled', async () => {
      const onEndMatch = vi.fn()
      activeMatchBannerPage.render({ onEndMatch })

      await activeMatchBannerPage.clickEndButton()
      await activeMatchBannerPage.clickCancelButton()

      expect(onEndMatch).not.toHaveBeenCalled()
    })
  })

  describe('banner styling', () => {
    it('has card-like styling with border and rounding', () => {
      activeMatchBannerPage.render()
      expect(activeMatchBannerPage.banner).toHaveClass('border', 'rounded-lg')
    })

    it('is full width', () => {
      activeMatchBannerPage.render()
      expect(activeMatchBannerPage.banner).toHaveClass('w-full')
    })
  })
})
