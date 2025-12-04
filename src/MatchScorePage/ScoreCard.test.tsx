import { describe, it, expect } from 'vitest'
import { scoreCardPage } from './ScoreCard.page'

describe('ScoreCard', () => {
  describe('display', () => {
    it('shows player score', () => {
      scoreCardPage.render({ playerScore: 7 })
      expect(scoreCardPage.playerScore).toBe(7)
    })

    it('shows opponent score', () => {
      scoreCardPage.render({ opponentScore: 5 })
      expect(scoreCardPage.opponentScore).toBe(5)
    })

    it('shows lead status when player is ahead', () => {
      scoreCardPage.render({ playerScore: 8, opponentScore: 5 })
      expect(scoreCardPage.statusText).toHaveTextContent('You lead by 3')
    })

    it('shows lead status when opponent is ahead', () => {
      scoreCardPage.render({ playerScore: 3, opponentScore: 7 })
      expect(scoreCardPage.statusText).toHaveTextContent('Opponent leads by 4')
    })

    it('shows tied status when scores are equal', () => {
      scoreCardPage.render({ playerScore: 5, opponentScore: 5 })
      expect(scoreCardPage.statusText).toHaveTextContent('Tied at 5–5')
    })

    it('shows empty status text at 0-0', () => {
      scoreCardPage.render({ playerScore: 0, opponentScore: 0 })
      // Status text is empty at 0-0, so query returns null
      expect(scoreCardPage.statusText).toBeNull()
    })

    it('shows caption text with rules', () => {
      scoreCardPage.render()
      expect(scoreCardPage.captionText).toHaveTextContent('To 11 · Win by 2')
    })

    it('shows deuce caption text at 10-10', () => {
      scoreCardPage.render({ playerScore: 10, opponentScore: 10 })
      expect(scoreCardPage.captionText).toHaveTextContent('Win by 2')
    })
  })

  describe('CTA button', () => {
    it('is always visible', () => {
      scoreCardPage.render()
      expect(scoreCardPage.ctaButton).toBeInTheDocument()
    })

    it('is disabled when game is in progress', () => {
      scoreCardPage.render({ isGameComplete: false })
      expect(scoreCardPage.ctaButton).toBeDisabled()
    })

    it('is enabled when game is complete', () => {
      scoreCardPage.render({ isGameComplete: true })
      expect(scoreCardPage.ctaButton).not.toBeDisabled()
    })

    it('shows next game text when more games remain', () => {
      scoreCardPage.render({ gameNumber: 1, matchLength: 5 })
      expect(scoreCardPage.nextGameButton).toBeInTheDocument()
    })

    it('shows finish match text on last game', () => {
      scoreCardPage.render({ gameNumber: 5, matchLength: 5 })
      expect(scoreCardPage.finishMatchButton).toBeInTheDocument()
    })
  })

  describe('scoring', () => {
    it('calls onPlayerScoreChange with 1 when + clicked', async () => {
      const { onPlayerScoreChange } = scoreCardPage.render()
      await scoreCardPage.addPlayerPoint()
      expect(onPlayerScoreChange).toHaveBeenCalledWith(1)
    })

    it('calls onOpponentScoreChange with 1 when + clicked', async () => {
      const { onOpponentScoreChange } = scoreCardPage.render()
      await scoreCardPage.addOpponentPoint()
      expect(onOpponentScoreChange).toHaveBeenCalledWith(1)
    })

    it('calls onPlayerScoreChange with -1 when - clicked', async () => {
      const { onPlayerScoreChange } = scoreCardPage.render({ playerScore: 5 })
      await scoreCardPage.subtractPlayerPoint()
      expect(onPlayerScoreChange).toHaveBeenCalledWith(-1)
    })

    it('disables decrement when score is 0', () => {
      scoreCardPage.render({ playerScore: 0 })
      expect(scoreCardPage.playerDecrementButton).toBeDisabled()
    })

    it('keeps scoring enabled when game is complete', () => {
      scoreCardPage.render({ isGameComplete: true })
      expect(scoreCardPage.playerIncrementButton).not.toBeDisabled()
      expect(scoreCardPage.opponentIncrementButton).not.toBeDisabled()
    })
  })

  describe('game complete state', () => {
    it('shows You win status when player wins', () => {
      scoreCardPage.render({
        isGameComplete: true,
        playerScore: 11,
        opponentScore: 7
      })
      expect(scoreCardPage.statusText).toHaveTextContent('You win')
    })

    it('shows Opponent wins status when opponent wins', () => {
      scoreCardPage.render({
        isGameComplete: true,
        playerScore: 7,
        opponentScore: 11
      })
      expect(scoreCardPage.statusText).toHaveTextContent('Opponent wins')
    })

    it('shows game complete caption text when player wins', () => {
      scoreCardPage.render({
        isGameComplete: true,
        playerScore: 11,
        opponentScore: 7
      })
      expect(scoreCardPage.captionText).toHaveTextContent('Game complete – You win')
    })

    it('calls onNextGame when next game button clicked', async () => {
      const { onNextGame } = scoreCardPage.render({ isGameComplete: true })
      await scoreCardPage.clickNextGame()
      expect(onNextGame).toHaveBeenCalled()
    })

    it('shows finish match button on last game', () => {
      scoreCardPage.render({
        gameNumber: 5,
        matchLength: 5,
        isGameComplete: true
      })
      expect(scoreCardPage.finishMatchButton).toBeInTheDocument()
      expect(scoreCardPage.finishMatchButton).toHaveTextContent('Save game & finish match')
    })
  })

  describe('match complete state', () => {
    it('shows match complete caption text when player wins', () => {
      scoreCardPage.render({
        isMatchComplete: true,
        isGameComplete: true,
        playerScore: 11,
        opponentScore: 5
      })
      expect(scoreCardPage.captionText).toHaveTextContent('Match complete – You win!')
    })

    it('shows finish match button when match is complete', () => {
      scoreCardPage.render({ isMatchComplete: true, isGameComplete: true })
      expect(scoreCardPage.finishMatchButton).toBeInTheDocument()
    })

    it('calls onFinishMatch when finish match clicked', async () => {
      const { onFinishMatch } = scoreCardPage.render({ isMatchComplete: true, isGameComplete: true })
      await scoreCardPage.clickFinishMatch()
      expect(onFinishMatch).toHaveBeenCalled()
    })

    it('keeps scoring enabled in match complete state', () => {
      scoreCardPage.render({ isMatchComplete: true, isGameComplete: true })
      expect(scoreCardPage.playerIncrementButton).not.toBeDisabled()
      expect(scoreCardPage.opponentIncrementButton).not.toBeDisabled()
    })
  })
})
