import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import GameScoreForm from './GameScoreForm'
import { playerScoreInputPage } from './PlayerScoreInput.page'

interface Player {
  id: string
  name: string
}

interface RenderOptions {
  gameNumber?: number
  player1?: Player
  player2?: Player
  onSave?: (score: { player1Score: number; player2Score: number; winnerId: string }) => void
  onCancel?: () => void
  disabled?: boolean
}

const defaultPlayer1: Player = { id: 'player-1', name: 'Player 1' }
const defaultPlayer2: Player = { id: 'player-2', name: 'Player 2' }

export const gameScoreFormPage = {
  render(options: RenderOptions = {}) {
    const {
      gameNumber = 1,
      player1 = defaultPlayer1,
      player2 = defaultPlayer2,
      onSave = vi.fn(),
      onCancel = vi.fn(),
      disabled = false,
    } = options

    render(
      <GameScoreForm
        gameNumber={gameNumber}
        player1={player1}
        player2={player2}
        onSave={onSave}
        onCancel={onCancel}
        disabled={disabled}
      />
    )

    return { onSave, onCancel }
  },

  get heading() {
    return screen.getByRole('heading', { name: /enter score/i })
  },

  get subtitle() {
    return screen.getByText(/game \d+ ·/i)
  },

  getSubtitleFor(gameNumber: number, totalGames?: number) {
    if (totalGames) {
      return screen.getByText(new RegExp(`game ${gameNumber} of ${totalGames} ·`, 'i'))
    }
    return screen.getByText(new RegExp(`game ${gameNumber} ·`, 'i'))
  },

  get saveButton() {
    return screen.getByRole('button', { name: /save score/i })
  },

  get cancelButton() {
    return screen.getByRole('button', { name: /cancel/i })
  },

  get generalError() {
    return screen.queryByRole('alert')
  },

  get formError() {
    return screen.queryByText(/game scores must have a winner/i)
  },

  // Delegate to child page objects
  getPlayer1Input() {
    return playerScoreInputPage.getInputFor('Player 1')
  },

  getPlayer2Input() {
    return playerScoreInputPage.getInputFor('Player 2')
  },

  getInputFor(playerName: string) {
    return screen.getByLabelText(playerName)
  },

  async enterScore(playerName: string, score: string) {
    const input = this.getInputFor(playerName)
    await userEvent.clear(input)
    await userEvent.type(input, score)
  },

  async clickSave() {
    await userEvent.click(this.saveButton)
  },

  async clickCancel() {
    await userEvent.click(this.cancelButton)
  },
}
