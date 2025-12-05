import { describe, it, expect } from 'vitest'
import { winnerSummaryPage } from './WinnerSummary.page'

describe('WinnerSummary', () => {
  describe('when scores are empty', () => {
    it('renders nothing', () => {
      winnerSummaryPage.render({ score1: '', score2: '' })

      expect(winnerSummaryPage.winnerStatus).not.toBeInTheDocument()
      expect(winnerSummaryPage.errorAlert).not.toBeInTheDocument()
    })

    it('renders nothing when only one score is entered', () => {
      winnerSummaryPage.render({ score1: '11', score2: '' })

      expect(winnerSummaryPage.winnerStatus).not.toBeInTheDocument()
    })
  })

  describe('when scores are tied', () => {
    it('shows error message', () => {
      winnerSummaryPage.render({ score1: '5', score2: '5' })

      expect(winnerSummaryPage.tiedError).toBeInTheDocument()
    })

    it('displays as an alert', () => {
      winnerSummaryPage.render({ score1: '11', score2: '11' })

      expect(winnerSummaryPage.errorAlert).toBeInTheDocument()
    })
  })

  describe('when there is a valid winner', () => {
    it('shows winner name for standard win (11-9)', () => {
      winnerSummaryPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
        score1: '11',
        score2: '9',
      })

      expect(winnerSummaryPage.winnerName).toHaveTextContent('Alice')
    })

    it('shows correct winner when player 2 wins', () => {
      winnerSummaryPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
        score1: '5',
        score2: '11',
      })

      expect(winnerSummaryPage.winnerName).toHaveTextContent('Bob')
    })

    it('displays the score', () => {
      winnerSummaryPage.render({ score1: '11', score2: '7' })

      expect(winnerSummaryPage.scoreDisplay).toHaveTextContent('11–7')
    })

    it('displays score with higher number first', () => {
      winnerSummaryPage.render({ score1: '8', score2: '11' })

      expect(winnerSummaryPage.scoreDisplay).toHaveTextContent('11–8')
    })

    it('does not show unusual warning for standard scores', () => {
      winnerSummaryPage.render({ score1: '11', score2: '9' })

      expect(winnerSummaryPage.unusualWarning).not.toBeInTheDocument()
    })

    it('handles deuce scenario (12-10)', () => {
      winnerSummaryPage.render({ score1: '12', score2: '10' })

      expect(winnerSummaryPage.winnerStatus).toBeInTheDocument()
      expect(winnerSummaryPage.unusualWarning).not.toBeInTheDocument()
    })

    it('handles extended deuce (15-13)', () => {
      winnerSummaryPage.render({ score1: '15', score2: '13' })

      expect(winnerSummaryPage.winnerStatus).toBeInTheDocument()
      expect(winnerSummaryPage.unusualWarning).not.toBeInTheDocument()
    })
  })

  describe('when score is unusual', () => {
    it('shows warning for non-standard win (9-7)', () => {
      winnerSummaryPage.render({ score1: '9', score2: '7' })

      expect(winnerSummaryPage.unusualWarning).toBeInTheDocument()
    })

    it('shows warning when win margin is less than 2', () => {
      winnerSummaryPage.render({ score1: '11', score2: '10' })

      expect(winnerSummaryPage.unusualWarning).toBeInTheDocument()
    })

    it('still shows the winner for unusual scores', () => {
      winnerSummaryPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
        score1: '5',
        score2: '3',
      })

      expect(winnerSummaryPage.winnerName).toHaveTextContent('Alice')
    })
  })
})
