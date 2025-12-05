import { render, screen } from '@testing-library/react'
import WinnerSummary from './WinnerSummary'

interface Player {
  id: string
  name: string
}

interface RenderOptions {
  player1?: Player
  player2?: Player
  score1?: string
  score2?: string
}

const defaultPlayer1: Player = { id: 'player-1', name: 'Player 1' }
const defaultPlayer2: Player = { id: 'player-2', name: 'Player 2' }

export const winnerSummaryPage = {
  render(options: RenderOptions = {}) {
    const {
      player1 = defaultPlayer1,
      player2 = defaultPlayer2,
      score1 = '',
      score2 = '',
    } = options

    render(
      <WinnerSummary
        player1={player1}
        player2={player2}
        score1={score1}
        score2={score2}
      />
    )
  },

  get winnerStatus() {
    return screen.queryByRole('status')
  },

  get errorAlert() {
    return screen.queryByRole('alert')
  },

  get winnerName() {
    return screen.queryByRole('status')?.querySelector('.text-success')
  },

  get scoreDisplay() {
    return screen.queryByText(/\d+–\d+/)
  },

  get unusualWarning() {
    return screen.queryByText(/unusual/i)
  },

  get tiedError() {
    return screen.queryByText(/must have a winner/i)
  },
}
