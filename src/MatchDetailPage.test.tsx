import { describe, it, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { matchDetailPagePage } from './MatchDetailPage.page'
import { clearAllMatches } from './lib/matchesDb'

describe('MatchDetailPage', () => {
  beforeEach(async () => {
    await clearAllMatches()
  })

  describe('loading state', () => {
    it('shows loading spinner initially', async () => {
      matchDetailPagePage.renderNotFound('loading-test')
      expect(matchDetailPagePage.loadingSpinner).toBeInTheDocument()
    })
  })

  describe('not found state', () => {
    it('shows not found message when match does not exist', async () => {
      matchDetailPagePage.renderNotFound('non-existent-match')

      await waitFor(() => {
        expect(matchDetailPagePage.notFoundHeading).toBeInTheDocument()
      })
    })

    it('shows link to start new match', async () => {
      matchDetailPagePage.renderNotFound('non-existent-match')

      await waitFor(() => {
        expect(matchDetailPagePage.startNewMatchLink).toBeInTheDocument()
      })
    })
  })

  describe('in-progress match', () => {
    it('shows in progress badge', async () => {
      await matchDetailPagePage.render({
        match: { status: 'in_progress' },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.inProgressBadge).toBeInTheDocument()
      })
    })

    it('shows match score heading', async () => {
      await matchDetailPagePage.render()

      await waitFor(() => {
        expect(matchDetailPagePage.matchScoreHeading).toBeInTheDocument()
      })
    })

    it('displays match length info', async () => {
      await matchDetailPagePage.render({
        match: { matchLength: 5 },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.matchInfo).toHaveTextContent(
          'Best of 5 · First to 3'
        )
      })
    })

    it('shows continue match button for in-progress match', async () => {
      await matchDetailPagePage.render({
        match: { status: 'in_progress' },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.continueMatchLink).toBeInTheDocument()
      })
    })

    it('shows new match button', async () => {
      await matchDetailPagePage.render()

      await waitFor(() => {
        expect(matchDetailPagePage.newMatchLink).toBeInTheDocument()
      })
    })

    it('does not show winner alert for in-progress match', async () => {
      await matchDetailPagePage.render({
        match: { status: 'in_progress' },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.matchScoreHeading).toBeInTheDocument()
      })

      expect(matchDetailPagePage.winnerAlert).not.toBeInTheDocument()
    })
  })

  describe('completed match', () => {
    it('shows completed badge', async () => {
      await matchDetailPagePage.render({
        match: {
          status: 'completed',
          winnerId: 'player-1',
          games: [
            { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
            { player1Score: 11, player2Score: 7, winnerId: 'player-1' },
            { player1Score: 11, player2Score: 9, winnerId: 'player-1' },
          ],
        },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.completedBadge).toBeInTheDocument()
      })
    })

    it('shows winner alert', async () => {
      await matchDetailPagePage.render({
        match: {
          status: 'completed',
          winnerId: 'player-1',
          games: [
            { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
            { player1Score: 11, player2Score: 7, winnerId: 'player-1' },
            { player1Score: 11, player2Score: 9, winnerId: 'player-1' },
          ],
        },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.winnerAlert).toBeInTheDocument()
        expect(matchDetailPagePage.winnerAlert).toHaveTextContent(
          'You wins the match!'
        )
      })
    })

    it('shows opponent as winner when they win', async () => {
      await matchDetailPagePage.render({
        match: {
          status: 'completed',
          winnerId: 'player-2',
          games: [
            { player1Score: 5, player2Score: 11, winnerId: 'player-2' },
            { player1Score: 7, player2Score: 11, winnerId: 'player-2' },
            { player1Score: 9, player2Score: 11, winnerId: 'player-2' },
          ],
        },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.winnerAlert).toHaveTextContent(
          'Opponent wins the match!'
        )
      })
    })

    it('does not show continue match button for completed match', async () => {
      await matchDetailPagePage.render({
        match: {
          status: 'completed',
          winnerId: 'player-1',
          games: [
            { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
            { player1Score: 11, player2Score: 7, winnerId: 'player-1' },
            { player1Score: 11, player2Score: 9, winnerId: 'player-1' },
          ],
        },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.completedBadge).toBeInTheDocument()
      })

      expect(matchDetailPagePage.continueMatchLink).not.toBeInTheDocument()
    })
  })

  describe('games list', () => {
    it('shows games heading when there are games', async () => {
      await matchDetailPagePage.render({
        match: {
          games: [
            { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
          ],
        },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.gamesHeading).toBeInTheDocument()
      })
    })

    it('does not show games heading when there are no games', async () => {
      await matchDetailPagePage.render({
        match: { games: [] },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.matchScoreHeading).toBeInTheDocument()
      })

      expect(matchDetailPagePage.gamesHeading).not.toBeInTheDocument()
    })

    it('displays individual game scores', async () => {
      await matchDetailPagePage.render({
        match: {
          games: [
            { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
            { player1Score: 8, player2Score: 11, winnerId: 'player-2' },
          ],
        },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.getGameRow(1)).toBeInTheDocument()
        expect(matchDetailPagePage.getGameRow(2)).toBeInTheDocument()
      })
    })

    it('shows correct scores for each game', async () => {
      await matchDetailPagePage.render({
        match: {
          games: [
            { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
          ],
        },
      })

      await waitFor(() => {
        const gameRow = matchDetailPagePage.getGameRow(1)
        expect(gameRow).toHaveTextContent('You: 11')
        expect(gameRow).toHaveTextContent('Opponent: 5')
      })
    })
  })

  describe('navigation', () => {
    it('navigates to score page when continue match is clicked', async () => {
      await matchDetailPagePage.render({
        match: { status: 'in_progress' },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.continueMatchLink).toBeInTheDocument()
      })

      await matchDetailPagePage.clickContinueMatch()

      await waitFor(() => {
        expect(matchDetailPagePage.scorePage).toBeInTheDocument()
      })
    })

    it('navigates to new match page when new match is clicked', async () => {
      await matchDetailPagePage.render()

      await waitFor(() => {
        expect(matchDetailPagePage.newMatchLink).toBeInTheDocument()
      })

      await matchDetailPagePage.clickNewMatch()

      await waitFor(() => {
        expect(matchDetailPagePage.newMatchPage).toBeInTheDocument()
      })
    })
  })
})
