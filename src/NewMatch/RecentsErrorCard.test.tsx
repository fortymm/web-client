import { describe, it, expect, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { recentsErrorCardPage } from './RecentsErrorCard.page'

describe('RecentsErrorCard', () => {
  describe('rendering', () => {
    it('renders as an alert with title and subtitle', () => {
      recentsErrorCardPage.render()
      expect(recentsErrorCardPage.alert).toBeInTheDocument()
      expect(recentsErrorCardPage.titleText).toBe("We couldn't load your recent players.")
      expect(recentsErrorCardPage.subtitleText).toBe(
        'You can still search for players or start a Quick Match.'
      )
    })

    it('renders retry button with outline styling', () => {
      recentsErrorCardPage.render()
      expect(recentsErrorCardPage.retryButton).toBeInTheDocument()
      expect(recentsErrorCardPage.retryButton).toHaveTextContent('Try again')
      expect(recentsErrorCardPage.retryButton).toHaveClass('btn-outline', 'btn-warning')
    })
  })

  describe('retry button', () => {
    it('triggers onRetry callback when clicked', async () => {
      const onRetry = vi.fn()
      recentsErrorCardPage.render({ onRetry })

      await recentsErrorCardPage.clickRetry()

      expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it('shows loading state during retry', async () => {
      let resolveRetry: () => void
      const onRetry = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveRetry = resolve
          })
      )
      recentsErrorCardPage.render({ onRetry })

      // Start retry without awaiting
      const retryPromise = recentsErrorCardPage.clickRetry()

      await waitFor(() => {
        expect(recentsErrorCardPage.retryButton).toHaveTextContent('Retrying...')
        expect(recentsErrorCardPage.retryButton).toBeDisabled()
      })

      // Resolve the retry
      resolveRetry!()
      await retryPromise

      await waitFor(() => {
        expect(recentsErrorCardPage.retryButton).toHaveTextContent('Try again')
        expect(recentsErrorCardPage.retryButton).not.toBeDisabled()
      })
    })

    it('disables button while retrying', async () => {
      let resolveRetry: () => void
      const onRetry = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveRetry = resolve
          })
      )
      recentsErrorCardPage.render({ onRetry })

      const retryPromise = recentsErrorCardPage.clickRetry()

      await waitFor(() => {
        expect(recentsErrorCardPage.retryButton).toBeDisabled()
      })

      resolveRetry!()
      await retryPromise
    })
  })

  describe('retry count messaging', () => {
    it('shows default message when retry count is 0', () => {
      recentsErrorCardPage.render({ retryCount: 0 })
      expect(recentsErrorCardPage.titleText).toBe("We couldn't load your recent players.")
      expect(recentsErrorCardPage.subtitleText).toBe(
        'You can still search for players or start a Quick Match.'
      )
    })

    it('shows default message when retry count is 1', () => {
      recentsErrorCardPage.render({ retryCount: 1 })
      expect(recentsErrorCardPage.titleText).toBe("We couldn't load your recent players.")
    })

    it('shows default message when retry count is 2', () => {
      recentsErrorCardPage.render({ retryCount: 2 })
      expect(recentsErrorCardPage.titleText).toBe("We couldn't load your recent players.")
    })

    it('shows persistent failure message when retry count is 3', () => {
      recentsErrorCardPage.render({ retryCount: 3 })
      expect(recentsErrorCardPage.titleText).toBe("Still couldn't load your recent players.")
      expect(recentsErrorCardPage.subtitleText).toBe(
        'Check your connection or try again later.'
      )
    })

    it('shows persistent failure message when retry count exceeds 3', () => {
      recentsErrorCardPage.render({ retryCount: 5 })
      expect(recentsErrorCardPage.titleText).toBe("Still couldn't load your recent players.")
      expect(recentsErrorCardPage.subtitleText).toBe(
        'Check your connection or try again later.'
      )
    })
  })
})
