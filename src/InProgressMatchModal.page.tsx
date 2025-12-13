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

export function buildGameScore(overrides: Partial<GameScore> = {}): GameScore {
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
  onEndMatch?: () => void
  onClose?: () => void
}

export const inProgressMatchModalPage = {
  render(options: RenderOptions = {}) {
    const {
      match = buildStoredMatch(),
      opponentName,
      isOpen = true,
      onContinue = vi.fn(),
      onEndMatch = vi.fn(),
      onClose = vi.fn(),
    } = options

    const props: InProgressMatchModalProps = {
      match,
      opponentName,
      isOpen,
      onContinue,
      onEndMatch,
      onClose,
    }

    render(<InProgressMatchModal {...props} />)

    return { onContinue, onEndMatch, onClose }
  },

  get dialog() {
    // Use querySelector since happy-dom doesn't properly expose dialog role
    const dialog = document.querySelector('dialog')
    if (!dialog) throw new Error('Dialog not found')
    return dialog
  },

  get title() {
    return screen.getByText('Match in progress')
  },

  get helperText() {
    return screen.getByText(
      /You can't start a new match until you finish or end the current one/i
    )
  },

  get inProgressBadge() {
    // Use querySelector scoped to modal-box to avoid matching badges in MatchList
    const modalBox = document.querySelector('.modal-box')
    if (!modalBox) throw new Error('Modal box not found')
    return modalBox.querySelector('.badge-warning')!
  },

  get progressBar() {
    return screen.getByRole('progressbar')
  },

  getMatchLength() {
    const text = screen.getByText(/Best of \d|Single game/).textContent || ''
    return text
  },

  getStartedTime() {
    const text = screen.getByText(/Started/).textContent || ''
    return text
  },

  get resumeButton() {
    return screen.getByText(/resume match/i).closest('button')!
  },

  get cancelButton() {
    return screen.getByText(/^cancel$/i).closest('button')!
  },

  get endMatchButton() {
    return screen.getByText(/^end match$/i).closest('button')!
  },

  get closeButton() {
    return screen.getByLabelText(/close modal/i)
  },

  // Confirmation dialog
  get confirmTitle() {
    return screen.getByText('End match?')
  },

  get confirmMessage() {
    return screen.getByText(/This can't be undone/)
  },

  get confirmEndButton() {
    return screen.getAllByText(/^end match$/i)[0].closest('button')!
  },

  get goBackButton() {
    return screen.getByText(/go back/i).closest('button')!
  },

  async clickResume() {
    await userEvent.click(this.resumeButton)
  },

  async clickCancel() {
    await userEvent.click(this.cancelButton)
  },

  async clickEndMatch() {
    await userEvent.click(this.endMatchButton)
  },

  async clickClose() {
    await userEvent.click(this.closeButton)
  },

  async clickConfirmEnd() {
    await userEvent.click(this.confirmEndButton)
  },

  async clickGoBack() {
    await userEvent.click(this.goBackButton)
  },
}
