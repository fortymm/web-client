import { describe, it, expect } from 'vitest'
import { scoreCardPage } from './ScoreCard.page'

describe('ScoreCard', () => {
  describe('display', () => {
    it('shows game number in status', () => {
      scoreCardPage.render({ gameNumber: 2 })
      expect(scoreCardPage.statusMessage).toHaveTextContent('G2')
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
      expect(scoreCardPage.statusMessage).toHaveTextContent('You lead by 3')
    })

    it('shows lead status when opponent is ahead', () => {
      scoreCardPage.render({ playerScore: 3, opponentScore: 7 })
      expect(scoreCardPage.statusMessage).toHaveTextContent('Opponent leads by 4')
    })

    it('shows just game number when tied', () => {
      scoreCardPage.render({ playerScore: 5, opponentScore: 5 })
      expect(scoreCardPage.statusMessage).toHaveTextContent('G1')
      expect(scoreCardPage.statusMessage).not.toHaveTextContent('lead')
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
    it('shows game complete status when player wins', () => {
      scoreCardPage.render({
        isGameComplete: true,
        playerScore: 11,
        opponentScore: 7
      })
      expect(scoreCardPage.statusMessage).toHaveTextContent('G1 complete')
      expect(scoreCardPage.statusMessage).toHaveTextContent('You won')
    })

    it('shows game complete status when opponent wins', () => {
      scoreCardPage.render({
        isGameComplete: true,
        playerScore: 7,
        opponentScore: 11
      })
      expect(scoreCardPage.statusMessage).toHaveTextContent('Opponent won')
    })

    it('shows next game button when game is complete', () => {
      scoreCardPage.render({
        gameNumber: 1,
        isGameComplete: true
      })
      expect(scoreCardPage.nextGameButton).toBeInTheDocument()
      expect(scoreCardPage.nextGameButton).toHaveTextContent('Save & Start Game 2')
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
  })

  describe('match complete state', () => {
    it('shows match complete status', () => {
      scoreCardPage.render({
        isMatchComplete: true,
        playerScore: 11,
        opponentScore: 5
      })
      expect(scoreCardPage.statusMessage).toHaveTextContent('Match complete')
      expect(scoreCardPage.statusMessage).toHaveTextContent('You won')
    })

    it('shows save match button when match is complete', () => {
      scoreCardPage.render({ isMatchComplete: true })
      expect(scoreCardPage.saveMatchButton).toBeInTheDocument()
    })

    it('calls onEndMatch when save match clicked', async () => {
      const { onEndMatch } = scoreCardPage.render({ isMatchComplete: true })
      await scoreCardPage.clickSaveMatch()
      expect(onEndMatch).toHaveBeenCalled()
    })
  })

  describe('end match early', () => {
    it('shows end match early button during game', () => {
      scoreCardPage.render()
      expect(scoreCardPage.endMatchEarlyButton).toBeInTheDocument()
    })

    it('calls onEndMatch when clicked', async () => {
      const { onEndMatch } = scoreCardPage.render()
      await scoreCardPage.clickEndMatchEarly()
      expect(onEndMatch).toHaveBeenCalled()
    })
  })
})
