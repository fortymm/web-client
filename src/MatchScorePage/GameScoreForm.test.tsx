import { describe, it, expect } from 'vitest'
import { gameScoreFormPage } from './GameScoreForm.page'

describe('GameScoreForm', () => {
  describe('rendering', () => {
    it('displays the heading', () => {
      gameScoreFormPage.render()

      expect(gameScoreFormPage.heading).toBeInTheDocument()
    })

    it('displays game number and player names in subtitle', () => {
      gameScoreFormPage.render({
        gameNumber: 2,
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      expect(gameScoreFormPage.subtitle).toHaveTextContent('Game 2 · Alice vs Bob')
    })

    it('displays the game score label', () => {
      gameScoreFormPage.render()

      expect(gameScoreFormPage.scoreLabel).toBeInTheDocument()
    })

    it('displays rules hint', () => {
      gameScoreFormPage.render()

      expect(gameScoreFormPage.rulesHint).toHaveTextContent('Default: first to 11, win by 2')
    })

    it('displays score inputs for both players', () => {
      gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      expect(gameScoreFormPage.getInputFor('Alice')).toBeInTheDocument()
      expect(gameScoreFormPage.getInputFor('Bob')).toBeInTheDocument()
    })

    it('displays save button', () => {
      gameScoreFormPage.render()

      expect(gameScoreFormPage.saveButton).toBeInTheDocument()
    })
  })

  describe('save button state', () => {
    it('is disabled when both scores are empty', () => {
      gameScoreFormPage.render()

      expect(gameScoreFormPage.saveButton).toBeDisabled()
    })

    it('is disabled when only one score is entered', async () => {
      gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      await gameScoreFormPage.enterScore('Alice', '11')

      expect(gameScoreFormPage.saveButton).toBeDisabled()
    })

    it('is enabled when both scores are entered', async () => {
      gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      await gameScoreFormPage.enterScore('Alice', '11')
      await gameScoreFormPage.enterScore('Bob', '9')

      expect(gameScoreFormPage.saveButton).toBeEnabled()
    })
  })

  describe('validation', () => {
    it('prevents submission when scores are empty', () => {
      gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      // Button should be disabled when scores are empty
      expect(gameScoreFormPage.saveButton).toBeDisabled()
    })

    it('shows form error when scores are tied', async () => {
      gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      await gameScoreFormPage.enterScore('Alice', '11')
      await gameScoreFormPage.enterScore('Bob', '11')
      await gameScoreFormPage.clickSave()

      expect(gameScoreFormPage.formError).toHaveTextContent('Game scores must have a winner')
    })
  })

  describe('form submission', () => {
    it('calls onSave with correct data when player 1 wins', async () => {
      const { onSave } = gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      await gameScoreFormPage.enterScore('Alice', '11')
      await gameScoreFormPage.enterScore('Bob', '9')
      await gameScoreFormPage.clickSave()

      expect(onSave).toHaveBeenCalledWith({
        player1Score: 11,
        player2Score: 9,
        winnerId: 'p1',
      })
    })

    it('calls onSave with correct data when player 2 wins', async () => {
      const { onSave } = gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      await gameScoreFormPage.enterScore('Alice', '8')
      await gameScoreFormPage.enterScore('Bob', '11')
      await gameScoreFormPage.clickSave()

      expect(onSave).toHaveBeenCalledWith({
        player1Score: 8,
        player2Score: 11,
        winnerId: 'p2',
      })
    })

    it('does not call onSave when validation fails', async () => {
      const { onSave } = gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      await gameScoreFormPage.enterScore('Alice', '10')
      await gameScoreFormPage.enterScore('Bob', '10')
      await gameScoreFormPage.clickSave()

      expect(onSave).not.toHaveBeenCalled()
    })
  })

  describe('disabled state', () => {
    it('disables all inputs when disabled prop is true', () => {
      gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
        disabled: true,
      })

      expect(gameScoreFormPage.getInputFor('Alice')).toBeDisabled()
      expect(gameScoreFormPage.getInputFor('Bob')).toBeDisabled()
      expect(gameScoreFormPage.saveButton).toBeDisabled()
    })
  })
})
