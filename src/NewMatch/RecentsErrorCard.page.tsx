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

  get icon() {
    return screen.getByRole('img', { hidden: true })
  },

  get heading() {
    return screen.getByRole('heading', { level: 3 })
  },

  get retryButton() {
    return screen.getByRole('button', { name: /try again|retrying/i })
  },

  get headingText() {
    return this.heading.textContent
  },

  get isRetrying() {
    return this.retryButton.textContent === 'Retrying...'
  },

  async clickRetry() {
    const user = userEvent.setup()
    await user.click(this.retryButton)
  },
}
