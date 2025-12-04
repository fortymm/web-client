import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ScoreDisplay from './ScoreDisplay'

interface RenderOptions {
  playerScore?: number
  opponentScore?: number
  servingPlayer?: 'player' | 'opponent'
  playerLabel?: string
  opponentLabel?: string
  onPlayerScore?: () => void
  onOpponentScore?: () => void
}

export const scoreDisplayPage = {
  render(options: RenderOptions = {}) {
    const {
      playerScore = 0,
      opponentScore = 0,
      servingPlayer = 'player',
      playerLabel = 'You',
      opponentLabel = 'Opponent',
      onPlayerScore = vi.fn(),
      onOpponentScore = vi.fn(),
    } = options

    render(
      <ScoreDisplay
        playerScore={playerScore}
        opponentScore={opponentScore}
        servingPlayer={servingPlayer}
        playerLabel={playerLabel}
        opponentLabel={opponentLabel}
        onPlayerScore={onPlayerScore}
        onOpponentScore={onOpponentScore}
      />
    )

    return { onPlayerScore, onOpponentScore }
  },

  get playerPanel() {
    return screen.getByRole('button', { name: /Add point to You/i })
  },

  get opponentPanel() {
    return screen.getByRole('button', { name: /Add point to Opponent/i })
  },

  getPlayerScore() {
    return this.playerPanel.querySelector('.text-7xl')?.textContent
  },

  getOpponentScore() {
    return this.opponentPanel.querySelector('.text-7xl')?.textContent
  },

  async tapPlayer() {
    await userEvent.click(this.playerPanel)
  },

  async tapOpponent() {
    await userEvent.click(this.opponentPanel)
  },
}
