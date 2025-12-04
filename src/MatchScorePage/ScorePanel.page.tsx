import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ScorePanel from './ScorePanel'

interface RenderOptions {
  playerName?: string
  score?: number
  isServing?: boolean
  isWinner?: boolean
  onTap?: () => void
  disabled?: boolean
}

export const scorePanelPage = {
  render(options: RenderOptions = {}) {
    const {
      playerName = 'You',
      score = 0,
      isServing = false,
      isWinner = false,
      onTap = vi.fn(),
      disabled = false,
    } = options

    render(
      <ScorePanel
        playerName={playerName}
        score={score}
        isServing={isServing}
        isWinner={isWinner}
        onTap={onTap}
        disabled={disabled}
      />
    )

    return { onTap }
  },

  get button() {
    return screen.getByRole('button')
  },

  getButtonForPlayer(name: string) {
    return screen.getByRole('button', { name: new RegExp(`Add point to ${name}`, 'i') })
  },

  get score() {
    return screen.getByText(/^\d+$/)
  },

  getPlayerNameElement() {
    // Find the player name by looking at the first span in the button (which has the name)
    const button = this.button
    return button.querySelector('span.text-sm')
  },

  get servingIndicator() {
    return screen.queryByText(/serving/i)
  },

  get tapToScoreHint() {
    return screen.queryByText(/tap to score/i)
  },

  async tap() {
    await userEvent.click(this.button)
  },
}
