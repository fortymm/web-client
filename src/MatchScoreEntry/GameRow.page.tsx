import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import GameRow from './GameRow'
import type { GameScore, GameValidationResult, MatchConfig } from './types'

interface RenderOptions {
  gameNumber?: number
  game?: Partial<GameScore>
  config?: Partial<MatchConfig>
  validation?: Partial<GameValidationResult>
  onChange?: (game: GameScore) => void
  disabled?: boolean
}

// Store rendered config for dynamic selectors
let renderedConfig: MatchConfig | null = null
let renderedGameNumber = 1

export const gameRowPage = {
  createDefaultConfig(): MatchConfig {
    return {
      id: 'match-1',
      playerYou: { id: 'player-1', name: 'You', isCurrentUser: true },
      playerOpponent: { id: 'player-2', name: 'Opponent' },
      bestOf: 5,
      pointsToWin: 11,
      winBy: 2,
    }
  },

  createDefaultGame(index = 0): GameScore {
    return {
      gameIndex: index,
      youScore: null,
      opponentScore: null,
    }
  },

  createDefaultValidation(): GameValidationResult {
    return {
      isValid: true,
      winner: null,
      error: null,
    }
  },

  render(options: RenderOptions = {}) {
    const {
      gameNumber = 1,
      game = {},
      config = {},
      validation = {},
      onChange = vi.fn(),
      disabled = false,
    } = options

    const fullConfig = { ...this.createDefaultConfig(), ...config }
    const fullGame = { ...this.createDefaultGame(), ...game }
    const fullValidation = { ...this.createDefaultValidation(), ...validation }

    // Store for dynamic selectors
    renderedConfig = fullConfig
    renderedGameNumber = gameNumber

    render(
      <GameRow
        gameNumber={gameNumber}
        game={fullGame}
        config={fullConfig}
        validation={fullValidation}
        onChange={onChange}
        disabled={disabled}
      />
    )

    return { onChange, config: fullConfig, game: fullGame }
  },

  get gameHeading() {
    return screen.getByRole('heading', { level: 3 })
  },

  get youScoreInput() {
    const name = renderedConfig?.playerYou.name ?? 'You'
    return screen.getByRole('spinbutton', {
      name: new RegExp(`game ${renderedGameNumber} - ${name} score`, 'i'),
    })
  },

  get opponentScoreInput() {
    const name = renderedConfig?.playerOpponent.name ?? 'Opponent'
    return screen.getByRole('spinbutton', {
      name: new RegExp(`game ${renderedGameNumber} - ${name} score`, 'i'),
    })
  },

  get statusText() {
    return screen.getByText(
      /not played yet|winner:|game cannot|must have|must lead/i
    )
  },

  getStatusTextContent() {
    return this.statusText.textContent
  },

  async enterYouScore(score: string) {
    await userEvent.clear(this.youScoreInput)
    if (score) {
      await userEvent.type(this.youScoreInput, score)
    }
  },

  async enterOpponentScore(score: string) {
    await userEvent.clear(this.opponentScoreInput)
    if (score) {
      await userEvent.type(this.opponentScoreInput, score)
    }
  },

  async enterScores(youScore: string, opponentScore: string) {
    await this.enterYouScore(youScore)
    await this.enterOpponentScore(opponentScore)
  },
}
