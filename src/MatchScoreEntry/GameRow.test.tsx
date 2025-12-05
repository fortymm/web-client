import { describe, it, expect, vi } from 'vitest'
import { gameRowPage } from './GameRow.page'

describe('GameRow', () => {
  describe('rendering', () => {
    it('displays the game number heading', () => {
      gameRowPage.render({ gameNumber: 3 })
      expect(gameRowPage.gameHeading).toHaveTextContent('Game 3')
    })

    it('displays score inputs for both players', () => {
      gameRowPage.render()
      expect(gameRowPage.youScoreInput).toBeInTheDocument()
      expect(gameRowPage.opponentScoreInput).toBeInTheDocument()
    })

    it('displays player names as labels', () => {
      gameRowPage.render({
        config: {
          playerYou: { id: '1', name: 'Alice', isCurrentUser: true },
          playerOpponent: { id: '2', name: 'Bob' },
        },
      })
      expect(gameRowPage.youScoreInput).toHaveAccessibleName(/alice/i)
      expect(gameRowPage.opponentScoreInput).toHaveAccessibleName(/bob/i)
    })

    it('shows "Not played yet" for empty game', () => {
      gameRowPage.render()
      expect(gameRowPage.getStatusTextContent()).toBe('Not played yet')
    })

    it('displays existing scores', () => {
      gameRowPage.render({
        game: { youScore: 11, opponentScore: 7 },
      })
      expect(gameRowPage.youScoreInput).toHaveValue(11)
      expect(gameRowPage.opponentScoreInput).toHaveValue(7)
    })
  })

  describe('validation display', () => {
    it('shows winner when game is valid and you won', () => {
      gameRowPage.render({
        game: { youScore: 11, opponentScore: 7 },
        validation: { isValid: true, winner: 'you', error: null },
        config: { playerYou: { id: '1', name: 'Alice', isCurrentUser: true } },
      })
      expect(gameRowPage.getStatusTextContent()).toBe('Winner: Alice')
    })

    it('shows winner when game is valid and opponent won', () => {
      gameRowPage.render({
        game: { youScore: 9, opponentScore: 11 },
        validation: { isValid: true, winner: 'opponent', error: null },
        config: { playerOpponent: { id: '2', name: 'Bob' } },
      })
      expect(gameRowPage.getStatusTextContent()).toBe('Winner: Bob')
    })

    it('shows tie error message', () => {
      gameRowPage.render({
        game: { youScore: 10, opponentScore: 10 },
        validation: {
          isValid: false,
          winner: null,
          error: 'Game cannot end in a tie.',
        },
      })
      expect(gameRowPage.getStatusTextContent()).toBe(
        'Game cannot end in a tie.'
      )
    })

    it('shows points-to-win error message', () => {
      gameRowPage.render({
        game: { youScore: 10, opponentScore: 7 },
        validation: {
          isValid: false,
          winner: null,
          error: 'Winner must have at least 11 points.',
        },
      })
      expect(gameRowPage.getStatusTextContent()).toBe(
        'Winner must have at least 11 points.'
      )
    })

    it('shows win-by error message', () => {
      gameRowPage.render({
        game: { youScore: 11, opponentScore: 10 },
        validation: {
          isValid: false,
          winner: null,
          error: 'Winner must lead by at least 2 points.',
        },
      })
      expect(gameRowPage.getStatusTextContent()).toBe(
        'Winner must lead by at least 2 points.'
      )
    })

    it('applies error styling to inputs when invalid', () => {
      gameRowPage.render({
        game: { youScore: 10, opponentScore: 10 },
        validation: {
          isValid: false,
          winner: null,
          error: 'Game cannot end in a tie.',
        },
      })
      expect(gameRowPage.youScoreInput).toHaveClass('input-error')
      expect(gameRowPage.opponentScoreInput).toHaveClass('input-error')
    })
  })

  describe('input behavior', () => {
    it('calls onChange with numeric value when typing in you score', async () => {
      const onChange = vi.fn()
      gameRowPage.render({ onChange })

      // Type a single digit to test onChange is called with parsed number
      await gameRowPage.enterYouScore('7')

      expect(onChange).toHaveBeenCalled()
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
      expect(lastCall.youScore).toBe(7)
    })

    it('calls onChange with numeric value when typing in opponent score', async () => {
      const onChange = vi.fn()
      gameRowPage.render({ onChange })

      await gameRowPage.enterOpponentScore('9')

      expect(onChange).toHaveBeenCalled()
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
      expect(lastCall.opponentScore).toBe(9)
    })

    it('sets score to null when input is cleared', async () => {
      const onChange = vi.fn()
      gameRowPage.render({
        game: { youScore: 11, opponentScore: 7 },
        onChange,
      })

      await gameRowPage.enterYouScore('')

      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
      expect(lastCall.youScore).toBe(null)
    })
  })

  describe('disabled state', () => {
    it('disables inputs when disabled prop is true', () => {
      gameRowPage.render({ disabled: true })
      expect(gameRowPage.youScoreInput).toBeDisabled()
      expect(gameRowPage.opponentScoreInput).toBeDisabled()
    })

    it('enables inputs when disabled prop is false', () => {
      gameRowPage.render({ disabled: false })
      expect(gameRowPage.youScoreInput).not.toBeDisabled()
      expect(gameRowPage.opponentScoreInput).not.toBeDisabled()
    })
  })

  describe('accessibility', () => {
    it('has proper labels for inputs', () => {
      gameRowPage.render({ gameNumber: 2 })
      expect(gameRowPage.youScoreInput).toHaveAccessibleName(
        /game 2 - you score/i
      )
      expect(gameRowPage.opponentScoreInput).toHaveAccessibleName(
        /game 2 - opponent score/i
      )
    })

    it('has numeric input mode for mobile keyboards', () => {
      gameRowPage.render()
      expect(gameRowPage.youScoreInput).toHaveAttribute('inputmode', 'numeric')
      expect(gameRowPage.opponentScoreInput).toHaveAttribute(
        'inputmode',
        'numeric'
      )
    })

    it('marks status as alert when there is an error', () => {
      gameRowPage.render({
        game: { youScore: 10, opponentScore: 10 },
        validation: {
          isValid: false,
          winner: null,
          error: 'Game cannot end in a tie.',
        },
      })
      expect(gameRowPage.statusText).toHaveAttribute('role', 'alert')
    })
  })
})
