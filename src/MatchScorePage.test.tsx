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

    it('displays all game rows', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.gameRows).toHaveLength(5)
    })

    it('displays initial scores of 0-0 for all games', async () => {
      await matchScorePagePage.render()
      for (let game = 1; game <= 5; game++) {
        const scores = matchScorePagePage.getGameScores(game)
        expect(scores.player).toBe(0)
        expect(scores.opponent).toBe(0)
      }
    })

    it('displays end match button', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.endMatchButton).toBeInTheDocument()
      expect(matchScorePagePage.endMatchButton).toHaveTextContent('End match early')
    })

    it('uses match length from stored match', async () => {
      await matchScorePagePage.render({
        match: { matchLength: 7 },
      })
      expect(matchScorePagePage.gameCounter).toHaveTextContent('Game 1 of 7')
      expect(matchScorePagePage.gameRows).toHaveLength(7)
    })

    it('uses match length of 3 from stored match', async () => {
      await matchScorePagePage.render({
        match: { matchLength: 3 },
      })
      expect(matchScorePagePage.gameRows).toHaveLength(3)
    })
  })

  describe('score entry', () => {
    it('increments player score when + is clicked', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.incrementPlayerScore(1)

      const scores = matchScorePagePage.getGameScores(1)
      expect(scores.player).toBe(1)
      expect(scores.opponent).toBe(0)
    })

    it('increments opponent score when + is clicked', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.incrementOpponentScore(1)

      const scores = matchScorePagePage.getGameScores(1)
      expect(scores.player).toBe(0)
      expect(scores.opponent).toBe(1)
    })

    it('decrements player score when - is clicked', async () => {
      await matchScorePagePage.render()

      await matchScorePagePage.incrementPlayerScore(1)
      await matchScorePagePage.incrementPlayerScore(1)
      await matchScorePagePage.decrementPlayerScore(1)

      const scores = matchScorePagePage.getGameScores(1)
      expect(scores.player).toBe(1)
    })

    it('does not decrement below 0', async () => {
      await matchScorePagePage.render()

      // Try to decrement from 0 (button should be disabled)
      const row = matchScorePagePage.getGameRow(1)
      const decrementButtons = row.querySelectorAll('button[aria-label="Decrease score"]')
      expect(decrementButtons[0]).toBeDisabled()
    })

    it('allows scoring multiple games', async () => {
      await matchScorePagePage.render()

      // Enter score for game 1: 11-7
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.incrementPlayerScore(1)
      }
      for (let i = 0; i < 7; i++) {
        await matchScorePagePage.incrementOpponentScore(1)
      }

      // Enter score for game 2: 9-11
      for (let i = 0; i < 9; i++) {
        await matchScorePagePage.incrementPlayerScore(2)
      }
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.incrementOpponentScore(2)
      }

      const game1 = matchScorePagePage.getGameScores(1)
      expect(game1.player).toBe(11)
      expect(game1.opponent).toBe(7)

      const game2 = matchScorePagePage.getGameScores(2)
      expect(game2.player).toBe(9)
      expect(game2.opponent).toBe(11)
    })
  })

  describe('game completion detection', () => {
    it('marks game as complete at 11-0', async () => {
      await matchScorePagePage.render()

      // Enter 11-0
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.incrementPlayerScore(1)
      }

      const row = matchScorePagePage.getGameRow(1)
      expect(row.querySelector('[aria-label="Game complete"]')).toBeInTheDocument()
    })

    it('does not mark game complete at 11-10 (no 2-point lead)', async () => {
      await matchScorePagePage.render()

      // Enter 11-10
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.incrementPlayerScore(1)
      }
      for (let i = 0; i < 10; i++) {
        await matchScorePagePage.incrementOpponentScore(1)
      }

      const row = matchScorePagePage.getGameRow(1)
      expect(row.querySelector('[aria-label="Game complete"]')).not.toBeInTheDocument()
    })

    it('marks game complete at 12-10', async () => {
      await matchScorePagePage.render()

      // Enter 12-10
      for (let i = 0; i < 12; i++) {
        await matchScorePagePage.incrementPlayerScore(1)
      }
      for (let i = 0; i < 10; i++) {
        await matchScorePagePage.incrementOpponentScore(1)
      }

      const row = matchScorePagePage.getGameRow(1)
      expect(row.querySelector('[aria-label="Game complete"]')).toBeInTheDocument()
    })
  })

  describe('match score tracking', () => {
    it('updates match wins when game is complete', async () => {
      await matchScorePagePage.render()

      // Enter 11-7 for game 1 (player wins)
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.incrementPlayerScore(1)
      }
      for (let i = 0; i < 7; i++) {
        await matchScorePagePage.incrementOpponentScore(1)
      }

      const wins = matchScorePagePage.getMatchWins()
      expect(wins.player).toBe(1)
      expect(wins.opponent).toBe(0)
    })

    it('tracks opponent wins', async () => {
      await matchScorePagePage.render()

      // Enter 7-11 for game 1 (opponent wins)
      for (let i = 0; i < 7; i++) {
        await matchScorePagePage.incrementPlayerScore(1)
      }
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.incrementOpponentScore(1)
      }

      const wins = matchScorePagePage.getMatchWins()
      expect(wins.player).toBe(0)
      expect(wins.opponent).toBe(1)
    })
  })

  describe('match completion', () => {
    it('shows match complete when player wins majority', async () => {
      await matchScorePagePage.render({ match: { matchLength: 3 } })

      // Enter 11-0 for games 1 and 2 (player wins 2 of 3)
      for (let game = 1; game <= 2; game++) {
        for (let i = 0; i < 11; i++) {
          await matchScorePagePage.incrementPlayerScore(game)
        }
      }

      expect(matchScorePagePage.gameCounter).toHaveTextContent('Match Complete')
      expect(matchScorePagePage.matchCompleteMessage).toHaveTextContent('wins!')
    })

    it('changes save button text when match complete', async () => {
      await matchScorePagePage.render({ match: { matchLength: 1 } })

      // Enter 11-0 for game 1 (best of 1)
      for (let i = 0; i < 11; i++) {
        await matchScorePagePage.incrementPlayerScore(1)
      }

      expect(matchScorePagePage.saveButton).toHaveTextContent('Save Match')
    })

    it('shows opponent win message when opponent wins', async () => {
      await matchScorePagePage.render({ match: { matchLength: 3 } })

      // Enter 0-11 for games 1 and 2 (opponent wins 2 of 3)
      for (let game = 1; game <= 2; game++) {
        for (let i = 0; i < 11; i++) {
          await matchScorePagePage.incrementOpponentScore(game)
        }
      }

      expect(matchScorePagePage.matchCompleteMessage).toHaveTextContent('wins!')
    })
  })

  describe('accessibility', () => {
    it('has accessible heading', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.heading).toBeInTheDocument()
    })

    it('has accessible game list', async () => {
      await matchScorePagePage.render()
      expect(matchScorePagePage.gameList).toHaveAccessibleName('Game scores')
    })

    it('each game row has accessible name', async () => {
      await matchScorePagePage.render()
      for (let game = 1; game <= 5; game++) {
        const row = matchScorePagePage.getGameRow(game)
        expect(row).toHaveAccessibleName(`Game ${game}`)
      }
    })
  })
})
