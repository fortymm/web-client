import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import QuickMatchButton from './QuickMatchButton'
import { type MatchLength } from './MatchLengthControl'

interface RenderOptions {
  matchLength?: MatchLength
  onMatchCreated?: (matchId: string) => void
  disabled?: boolean
}

export const quickMatchButtonPage = {
  render(options: RenderOptions = {}) {
    const {
      matchLength = 5,
      onMatchCreated = vi.fn(),
      disabled = false,
    } = options

    render(
      <QuickMatchButton
        matchLength={matchLength}
        onMatchCreated={onMatchCreated}
        disabled={disabled}
      />
    )

    return { onMatchCreated }
  },

  get button() {
    return screen.getByRole('button', { name: /Quick Match/i })
  },

  get loadingButton() {
    return screen.getByRole('button', { name: /Creating match/i })
  },

  get spinner() {
    return screen.getByRole('button').querySelector('.loading-spinner')
  },

  get mainText() {
    return screen.getByText(/Quick Match/i)
  },

  get subtitleText() {
    return screen.queryByText(/Start now · Choose player later/i)
  },

  get loadingText() {
    return screen.queryByText(/Creating match.../i)
  },

  async click() {
    await userEvent.click(this.button)
  },
}
