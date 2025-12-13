import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { faker } from '@faker-js/faker'
import InProgressMatchModal, {
  type InProgressMatchModalProps,
} from './InProgressMatchModal'
import { type StoredMatch, type GameScore } from '@lib/matchesDb'

export function buildStoredMatch(
  overrides: Partial<StoredMatch> = {}
): StoredMatch {
  return {
    id: faker.string.uuid(),
    playerId: null,
    opponentId: faker.string.uuid(),
    matchLength: faker.helpers.arrayElement([1, 3, 5, 7]),
    status: 'in_progress',
    games: [],
    winnerId: null,
    createdAt: faker.date.recent({ days: 7 }),
    ...overrides,
  }
}

export function buildGameScore(
  overrides: Partial<GameScore> = {}
): GameScore {
  const player1Score = faker.number.int({ min: 0, max: 11 })
  const player2Score = faker.number.int({ min: 0, max: 11 })
  return {
    player1Score,
    player2Score,
    winnerId: player1Score > player2Score ? 'player-1' : 'player-2',
    ...overrides,
  }
}

interface RenderOptions {
  match?: StoredMatch
  opponentName?: string
  isOpen?: boolean
  onContinue?: () => void
  onEndAndStartNew?: () => void
  onClose?: () => void
}

export const inProgressMatchModalPage = {
  render(options: RenderOptions = {}) {
    const {
      match = buildStoredMatch(),
      opponentName,
      isOpen = true,
      onContinue = vi.fn(),
      onEndAndStartNew = vi.fn(),
      onClose = vi.fn(),
    } = options

    const props: InProgressMatchModalProps = {
      match,
      opponentName,
      isOpen,
      onContinue,
      onEndAndStartNew,
      onClose,
    }

    render(<InProgressMatchModal {...props} />)

    return { onContinue, onEndAndStartNew, onClose }
  },

  get dialog() {
    // Use querySelector since happy-dom doesn't properly expose dialog role
    const dialog = document.querySelector('dialog')
    if (!dialog) throw new Error('Dialog not found')
    return dialog
  },

  get title() {
    return screen.getByText('You have a match in progress')
  },

  get opponentInfo() {
    return screen.getByText(/^vs /)
  },

  getOpponentName() {
    const text = this.opponentInfo.textContent || ''
    return text.replace('vs ', '')
  },

  get scoreAndTime() {
    return screen.getByText(/·/)
  },

  getScore() {
    const text = this.scoreAndTime.textContent || ''
    const match = text.match(/^(\d+-\d+)/)
    return match ? match[1] : ''
  },

  get continueButton() {
    return screen.getByText(/continue that match/i).closest('button')!
  },

  get endAndStartNewButton() {
    return screen.getByText(/end it and start new/i).closest('button')!
  },

  get closeButton() {
    return screen.getByLabelText(/close modal/i)
  },

  async clickContinue() {
    await userEvent.click(this.continueButton)
  },

  async clickEndAndStartNew() {
    await userEvent.click(this.endAndStartNewButton)
  },

  async clickClose() {
    await userEvent.click(this.closeButton)
  },
}
