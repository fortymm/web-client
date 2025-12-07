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

    it('displays score inputs for both players', () => {
      gameScoreFormPage.render({
        player1: { id: 'p1', name: 'Alice' },
        player2: { id: 'p2', name: 'Bob' },
      })

      expect(gameScoreFormPage.getInputFor('Alice')).toBeInTheDocument()
      expect(gameScoreFormPage.getInputFor('Bob')).toBeInTheDocument()
    })

    it('displays save and cancel buttons', () => {
      gameScoreFormPage.render()

      expect(gameScoreFormPage.saveButton).toBeInTheDocument()
      expect(gameScoreFormPage.cancelButton).toBeInTheDocument()
    })
  })

  describe('save button state', () => {
    it('is always enabled', () => {
      gameScoreFormPage.render()

      expect(gameScoreFormPage.saveButton).toBeEnabled()
    })
  })

  describe('validation', () => {
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

  describe('cancel action', () => {
    it('calls onCancel when clicking cancel button', async () => {
      const { onCancel } = gameScoreFormPage.render()

      await gameScoreFormPage.clickCancel()

      expect(onCancel).toHaveBeenCalled()
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
      expect(gameScoreFormPage.cancelButton).toBeDisabled()
    })
  })
})
