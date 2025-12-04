import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ScoreCard from './ScoreCard'

interface RenderOptions {
  gameNumber?: number
  matchLength?: number
  playerName?: string
  opponentName?: string
  playerScore?: number
  opponentScore?: number
  isGameComplete?: boolean
  isMatchComplete?: boolean
  onPlayerScoreChange?: (delta: number) => void
  onOpponentScoreChange?: (delta: number) => void
  onNextGame?: () => void
  onFinishMatch?: () => void
}

export const scoreCardPage = {
  render(options: RenderOptions = {}) {
    const onPlayerScoreChange = options.onPlayerScoreChange ?? vi.fn()
    const onOpponentScoreChange = options.onOpponentScoreChange ?? vi.fn()
    const onNextGame = options.onNextGame ?? vi.fn()
    const onFinishMatch = options.onFinishMatch ?? vi.fn()

    render(
      <ScoreCard
        gameNumber={options.gameNumber ?? 1}
        matchLength={options.matchLength ?? 5}
        playerName={options.playerName ?? 'You'}
        opponentName={options.opponentName ?? 'Opponent'}
        playerScore={options.playerScore ?? 0}
        opponentScore={options.opponentScore ?? 0}
        isGameComplete={options.isGameComplete ?? false}
        isMatchComplete={options.isMatchComplete ?? false}
        onPlayerScoreChange={onPlayerScoreChange}
        onOpponentScoreChange={onOpponentScoreChange}
        onNextGame={onNextGame}
        onFinishMatch={onFinishMatch}
      />
    )

    return { onPlayerScoreChange, onOpponentScoreChange, onNextGame, onFinishMatch }
  },

  get statusText() {
    // Status text centered at top of card
    const patterns = [
      /^You lead by \d+$/i,
      /^Opponent leads by \d+$/i,
      /^Tied at \d+–\d+$/i,
      /^You win$/i,
      /^Opponent wins$/i,
    ]
    for (const pattern of patterns) {
      const el = screen.queryByText(pattern)
      if (el) return el
    }
    return null
  },

  // Caption text below CTA button - rules or completion status
  get captionText() {
    return screen.getByText(/To 11|Win by 2|Game complete|Match complete/i)
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

  // CTA button - always present, may be disabled
  get ctaButton() {
    return screen.getByRole('button', { name: /save game/i })
  },

  get nextGameButton() {
    return screen.queryByRole('button', { name: /save game & start next/i })
  },

  get finishMatchButton() {
    return screen.queryByRole('button', { name: /save game & finish match/i })
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

  async clickFinishMatch() {
    const btn = this.finishMatchButton
    if (btn) await userEvent.click(btn)
  },
}
