import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RecentsErrorCard, { type RecentsErrorCardProps } from './RecentsErrorCard'

interface RenderOptions {
  onRetry?: RecentsErrorCardProps['onRetry']
  retryCount?: number
}

export const recentsErrorCardPage = {
  render(options: RenderOptions = {}) {
    const { onRetry = vi.fn(), retryCount = 0 } = options
    render(<RecentsErrorCard onRetry={onRetry} retryCount={retryCount} />)
    return { onRetry }
  },

  get alert() {
    return screen.getByRole('alert')
  },

  get title() {
    return screen.getByText(/couldn't load your recent players/i)
  },

  get subtitle() {
    return screen.getByText(/everything else still works|check your connection/i)
  },

  get retryButton() {
    return screen.getByRole('button', { name: /try again|retrying/i })
  },

  get titleText() {
    return this.title.textContent
  },

  get subtitleText() {
    return this.subtitle.textContent
  },

  get isRetrying() {
    return this.retryButton.textContent === 'Retrying...'
  },

  async clickRetry() {
    const user = userEvent.setup()
    await user.click(this.retryButton)
  },
}
