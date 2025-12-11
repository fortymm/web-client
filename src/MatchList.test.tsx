import { describe, it, expect } from 'vitest'
import { matchListPage, createTestMatch } from './MatchList.page'

describe('MatchList', () => {
  describe('with no matches', () => {
    it('renders empty without crashing', () => {
      matchListPage.render([])
      // Should not throw and no match cards should be present
      expect(() => matchListPage.matchCards).toThrow()
    })
  })

  describe('with in-progress matches', () => {
    it('displays the in progress section', () => {
      const match = createTestMatch({ status: 'in_progress' })
      matchListPage.render([match])

      expect(matchListPage.inProgressSection).toBeInTheDocument()
    })

    it('shows the in progress badge', () => {
      const match = createTestMatch({ status: 'in_progress' })
      matchListPage.render([match])

      expect(matchListPage.inProgressBadges.length).toBeGreaterThan(0)
    })

    it('displays a progress bar', () => {
      const match = createTestMatch({
        status: 'in_progress',
        games: [
          { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
        ],
      })
      matchListPage.render([match])

      const card = matchListPage.matchCards[0]
      expect(matchListPage.getProgressBar(card)).toBeInTheDocument()
    })

    it('links to the score page for in-progress matches', () => {
      const match = createTestMatch({ id: 'match-123', status: 'in_progress' })
      matchListPage.render([match])

      const card = matchListPage.matchCards[0]
      expect(card).toHaveAttribute('href', '/matches/match-123/score')
    })
  })

  describe('with completed matches', () => {
    it('displays the recent matches section', () => {
      const match = createTestMatch({
        status: 'completed',
        winnerId: 'player-1',
        games: [
          { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
          { player1Score: 11, player2Score: 7, winnerId: 'player-1' },
          { player1Score: 11, player2Score: 9, winnerId: 'player-1' },
        ],
      })
      matchListPage.render([match])

      expect(matchListPage.recentMatchesSection).toBeInTheDocument()
    })

    it('shows Won badge when player wins', () => {
      const match = createTestMatch({
        status: 'completed',
        winnerId: 'player-1',
        games: [
          { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
          { player1Score: 11, player2Score: 7, winnerId: 'player-1' },
          { player1Score: 11, player2Score: 9, winnerId: 'player-1' },
        ],
      })
      matchListPage.render([match])

      expect(matchListPage.wonBadges.length).toBe(1)
    })

    it('shows Lost badge when player loses', () => {
      const match = createTestMatch({
        status: 'completed',
        winnerId: 'player-2',
        games: [
          { player1Score: 5, player2Score: 11, winnerId: 'player-2' },
          { player1Score: 7, player2Score: 11, winnerId: 'player-2' },
          { player1Score: 9, player2Score: 11, winnerId: 'player-2' },
        ],
      })
      matchListPage.render([match])

      expect(matchListPage.lostBadges.length).toBe(1)
    })

    it('does not display a progress bar for completed matches', () => {
      const match = createTestMatch({
        status: 'completed',
        winnerId: 'player-1',
        games: [
          { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
          { player1Score: 11, player2Score: 7, winnerId: 'player-1' },
          { player1Score: 11, player2Score: 9, winnerId: 'player-1' },
        ],
      })
      matchListPage.render([match])

      const card = matchListPage.matchCards[0]
      expect(matchListPage.getProgressBar(card)).not.toBeInTheDocument()
    })

    it('links to the match detail page for completed matches', () => {
      const match = createTestMatch({
        id: 'match-456',
        status: 'completed',
        winnerId: 'player-1',
      })
      matchListPage.render([match])

      const card = matchListPage.matchCards[0]
      expect(card).toHaveAttribute('href', '/matches/match-456')
    })
  })

  describe('with mixed matches', () => {
    it('separates in-progress and completed matches', () => {
      const inProgressMatch = createTestMatch({
        id: 'in-progress-1',
        status: 'in_progress',
      })
      const completedMatch = createTestMatch({
        id: 'completed-1',
        status: 'completed',
        winnerId: 'player-1',
      })
      matchListPage.render([inProgressMatch, completedMatch])

      expect(matchListPage.inProgressSection).toBeInTheDocument()
      expect(matchListPage.recentMatchesSection).toBeInTheDocument()
      expect(matchListPage.matchCards).toHaveLength(2)
    })
  })

  describe('score display', () => {
    it('shows the correct score for each player', () => {
      const match = createTestMatch({
        status: 'in_progress',
        games: [
          { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
          { player1Score: 8, player2Score: 11, winnerId: 'player-2' },
        ],
      })
      matchListPage.render([match])

      const card = matchListPage.matchCards[0]
      // Player 1 has 1 win, Player 2 has 1 win
      expect(card.textContent).toContain('1')
    })
  })
})
