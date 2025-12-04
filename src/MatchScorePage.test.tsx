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

    it('displays initial score of 0-0', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.playerScore).toBe(0)
      expect(matchScorePagePage.opponentScore).toBe(0)
    })

    it('displays caption text with rules', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.captionText).toHaveTextContent('To 11 · Win by 2')
    })

    it('displays big + buttons for scoring', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.playerAddButton).toBeInTheDocument()
      expect(matchScorePagePage.opponentAddButton).toBeInTheDocument()
    })

    it('displays CTA button (disabled initially)', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.ctaButton).toBeInTheDocument()
      expect(matchScorePagePage.ctaButton).toBeDisabled()
    })

    it('uses match length from stored match', async () => {
      await matchScorePagePage.render({
        match: { matchLength: 7 },
      })
      expect(matchScorePagePage.gameCounter).toHaveTextContent('Game 1 of 7')
    })
  })

  describe('scoring', () => {
    it('increments player score when + clicked', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.addPlayerPoint()

      expect(matchScorePagePage.playerScore).toBe(1)
      expect(matchScorePagePage.opponentScore).toBe(0)
    })

    it('increments opponent score when + clicked', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.addOpponentPoint()

      expect(matchScorePagePage.playerScore).toBe(0)
      expect(matchScorePagePage.opponentScore).toBe(1)
    })

    it('decrements player score when - clicked', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.addPlayerPoint()
      await matchScorePagePage.addPlayerPoint()
      await matchScorePagePage.subtractPlayerPoint()

      expect(matchScorePagePage.playerScore).toBe(1)
    })

    it('does not decrement below 0', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.playerSubtractButton).toBeDisabled()
    })

    it('shows lead status when player ahead', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.addPlayerPoint()
      await matchScorePagePage.addPlayerPoint()
      await matchScorePagePage.addPlayerPoint()

      expect(matchScorePagePage.statusText).toHaveTextContent('You lead by 3')
    })

    it('shows lead status when opponent ahead', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.addOpponentPoint()
      await matchScorePagePage.addOpponentPoint()

      expect(matchScorePagePage.statusText).toHaveTextContent('Opponent leads by 2')
    })
  })

  describe('game completion', () => {
    it('enables CTA button when game is complete', async () => {
      await matchScorePagePage.render()

      // Score 11-0
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.addPlayerPoint()
      }

      expect(matchScorePagePage.ctaButton).not.toBeDisabled()
      expect(matchScorePagePage.nextGameButton).toBeInTheDocument()
      expect(matchScorePagePage.nextGameButton).toHaveTextContent('Save game & start next')
    })

    it('keeps scoring enabled when game is complete', async () => {
      await matchScorePagePage.render()

      // Score 11-0
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.addPlayerPoint()
      }

      expect(matchScorePagePage.playerAddButton).not.toBeDisabled()
      expect(matchScorePagePage.opponentAddButton).not.toBeDisabled()
    })

    it('advances to next game when button clicked', async () => {
      await matchScorePagePage.render()

      // Complete game 1
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.addPlayerPoint()
      }
      await matchScorePagePage.clickNextGame()

      expect(matchScorePagePage.gameCounter).toHaveTextContent('Game 2 of 5')
      expect(matchScorePagePage.playerScore).toBe(0)
      expect(matchScorePagePage.opponentScore).toBe(0)
    })

    it('shows completed game as badge', async () => {
      await matchScorePagePage.render()

      // Complete game 1
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.addPlayerPoint()
      }
      await matchScorePagePage.clickNextGame()

      expect(matchScorePagePage.completedGameBadges.length).toBe(1)
    })

    it('shows game complete caption text', async () => {
      await matchScorePagePage.render()

      // Score 11-0
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.addPlayerPoint()
      }

      expect(matchScorePagePage.captionText).toHaveTextContent('Game complete – You win')
    })
  })

  describe('deuce rules', () => {
    it('requires 2-point lead to win at deuce', async () => {
      await matchScorePagePage.render()

      // Get to 10-10
      for (let i = 0; i < 10; i++) {
        await matchScorePagePage.addPlayerPoint()
        await matchScorePagePage.addOpponentPoint()
      }

      // Player goes to 11-10 (not enough to win)
      await matchScorePagePage.addPlayerPoint()

      expect(matchScorePagePage.playerScore).toBe(11)
      expect(matchScorePagePage.opponentScore).toBe(10)
      // CTA is still disabled because game is not complete
      expect(matchScorePagePage.ctaButton).toBeDisabled()
    })

    it('shows deuce caption text at 10-10', async () => {
      await matchScorePagePage.render()

      // Get to 10-10
      for (let i = 0; i < 10; i++) {
        await matchScorePagePage.addPlayerPoint()
        await matchScorePagePage.addOpponentPoint()
      }

      expect(matchScorePagePage.captionText).toHaveTextContent('Win by 2')
    })

    it('wins game with 2-point lead at deuce', async () => {
      await matchScorePagePage.render()

      // Get to 10-10
      for (let i = 0; i < 10; i++) {
        await matchScorePagePage.addPlayerPoint()
        await matchScorePagePage.addOpponentPoint()
      }

      // Player wins 12-10
      await matchScorePagePage.addPlayerPoint()
      await matchScorePagePage.addPlayerPoint()

      expect(matchScorePagePage.ctaButton).not.toBeDisabled()
      expect(matchScorePagePage.nextGameButton).toBeInTheDocument()
    })
  })

  describe('match completion', () => {
    it('shows match complete when player wins majority', async () => {
      await matchScorePagePage.render({ match: { matchLength: 3 } })

      // Win 2 games (majority of 3)
      for (let game = 0; game < 2; game++) {
        for (let point = 0; point < 11; point++) {
          await matchScorePagePage.addPlayerPoint()
        }
        if (game < 1) await matchScorePagePage.clickNextGame()
      }

      expect(matchScorePagePage.gameCounter).toHaveTextContent('Match Complete')
    })

    it('shows finish match button when match complete', async () => {
      await matchScorePagePage.render({ match: { matchLength: 1 } })

      // Win 1 game (best of 1)
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.addPlayerPoint()
      }

      expect(matchScorePagePage.finishMatchButton).toBeInTheDocument()
    })

    it('shows match complete caption text', async () => {
      await matchScorePagePage.render({ match: { matchLength: 1 } })

      // Win 1 game (best of 1)
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.addPlayerPoint()
      }

      expect(matchScorePagePage.captionText).toHaveTextContent('Match complete – You win!')
    })
  })

  describe('accessibility', () => {
    it('has accessible heading', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.heading).toBeInTheDocument()
    })

    it('score buttons have accessible labels', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.playerAddButton).toHaveAccessibleName(/add point for you/i)
      expect(matchScorePagePage.opponentAddButton).toHaveAccessibleName(/add point for opponent/i)
    })
  })
})
