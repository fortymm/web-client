import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import MatchDetailError, { type MatchDetailErrorProps } from './MatchDetailError'

export const matchDetailErrorPage = {
  render(options: Partial<MatchDetailErrorProps> = {}) {
    const onRetry = options.onRetry ?? vi.fn()
    render(<MatchDetailError onRetry={onRetry} />)
    return { onRetry }
  },

  get container() {
    return screen.getByTestId('match-detail-error')
  },

  get heading() {
    return screen.getByText("We couldn't load this match")
  },

  get retryButton() {
    return screen.getByRole('button', { name: /Try again/i })
  },

  async clickRetry() {
    await userEvent.click(this.retryButton)
  },
}
