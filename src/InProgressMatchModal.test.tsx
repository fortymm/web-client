import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
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

    it('displays helper text', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.helperText).toBeInTheDocument()
    })

    it('displays in progress badge', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.inProgressBadge).toBeInTheDocument()
    })

    it('displays progress bar', () => {
      const match = buildStoredMatch({ matchLength: 5 })
      inProgressMatchModalPage.render({ match })
      // Check that the progress bar segments exist
      const progressBar = document.querySelector('[role="progressbar"]')
      expect(progressBar).toBeInTheDocument()
    })

    it('displays match length', () => {
      const match = buildStoredMatch({ matchLength: 5 })
      inProgressMatchModalPage.render({ match })
      expect(inProgressMatchModalPage.getMatchLength()).toBe('Best of 5')
    })

    it('displays single game for matchLength 1', () => {
      const match = buildStoredMatch({ matchLength: 1 })
      inProgressMatchModalPage.render({ match })
      expect(inProgressMatchModalPage.getMatchLength()).toBe('Single game')
    })

    it('displays started time', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.getStartedTime()).toMatch(/Started/)
    })

    it('displays resume button', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.resumeButton).toBeInTheDocument()
    })

    it('displays cancel button', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.cancelButton).toBeInTheDocument()
    })

    it('displays end match button', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.endMatchButton).toBeInTheDocument()
    })
  })

  describe('match card display', () => {
    it('displays score with correct wins', () => {
      const match = buildStoredMatch({
        matchLength: 5,
        games: [
          buildGameScore({ winnerId: 'player-1' }),
          buildGameScore({ winnerId: 'player-2' }),
          buildGameScore({ winnerId: 'player-1' }),
        ],
      })
      inProgressMatchModalPage.render({ match })
      // Check that 2 and 1 are displayed (player 1 has 2 wins, player 2 has 1)
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('displays opponent name in the card', () => {
      inProgressMatchModalPage.render({ opponentName: 'Alex Chen' })
      expect(screen.getByText('Alex Chen')).toBeInTheDocument()
    })

    it('displays default opponent name when not provided', () => {
      inProgressMatchModalPage.render()
      expect(screen.getByText('Opponent')).toBeInTheDocument()
    })
  })

  describe('actions', () => {
    it('calls onContinue when resume button is clicked', async () => {
      const { onContinue } = inProgressMatchModalPage.render()
      await inProgressMatchModalPage.clickResume()
      expect(onContinue).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when cancel button is clicked', async () => {
      const { onClose } = inProgressMatchModalPage.render()
      await inProgressMatchModalPage.clickCancel()
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when backdrop is clicked', async () => {
      const { onClose } = inProgressMatchModalPage.render()
      await inProgressMatchModalPage.clickClose()
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('end match confirmation', () => {
    it('shows confirmation dialog when end match is clicked', async () => {
      inProgressMatchModalPage.render()
      await inProgressMatchModalPage.clickEndMatch()
      expect(inProgressMatchModalPage.confirmTitle).toBeInTheDocument()
      expect(inProgressMatchModalPage.confirmMessage).toBeInTheDocument()
    })

    it('calls onEndMatch when confirm end is clicked', async () => {
      const { onEndMatch } = inProgressMatchModalPage.render()
      await inProgressMatchModalPage.clickEndMatch()
      await inProgressMatchModalPage.clickConfirmEnd()
      expect(onEndMatch).toHaveBeenCalledTimes(1)
    })

    it('returns to main view when go back is clicked', async () => {
      inProgressMatchModalPage.render()
      await inProgressMatchModalPage.clickEndMatch()
      expect(inProgressMatchModalPage.confirmTitle).toBeInTheDocument()

      await inProgressMatchModalPage.clickGoBack()
      expect(inProgressMatchModalPage.title).toBeInTheDocument()
      expect(screen.queryByText('End match?')).not.toBeInTheDocument()
    })
  })

  describe('button styling', () => {
    it('resume button has primary styling', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.resumeButton).toHaveClass(
        'btn',
        'btn-primary',
        'btn-block'
      )
    })

    it('cancel button has ghost styling', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.cancelButton).toHaveClass(
        'btn',
        'btn-ghost',
        'btn-block'
      )
    })

    it('end match button has error link styling', () => {
      inProgressMatchModalPage.render()
      expect(inProgressMatchModalPage.endMatchButton).toHaveClass(
        'btn',
        'btn-link',
        'text-error'
      )
    })
  })
})
