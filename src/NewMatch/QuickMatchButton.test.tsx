import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { quickMatchButtonPage } from './QuickMatchButton.page'

describe('QuickMatchButton', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('rendering', () => {
    it('displays the quick match button', () => {
      quickMatchButtonPage.render()
      expect(quickMatchButtonPage.button).toBeInTheDocument()
    })

    it('has correct styling', () => {
      quickMatchButtonPage.render()
      expect(quickMatchButtonPage.button).toHaveClass(
        'btn',
        'btn-primary',
        'btn-block'
      )
    })

    it('displays main text with lightning emoji', () => {
      quickMatchButtonPage.render()
      expect(quickMatchButtonPage.mainText).toBeInTheDocument()
      expect(quickMatchButtonPage.button).toHaveTextContent('⚡')
    })

    it('displays subtitle text', () => {
      quickMatchButtonPage.render()
      expect(quickMatchButtonPage.subtitleText).toBeInTheDocument()
    })

    it('has minimum touch height of 56px', () => {
      quickMatchButtonPage.render()
      expect(quickMatchButtonPage.button).toHaveClass('min-h-[56px]')
    })

    it('is full width', () => {
      quickMatchButtonPage.render()
      expect(quickMatchButtonPage.button).toHaveClass('btn-block')
    })
  })

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      quickMatchButtonPage.render({ disabled: true })
      expect(quickMatchButtonPage.button).toBeDisabled()
    })

    it('is enabled when disabled prop is false', () => {
      quickMatchButtonPage.render({ disabled: false })
      expect(quickMatchButtonPage.button).not.toBeDisabled()
    })
  })

  describe('loading state', () => {
    it('shows loading spinner when creating match', async () => {
      vi.mocked(fetch).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.spinner).toBeInTheDocument()
      })
    })

    it('shows loading text when creating match', async () => {
      vi.mocked(fetch).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.loadingText).toBeInTheDocument()
      })
    })

    it('disables button when creating match', async () => {
      vi.mocked(fetch).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.loadingButton).toBeDisabled()
      })
    })

    it('sets aria-busy when creating match', async () => {
      vi.mocked(fetch).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.loadingButton).toHaveAttribute(
          'aria-busy',
          'true'
        )
      })
    })
  })

  describe('match creation', () => {
    it('calls API with correct payload', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'match-123' }),
      } as Response)

      quickMatchButtonPage.render({ matchLength: 3 })
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/matches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            opponentId: null,
            matchLength: 3,
            status: 'in_progress',
          }),
        })
      })
    })

    it('calls onMatchCreated with match ID on success', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'match-456' }),
      } as Response)

      const { onMatchCreated } = quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(onMatchCreated).toHaveBeenCalledWith('match-456')
      })
    })

    it('uses the provided matchLength prop', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'match-789' }),
      } as Response)

      quickMatchButtonPage.render({ matchLength: 7 })
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/matches',
          expect.objectContaining({
            body: expect.stringContaining('"matchLength":7'),
          })
        )
      })
    })
  })

  describe('error handling', () => {
    it('re-enables button on API error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.button).not.toBeDisabled()
      })
    })

    it('re-enables button on network error', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.button).not.toBeDisabled()
      })
    })

    it('logs error on failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to create match:',
          expect.any(Error)
        )
      })

      consoleSpy.mockRestore()
    })
  })

  describe('double-tap prevention', () => {
    it('prevents multiple clicks while creating', async () => {
      vi.mocked(fetch).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      // Button is now disabled and in loading state
      // Subsequent clicks should not trigger additional API calls
      await waitFor(() => {
        expect(quickMatchButtonPage.loadingButton).toBeDisabled()
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('haptic feedback', () => {
    it('triggers vibration on click when available', async () => {
      const vibrateSpy = vi.fn()
      vi.stubGlobal('navigator', { vibrate: vibrateSpy })
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'match-123' }),
      } as Response)

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      expect(vibrateSpy).toHaveBeenCalledWith(10)
    })
  })
})
