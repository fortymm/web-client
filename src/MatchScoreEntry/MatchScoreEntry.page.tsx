import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import MatchScoreEntry from './MatchScoreEntry'
import type { GameScore, MatchConfig, MatchScoreEntryProps } from './types'

interface RenderOptions {
  config?: Partial<MatchConfig>
  initialScores?: GameScore[]
  onSave?: (scores: GameScore[]) => Promise<void> | void
  onCancel?: () => void
  allowIncompleteSave?: boolean
}

export const matchScoreEntryPage = {
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

  render(options: RenderOptions = {}) {
    const {
      config = {},
      initialScores,
      onSave = vi.fn(),
      onCancel,
      allowIncompleteSave = false,
    } = options

    const fullConfig = { ...this.createDefaultConfig(), ...config }

    const props: MatchScoreEntryProps = {
      config: fullConfig,
      initialScores,
      onSave,
      onCancel,
      allowIncompleteSave,
    }

    render(<MatchScoreEntry {...props} />)

    return { onSave, onCancel, config: fullConfig }
  },

  get title() {
    return screen.getByRole('heading', { level: 1, name: /enter scores/i })
  },

  get subtitle() {
    return screen.getByText(/vs/i)
  },

  get metaInfo() {
    return screen.getByText(/best of/i)
  },

  get matchSummary() {
    return screen.getByRole('status')
  },

  get matchSummaryText() {
    return this.matchSummary.textContent
  },

  get saveButton() {
    return screen.getByRole('button', { name: /save match|saving/i })
  },

  get cancelButton() {
    return screen.queryByRole('button', { name: /cancel/i })
  },

  get errorAlert() {
    return screen.queryByRole('alert')
  },

  get gameRows() {
    return screen.getAllByRole('heading', { level: 3 }).map((heading) => {
      const card = heading.closest('.card')
      return card
    })
  },

  getGameRow(gameNumber: number) {
    const heading = screen.getByRole('heading', {
      level: 3,
      name: `Game ${gameNumber}`,
    })
    const card = heading.closest('.card') as HTMLElement
    // Query directly from screen with full aria-label pattern
    return {
      container: card,
      youInput: screen.getByRole('spinbutton', {
        name: new RegExp(`game ${gameNumber} - you score`, 'i'),
      }),
      opponentInput: screen.getByRole('spinbutton', {
        name: new RegExp(`game ${gameNumber} - opponent score`, 'i'),
      }),
      statusText: within(card).getByText(
        /not played yet|winner:|game cannot|must have|must lead/i
      ),
    }
  },

  async enterGameScore(
    gameNumber: number,
    youScore: string,
    opponentScore: string
  ) {
    const row = this.getGameRow(gameNumber)
    // Use fireEvent.change for controlled inputs to ensure state updates properly
    fireEvent.change(row.youInput, { target: { value: youScore } })
    fireEvent.change(row.opponentInput, { target: { value: opponentScore } })
  },

  async clickSave() {
    await userEvent.click(this.saveButton)
  },

  async clickCancel() {
    const btn = this.cancelButton
    if (btn) {
      await userEvent.click(btn)
    }
  },
}
