import { describe, it, expect, beforeEach } from 'vitest'
import { matchScorePagePage } from './MatchScorePage.page'
import { clearAllMatches } from './lib/matchesDb'

describe('MatchScorePage', () => {
  beforeEach(async () => {
    await clearAllMatches()
  })

  describe('initial render', () => {
    it('displays back link', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.backLink).toBeInTheDocument()
    })

    it('displays game counter', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.gameCounter).toHaveTextContent('Game 1 of 5')
    })

    it('displays both player panels', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.playerPanel).toBeInTheDocument()
      expect(matchScorePagePage.opponentPanel).toBeInTheDocument()
    })

    it('displays initial score of 0-0', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.getPlayerScore()).toBe('0')
      expect(matchScorePagePage.getOpponentScore()).toBe('0')
    })

    it('displays undo button (disabled)', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.undoButton).toBeInTheDocument()
      expect(matchScorePagePage.undoButton).toBeDisabled()
    })

    it('displays save button', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.saveButton).toBeInTheDocument()
    })

    it('uses match length from stored match', async () => {
      await matchScorePagePage.render({
        match: { matchLength: 7 },
      })
      expect(matchScorePagePage.gameCounter).toHaveTextContent('Game 1 of 7')
    })
  })

  describe('scoring', () => {
    it('increments player score when player panel is tapped', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.tapPlayer()

      expect(matchScorePagePage.getPlayerScore()).toBe('1')
      expect(matchScorePagePage.getOpponentScore()).toBe('0')
    })

    it('increments opponent score when opponent panel is tapped', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.tapOpponent()

      expect(matchScorePagePage.getPlayerScore()).toBe('0')
      expect(matchScorePagePage.getOpponentScore()).toBe('1')
    })

    it('enables undo button after scoring', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.tapPlayer()

      expect(matchScorePagePage.undoButton).not.toBeDisabled()
    })

    it('shows previous score in undo label', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.tapPlayer()
      await matchScorePagePage.tapPlayer()

      expect(matchScorePagePage.undoLabel).toHaveTextContent('(1-0)')
    })
  })

  describe('undo', () => {
    it('reverts to previous score', async () => {
      await matchScorePagePage.render()
      await matchScorePagePage.tapPlayer()
      await matchScorePagePage.tapPlayer()

      await matchScorePagePage.undo()

      expect(matchScorePagePage.getPlayerScore()).toBe('1')
    })

    it('disables undo button after undoing all points', async () => {
      await matchScorePagePage.render()
      await matchScorePagePage.tapPlayer()

      await matchScorePagePage.undo()

      expect(matchScorePagePage.undoButton).toBeDisabled()
    })
  })

  describe('game progression', () => {
    it('resets score when game is won', async () => {
      await matchScorePagePage.render()

      // Score 11 points for player
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.tapPlayer()
      }

      // Score should reset for new game
      expect(matchScorePagePage.getPlayerScore()).toBe('0')
      expect(matchScorePagePage.getOpponentScore()).toBe('0')
    })

    it('advances game counter when game is won', async () => {
      await matchScorePagePage.render()

      // Score 11 points for player
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.tapPlayer()
      }

      expect(matchScorePagePage.gameCounter).toHaveTextContent('Game 2 of 5')
    })
  })

  describe('deuce rules', () => {
    it('requires 2-point lead to win at deuce', async () => {
      await matchScorePagePage.render()

      // Get to 10-10
      for (let i = 0; i < 10; i++) {
        await matchScorePagePage.tapPlayer()
        await matchScorePagePage.tapOpponent()
      }

      // Player goes to 11-10 (not enough to win)
      await matchScorePagePage.tapPlayer()

      expect(matchScorePagePage.getPlayerScore()).toBe('11')
      expect(matchScorePagePage.getOpponentScore()).toBe('10')
      expect(matchScorePagePage.gameCounter).toHaveTextContent('Game 1 of 5')
    })

    it('wins game with 2-point lead at deuce', async () => {
      await matchScorePagePage.render()

      // Get to 10-10
      for (let i = 0; i < 10; i++) {
        await matchScorePagePage.tapPlayer()
        await matchScorePagePage.tapOpponent()
      }

      // Player wins 12-10
      await matchScorePagePage.tapPlayer()
      await matchScorePagePage.tapPlayer()

      // Game should be over, scores reset
      expect(matchScorePagePage.getPlayerScore()).toBe('0')
      expect(matchScorePagePage.gameCounter).toHaveTextContent('Game 2 of 5')
    })
  })

  describe('match completion', () => {
    it('shows match complete when player wins majority', async () => {
      await matchScorePagePage.render({ match: { matchLength: 3 } })

      // Win 2 games (majority of 3)
      for (let game = 0; game < 2; game++) {
        for (let point = 0; point < 11; point++) {
          await matchScorePagePage.tapPlayer()
        }
      }

      expect(matchScorePagePage.gameCounter).toHaveTextContent('Match Complete')
    })

    it('changes save button text when match complete', async () => {
      await matchScorePagePage.render({ match: { matchLength: 1 } })

      // Win 1 game (best of 1)
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.tapPlayer()
      }

      expect(matchScorePagePage.saveButton).toHaveTextContent('Save Match')
    })
  })
})
