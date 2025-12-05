import { describe, it, expect, vi } from 'vitest'
import { matchDetailErrorPage } from './MatchDetailError.page'

describe('MatchDetailError', () => {
  it('displays error heading', () => {
    matchDetailErrorPage.render()
    expect(matchDetailErrorPage.heading).toBeInTheDocument()
  })

  it('displays retry button', () => {
    matchDetailErrorPage.render()
    expect(matchDetailErrorPage.retryButton).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = vi.fn()
    matchDetailErrorPage.render({ onRetry })

    await matchDetailErrorPage.clickRetry()

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('has proper accessibility role', () => {
    matchDetailErrorPage.render()
    expect(matchDetailErrorPage.container).toHaveAttribute('role', 'alert')
  })
})
