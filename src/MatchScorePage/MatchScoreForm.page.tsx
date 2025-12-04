import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import MatchScoreForm from './MatchScoreForm'

interface GameScore {
  player: number
  opponent: number
}

interface RenderOptions {
  matchLength?: number
  games?: GameScore[]
  playerName?: string
  opponentName?: string
  onGameScoreChange?: (gameIndex: number, player: 'player' | 'opponent', delta: number) => void
}

export const matchScoreFormPage = {
  render(options: RenderOptions = {}) {
    const {
      matchLength = 5,
      games = [
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
      playerName = 'You',
      opponentName = 'Opponent',
      onGameScoreChange = vi.fn(),
    } = options

    render(
      <MatchScoreForm
        matchLength={matchLength}
        games={games}
        playerName={playerName}
        opponentName={opponentName}
        onGameScoreChange={onGameScoreChange}
      />
    )

    return { onGameScoreChange }
  },

  get gameList() {
    return screen.getByRole('list', { name: /game scores/i })
  },

  get gameRows() {
    return screen.getAllByRole('group')
  },

  getGameRow(gameNumber: number) {
    return screen.getByRole('group', { name: `Game ${gameNumber}` })
  },

  get matchScoreHeader() {
    // The header is the element containing .text-2xl scores (match wins)
    const scores = screen.getAllByText(/^\d+$/)
    // Find the first .text-2xl element (match score, not game score)
    for (const score of scores) {
      if (score.classList.contains('text-2xl')) {
        return score.closest('.bg-base-200\\/30')
      }
    }
    return null
  },

  getPlayerMatchWins() {
    const header = this.matchScoreHeader
    if (!header) return 0
    const scores = header.querySelectorAll('.text-2xl')
    return parseInt(scores[0]?.textContent || '0', 10)
  },

  getOpponentMatchWins() {
    const header = this.matchScoreHeader
    if (!header) return 0
    const scores = header.querySelectorAll('.text-2xl')
    return parseInt(scores[1]?.textContent || '0', 10)
  },

  get matchCompleteMessage() {
    return screen.queryByText(/wins!/i)
  },

  // Actions for specific game rows
  async incrementPlayerScore(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const buttons = within(row).getAllByRole('button', { name: /increase score/i })
    await userEvent.click(buttons[0])
  },

  async decrementPlayerScore(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const buttons = within(row).getAllByRole('button', { name: /decrease score/i })
    await userEvent.click(buttons[0])
  },

  async incrementOpponentScore(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const buttons = within(row).getAllByRole('button', { name: /increase score/i })
    await userEvent.click(buttons[1])
  },

  async decrementOpponentScore(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const buttons = within(row).getAllByRole('button', { name: /decrease score/i })
    await userEvent.click(buttons[1])
  },

  getGameScores(gameNumber: number) {
    const row = this.getGameRow(gameNumber)
    const scores = within(row).getAllByText(/^\d+$/)
    return {
      player: parseInt(scores[0]?.textContent || '0', 10),
      opponent: parseInt(scores[1]?.textContent || '0', 10),
    }
  },
}
