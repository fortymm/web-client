import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse, delay } from 'msw'
import { server } from '../test/mocks/server'
import { quickMatchButtonPage } from './QuickMatchButton.page'
import { useCreateMatchPage } from './useCreateMatch.page'

describe('QuickMatchButton', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { vibrate: vi.fn() })
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

    it('displays main text with bolt icon', () => {
      quickMatchButtonPage.render()
      expect(quickMatchButtonPage.mainText).toBeInTheDocument()
      expect(quickMatchButtonPage.boltIcon).toBeInTheDocument()
    })

    it('displays subtitle text', () => {
      quickMatchButtonPage.render()
      expect(quickMatchButtonPage.subtitleText).toBeInTheDocument()
    })

    it('has fixed touch height of 56px', () => {
      quickMatchButtonPage.render()
      expect(quickMatchButtonPage.button).toHaveClass('h-[56px]')
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
      server.use(
        useCreateMatchPage.requestHandler(async () => {
          await delay('infinite')
          return HttpResponse.json({})
        })
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.spinner).toBeInTheDocument()
      })
    })

    it('shows loading text when creating match', async () => {
      server.use(
        useCreateMatchPage.requestHandler(async () => {
          await delay('infinite')
          return HttpResponse.json({})
        })
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.loadingText).toBeInTheDocument()
      })
    })

    it('disables button when creating match', async () => {
      server.use(
        useCreateMatchPage.requestHandler(async () => {
          await delay('infinite')
          return HttpResponse.json({})
        })
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.loadingButton).toBeDisabled()
      })
    })

    it('sets aria-busy when creating match', async () => {
      server.use(
        useCreateMatchPage.requestHandler(async () => {
          await delay('infinite')
          return HttpResponse.json({})
        })
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
      let capturedPayload: Record<string, unknown> | null = null

      server.use(
        useCreateMatchPage.requestHandler(async ({ request }) => {
          capturedPayload = await request.json() as Record<string, unknown>
          return HttpResponse.json({
            id: 'match-123',
            playerId: null,
            matchLength: capturedPayload.matchLength,
            opponentId: capturedPayload.opponentId,
            status: 'in_progress',
            createdAt: new Date().toISOString(),
          })
        })
      )

      quickMatchButtonPage.render({ matchLength: 3 })
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(capturedPayload).toEqual({
          opponentId: null,
          matchLength: 3,
        })
      })
    })

    it('calls onMatchCreated with match ID on success', async () => {
      server.use(
        useCreateMatchPage.requestHandler(() => {
          return HttpResponse.json({
            id: 'match-456',
            playerId: null,
            matchLength: 5,
            opponentId: null,
            status: 'in_progress',
            createdAt: new Date().toISOString(),
          })
        })
      )

      const { onMatchCreated } = quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(onMatchCreated).toHaveBeenCalledWith('match-456')
      })
    })

    it('uses the provided matchLength prop', async () => {
      let capturedMatchLength: number | null = null

      server.use(
        useCreateMatchPage.requestHandler(async ({ request }) => {
          const body = await request.json() as Record<string, unknown>
          capturedMatchLength = body.matchLength as number
          return HttpResponse.json({
            id: 'match-789',
            playerId: null,
            matchLength: capturedMatchLength,
            opponentId: null,
            status: 'in_progress',
            createdAt: new Date().toISOString(),
          })
        })
      )

      quickMatchButtonPage.render({ matchLength: 7 })
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(capturedMatchLength).toBe(7)
      })
    })
  })

  describe('error handling', () => {
    it('re-enables button on API error', async () => {
      server.use(
        useCreateMatchPage.requestHandler(() => {
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
          )
        })
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.button).not.toBeDisabled()
      })
    })

    it('re-enables button on network error', async () => {
      server.use(
        useCreateMatchPage.requestHandler(() => {
          return HttpResponse.error()
        })
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      await waitFor(() => {
        expect(quickMatchButtonPage.button).not.toBeDisabled()
      })
    })

    it('logs error on failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      server.use(
        useCreateMatchPage.requestHandler(() => {
          return HttpResponse.error()
        })
      )

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
      let callCount = 0

      server.use(
        useCreateMatchPage.requestHandler(async () => {
          callCount++
          await delay('infinite')
          return HttpResponse.json({})
        })
      )

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      // Wait for button to enter loading state
      await waitFor(() => {
        expect(quickMatchButtonPage.loadingButton).toBeDisabled()
      })

      // Try to click again while loading - should be ignored
      const loadingButton = quickMatchButtonPage.loadingButton
      await loadingButton.click()
      await loadingButton.click()
      await loadingButton.click()

      // Should still only have one API call
      expect(callCount).toBe(1)
    })
  })

  describe('haptic feedback', () => {
    it('triggers vibration on click when available', async () => {
      const vibrateSpy = vi.fn()
      vi.stubGlobal('navigator', { vibrate: vibrateSpy })

      quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      expect(vibrateSpy).toHaveBeenCalledWith(10)
    })
  })
})
