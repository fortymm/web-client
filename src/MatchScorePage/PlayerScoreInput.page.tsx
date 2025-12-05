import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import PlayerScoreInput from './PlayerScoreInput'

interface RenderOptions {
  playerName?: string
  playerId?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
}

export const playerScoreInputPage = {
  render(options: RenderOptions = {}) {
    const {
      playerName = 'Player 1',
      playerId = 'player-1',
      value = '',
      onChange = vi.fn(),
      error,
      disabled = false,
    } = options

    render(
      <PlayerScoreInput
        playerName={playerName}
        playerId={playerId}
        value={value}
        onChange={onChange}
        error={error}
        disabled={disabled}
      />
    )

    return { onChange }
  },

  get input() {
    return screen.getByRole('textbox')
  },

  getInputFor(playerName: string) {
    return screen.getByLabelText(playerName)
  },

  get errorMessage() {
    return screen.queryByRole('paragraph')
  },

  async typeScore(score: string) {
    await userEvent.clear(this.input)
    await userEvent.type(this.input, score)
  },

  async clickInput() {
    await userEvent.click(this.input)
  },
}
