import { describe, it, expect } from 'vitest'
import { scoreCardPage } from './ScoreCard.page'

describe('ScoreCard', () => {
  describe('display', () => {
    it('shows game number in pill', () => {
      scoreCardPage.render({ gameNumber: 2 })
      expect(scoreCardPage.gamePill).toHaveTextContent('G2')
    })

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
      expect(scoreCardPage.statusText).toHaveTextContent('Tied 5–5')
    })

    it('shows empty status text at 0-0', () => {
      scoreCardPage.render({ playerScore: 0, opponentScore: 0 })
      // Status text is empty at 0-0, so query returns null
      expect(scoreCardPage.statusText).toBeNull()
    })

    it('shows helper text with rules', () => {
      scoreCardPage.render()
      expect(scoreCardPage.helperText).toHaveTextContent('To 11 · Win by 2')
    })

    it('shows deuce helper text at 10-10', () => {
      scoreCardPage.render({ playerScore: 10, opponentScore: 10 })
      expect(scoreCardPage.helperText).toHaveTextContent('Win by 2')
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

    it('disables all scoring when game is complete', () => {
      scoreCardPage.render({ isGameComplete: true })
      expect(scoreCardPage.playerIncrementButton).toBeDisabled()
      expect(scoreCardPage.opponentIncrementButton).toBeDisabled()
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

    it('shows game complete helper text when player wins', () => {
      scoreCardPage.render({
        isGameComplete: true,
        playerScore: 11,
        opponentScore: 7
      })
      expect(scoreCardPage.helperText).toHaveTextContent('Game complete – You win')
    })

    it('shows next game button when game is complete', () => {
      scoreCardPage.render({
        gameNumber: 1,
        isGameComplete: true
      })
      expect(scoreCardPage.nextGameButton).toBeInTheDocument()
      expect(scoreCardPage.nextGameButton).toHaveTextContent('Save game & start next')
    })

    it('calls onNextGame when next game button clicked', async () => {
      const { onNextGame } = scoreCardPage.render({ isGameComplete: true })
      await scoreCardPage.clickNextGame()
      expect(onNextGame).toHaveBeenCalled()
    })

    it('hides end match early button when game is complete', () => {
      scoreCardPage.render({ isGameComplete: true })
      expect(scoreCardPage.endMatchEarlyButton).not.toBeInTheDocument()
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
    it('shows match complete helper text when player wins', () => {
      scoreCardPage.render({
        isMatchComplete: true,
        isGameComplete: true,
        playerScore: 11,
        opponentScore: 5
      })
      expect(scoreCardPage.helperText).toHaveTextContent('Match complete – You win!')
    })

    it('shows save match button when match is complete', () => {
      scoreCardPage.render({ isMatchComplete: true, isGameComplete: true })
      expect(scoreCardPage.saveMatchButton).toBeInTheDocument()
    })

    it('calls onEndMatch when save match clicked', async () => {
      const { onEndMatch } = scoreCardPage.render({ isMatchComplete: true, isGameComplete: true })
      await scoreCardPage.clickSaveMatch()
      expect(onEndMatch).toHaveBeenCalled()
    })
  })

  describe('end match early', () => {
    it('shows end match early link during game', () => {
      scoreCardPage.render()
      expect(scoreCardPage.endMatchEarlyButton).toBeInTheDocument()
    })

    it('calls onEndMatch when clicked', async () => {
      const { onEndMatch } = scoreCardPage.render()
      await scoreCardPage.clickEndMatchEarly()
      expect(onEndMatch).toHaveBeenCalled()
    })

    it('is styled as a link (has underline)', () => {
      scoreCardPage.render()
      expect(scoreCardPage.endMatchEarlyButton).toHaveClass('underline')
    })
  })
})
