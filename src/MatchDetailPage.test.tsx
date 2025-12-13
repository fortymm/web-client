import { describe, it, expect, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { matchDetailPagePage } from './MatchDetailPage.page'
import { clearAllMatches } from '@lib/matchesDb'

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

    it('shows summary card', async () => {
      await matchDetailPagePage.render()

      await waitFor(() => {
        expect(matchDetailPagePage.summaryCard).toBeInTheDocument()
      })
    })

    it('displays match length info', async () => {
      await matchDetailPagePage.render({
        match: { matchLength: 5 },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.getMatchLengthInfo(5)).toBeInTheDocument()
        expect(matchDetailPagePage.progressInfo).toHaveTextContent('First to 3')
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

    it('does not show winner message for in-progress match', async () => {
      await matchDetailPagePage.render({
        match: { status: 'in_progress' },
      })

      await waitFor(() => {
        expect(matchDetailPagePage.summaryCard).toBeInTheDocument()
      })

      expect(matchDetailPagePage.winnerMessage).not.toBeInTheDocument()
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

    it('shows winner message with score', async () => {
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
        expect(matchDetailPagePage.winnerMessage).toBeInTheDocument()
        expect(matchDetailPagePage.winnerMessage).toHaveTextContent(
          'You won 3–0'
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
        expect(matchDetailPagePage.winnerMessage).toHaveTextContent(
          'Opponent won 3–0'
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
        expect(matchDetailPagePage.summaryCard).toBeInTheDocument()
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
        expect(gameRow).toHaveTextContent('11')
        expect(gameRow).toHaveTextContent('5')
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
  })
})
