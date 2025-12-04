import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ScoreCard from './ScoreCard'

interface RenderOptions {
  gameNumber?: number
  playerName?: string
  opponentName?: string
  playerScore?: number
  opponentScore?: number
  isGameComplete?: boolean
  isMatchComplete?: boolean
  onPlayerScoreChange?: (delta: number) => void
  onOpponentScoreChange?: (delta: number) => void
  onNextGame?: () => void
  onEndMatch?: () => void
}

export const scoreCardPage = {
  render(options: RenderOptions = {}) {
    const onPlayerScoreChange = options.onPlayerScoreChange ?? vi.fn()
    const onOpponentScoreChange = options.onOpponentScoreChange ?? vi.fn()
    const onNextGame = options.onNextGame ?? vi.fn()
    const onEndMatch = options.onEndMatch ?? vi.fn()

    render(
      <ScoreCard
        gameNumber={options.gameNumber ?? 1}
        playerName={options.playerName ?? 'You'}
        opponentName={options.opponentName ?? 'Opponent'}
        playerScore={options.playerScore ?? 0}
        opponentScore={options.opponentScore ?? 0}
        isGameComplete={options.isGameComplete ?? false}
        isMatchComplete={options.isMatchComplete ?? false}
        onPlayerScoreChange={onPlayerScoreChange}
        onOpponentScoreChange={onOpponentScoreChange}
        onNextGame={onNextGame}
        onEndMatch={onEndMatch}
      />
    )

    return { onPlayerScoreChange, onOpponentScoreChange, onNextGame, onEndMatch }
  },

  get statusMessage() {
    // Status message is the first paragraph
    return screen.getByText(/G\d|Match complete/i)
  },

  get playerScore() {
    // The big score digits (text-5xl class)
    const scores = document.querySelectorAll('.text-5xl')
    return parseInt(scores[0]?.textContent || '0', 10)
  },

  get opponentScore() {
    const scores = document.querySelectorAll('.text-5xl')
    return parseInt(scores[1]?.textContent || '0', 10)
  },

  get playerIncrementButton() {
    return screen.getByRole('button', { name: /add point for you/i })
  },

  get opponentIncrementButton() {
    return screen.getByRole('button', { name: /add point for opponent/i })
  },

  get playerDecrementButton() {
    return screen.getByRole('button', { name: /decrease you score/i })
  },

  get opponentDecrementButton() {
    return screen.getByRole('button', { name: /decrease opponent score/i })
  },

  get nextGameButton() {
    return screen.queryByRole('button', { name: /save & start game/i })
  },

  get saveMatchButton() {
    return screen.queryByRole('button', { name: /save match/i })
  },

  get endMatchEarlyButton() {
    return screen.queryByRole('button', { name: /end match early/i })
  },

  async addPlayerPoint() {
    await userEvent.click(this.playerIncrementButton)
  },

  async addOpponentPoint() {
    await userEvent.click(this.opponentIncrementButton)
  },

  async subtractPlayerPoint() {
    await userEvent.click(this.playerDecrementButton)
  },

  async subtractOpponentPoint() {
    await userEvent.click(this.opponentDecrementButton)
  },

  async clickNextGame() {
    const btn = this.nextGameButton
    if (btn) await userEvent.click(btn)
  },

  async clickSaveMatch() {
    const btn = this.saveMatchButton
    if (btn) await userEvent.click(btn)
  },

  async clickEndMatchEarly() {
    const btn = this.endMatchEarlyButton
    if (btn) await userEvent.click(btn)
  },
}
