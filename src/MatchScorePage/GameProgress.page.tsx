import { render, screen } from '@testing-library/react'
import GameProgress from './GameProgress'

interface GameScore {
  player: number
  opponent: number
}

interface RenderOptions {
  completedGames?: GameScore[]
  currentGame?: number
  matchLength?: number
  isMatchComplete?: boolean
}

export const gameProgressPage = {
  render(options: RenderOptions = {}) {
    const {
      completedGames = [],
      currentGame = 1,
      matchLength = 5,
      isMatchComplete = false,
    } = options

    render(
      <GameProgress
        completedGames={completedGames}
        currentGame={currentGame}
        matchLength={matchLength}
        isMatchComplete={isMatchComplete}
      />
    )
  },

  get gameHistory() {
    return screen.queryByRole('list', { name: /Game history/i })
  },

  get gameChips() {
    return screen.queryAllByRole('listitem')
  },

  get currentGameChip() {
    return screen.queryByText(/Now/i)
  },

  getGameChipScore(gameNumber: number) {
    const chips = this.gameChips
    const chip = chips.find((c) => c.textContent?.includes(`G${gameNumber}`))
    return chip?.textContent ?? null
  },

  getPlayerWonGames() {
    const chips = this.gameChips
    return chips.filter((c) => c.classList.contains('text-success'))
  },

  getOpponentWonGames() {
    const chips = this.gameChips
    return chips.filter((c) => c.classList.contains('text-error'))
  },
}
