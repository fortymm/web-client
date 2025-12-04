import { render, screen } from '@testing-library/react'
import GameProgress from './GameProgress'

interface RenderOptions {
  gamesWon?: {
    player: number
    opponent: number
  }
  matchLength?: number
  currentGame?: number
}

export const gameProgressPage = {
  render(options: RenderOptions = {}) {
    const {
      gamesWon = { player: 0, opponent: 0 },
      matchLength = 5,
      currentGame = 1,
    } = options

    render(
      <GameProgress
        gamesWon={gamesWon}
        matchLength={matchLength}
        currentGame={currentGame}
      />
    )
  },

  get playerGamesIndicator() {
    return screen.getByLabelText(/You: \d+ games/i)
  },

  get opponentGamesIndicator() {
    return screen.getByLabelText(/Opponent: \d+ games/i)
  },

  get gameCounter() {
    return screen.getByText(/Game \d+ of \d+/i)
  },

  getPlayerFilledDots() {
    const container = this.playerGamesIndicator
    return container.querySelectorAll('.bg-primary')
  },

  getOpponentFilledDots() {
    const container = this.opponentGamesIndicator
    return container.querySelectorAll('.bg-error')
  },
}
