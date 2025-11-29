import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { server } from '../test/mocks/server'
import { quickMatchButtonPage } from './QuickMatchButton.page'
import { useCreateMatchPage } from './useCreateMatch.page'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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


  describe('match creation', () => {
    it('calls API with correct payload including slug', async () => {
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
        expect(capturedPayload).toMatchObject({
          opponentId: null,
          matchLength: 3,
        })
        expect(capturedPayload?.slug).toMatch(UUID_REGEX)
      })
    })

    it('calls onMatchCreated immediately with generated slug', async () => {
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

      // Should be called immediately (optimistically), not after API response
      expect(onMatchCreated).toHaveBeenCalledTimes(1)
      expect(onMatchCreated).toHaveBeenCalledWith(expect.stringMatching(UUID_REGEX))
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

    it('sends same slug to API that was passed to onMatchCreated', async () => {
      let capturedSlug: string | null = null

      server.use(
        useCreateMatchPage.requestHandler(async ({ request }) => {
          const body = await request.json() as Record<string, unknown>
          capturedSlug = body.slug as string
          return HttpResponse.json({
            id: 'match-123',
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

      const calledSlug = (onMatchCreated as ReturnType<typeof vi.fn>).mock.calls[0][0]

      await waitFor(() => {
        expect(capturedSlug).toBe(calledSlug)
      })
    })
  })

  describe('error handling', () => {
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

    it('still calls onMatchCreated even if API fails', async () => {
      server.use(
        useCreateMatchPage.requestHandler(() => {
          return HttpResponse.error()
        })
      )

      const { onMatchCreated } = quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      // onMatchCreated is called optimistically before API response
      expect(onMatchCreated).toHaveBeenCalledTimes(1)
      expect(onMatchCreated).toHaveBeenCalledWith(expect.stringMatching(UUID_REGEX))
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
