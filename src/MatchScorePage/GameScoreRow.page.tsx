import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import GameScoreRow from './GameScoreRow'

interface RenderOptions {
  gameNumber?: number
  playerScore?: number
  opponentScore?: number
  playerName?: string
  opponentName?: string
  isComplete?: boolean
  isActive?: boolean
  isDisabled?: boolean
  onPlayerScoreChange?: (delta: number) => void
  onOpponentScoreChange?: (delta: number) => void
}

export const gameScoreRowPage = {
  render(options: RenderOptions = {}) {
    const {
      gameNumber = 1,
      playerScore = 0,
      opponentScore = 0,
      playerName = 'You',
      opponentName = 'Opponent',
      isComplete = false,
      isActive = false,
      isDisabled = false,
      onPlayerScoreChange = vi.fn(),
      onOpponentScoreChange = vi.fn(),
    } = options

    render(
      <GameScoreRow
        gameNumber={gameNumber}
        playerScore={playerScore}
        opponentScore={opponentScore}
        playerName={playerName}
        opponentName={opponentName}
        isComplete={isComplete}
        isActive={isActive}
        isDisabled={isDisabled}
        onPlayerScoreChange={onPlayerScoreChange}
        onOpponentScoreChange={onOpponentScoreChange}
      />
    )

    return { onPlayerScoreChange, onOpponentScoreChange }
  },

  get row() {
    return screen.getByRole('group')
  },

  get gameLabel() {
    return screen.getByText(/^G\d+$/)
  },

  get playerDecrementButton() {
    const buttons = screen.getAllByRole('button', { name: /decrease score/i })
    return buttons[0]
  },

  get playerIncrementButton() {
    const buttons = screen.getAllByRole('button', { name: /increase score/i })
    return buttons[0]
  },

  get opponentDecrementButton() {
    const buttons = screen.getAllByRole('button', { name: /decrease score/i })
    return buttons[1]
  },

  get opponentIncrementButton() {
    const buttons = screen.getAllByRole('button', { name: /increase score/i })
    return buttons[1]
  },

  get completeIndicator() {
    return screen.queryByLabelText(/game complete/i)
  },

  get activeIndicator() {
    return screen.queryByLabelText(/current game/i)
  },

  getScores() {
    const row = this.row
    const scores = within(row).getAllByText(/^\d+$/)
    return {
      player: parseInt(scores[0].textContent || '0', 10),
      opponent: parseInt(scores[1].textContent || '0', 10),
    }
  },

  async incrementPlayerScore() {
    await userEvent.click(this.playerIncrementButton)
  },

  async decrementPlayerScore() {
    await userEvent.click(this.playerDecrementButton)
  },

  async incrementOpponentScore() {
    await userEvent.click(this.opponentIncrementButton)
  },

  async decrementOpponentScore() {
    await userEvent.click(this.opponentDecrementButton)
  },
}
