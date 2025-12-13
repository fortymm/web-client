import { describe, it, expect } from 'vitest'
import {
  inProgressMatchModalPage,
  buildStoredMatch,
  buildGameScore,
} from './InProgressMatchModal.page'

describe('InProgressMatchModal', () => {
  describe('rendering', () => {
    it('displays the dialog when open', () => {
      inProgressMatchModalPage.render({ isOpen: true })
      expect(inProgressMatchModalPage.dialog).toBeInTheDocument()
    })

    it('displays the title', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.title).toBeInTheDocument()
    })

    it('displays default opponent name when not provided', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.getOpponentName()).toBe('Opponent')
    })

    it('displays custom opponent name when provided', () => {
      inProgressMatchModalPage.render({ opponentName: 'Alex Chen' })
      expect(inProgressMatchModalPage.getOpponentName()).toBe('Alex Chen')
    })

    it('displays match score', () => {
      const match = buildStoredMatch({
        games: [
          buildGameScore({ winnerId: 'player-1' }),
          buildGameScore({ winnerId: 'player-2' }),
          buildGameScore({ winnerId: 'player-1' }),
        ],
      })
      inProgressMatchModalPage.render({ match })
      expect(inProgressMatchModalPage.getScore()).toBe('2-1')
    })

    it('displays 0-0 for match with no games', () => {
      const match = buildStoredMatch({ games: [] })
      inProgressMatchModalPage.render({ match })
      expect(inProgressMatchModalPage.getScore()).toBe('0-0')
    })

    it('displays continue button', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.continueButton).toBeInTheDocument()
    })

    it('displays end and start new button', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.endAndStartNewButton).toBeInTheDocument()
    })
  })

  describe('actions', () => {
    it('calls onContinue when continue button is clicked', async () => {
      const { onContinue } = inProgressMatchModalPage.render()
      await inProgressMatchModalPage.clickContinue()
      expect(onContinue).toHaveBeenCalledTimes(1)
    })

    it('calls onEndAndStartNew when end button is clicked', async () => {
      const { onEndAndStartNew } = inProgressMatchModalPage.render()
      await inProgressMatchModalPage.clickEndAndStartNew()
      expect(onEndAndStartNew).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when backdrop is clicked', async () => {
      const { onClose } = inProgressMatchModalPage.render()
      await inProgressMatchModalPage.clickClose()
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('button styling', () => {
    it('continue button has primary styling', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.continueButton).toHaveClass(
        'btn',
        'btn-primary',
        'btn-block'
      )
    })

    it('end button has outline styling', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.endAndStartNewButton).toHaveClass(
        'btn',
        'btn-outline',
        'btn-block'
      )
    })
  })
})
