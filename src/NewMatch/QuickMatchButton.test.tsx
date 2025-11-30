import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
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
    it('saves match to IndexedDB with correct payload', async () => {
      const { onMatchCreated } = quickMatchButtonPage.render({ matchLength: 3 })
      await quickMatchButtonPage.click()

      const calledId = (onMatchCreated as ReturnType<typeof vi.fn>).mock.calls[0][0]

      await waitFor(async () => {
        const storedMatch = await useCreateMatchPage.getStoredMatch(calledId)
        expect(storedMatch).toMatchObject({
          opponentId: null,
          matchLength: 3,
        })
        expect(storedMatch?.id).toMatch(UUID_REGEX)
      })
    })

    it('calls onMatchCreated immediately with generated id', async () => {
      const { onMatchCreated } = quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      // Should be called immediately (optimistically)
      expect(onMatchCreated).toHaveBeenCalledTimes(1)
      expect(onMatchCreated).toHaveBeenCalledWith(expect.stringMatching(UUID_REGEX))
    })

    it('uses the provided matchLength prop', async () => {
      const { onMatchCreated } = quickMatchButtonPage.render({ matchLength: 7 })
      await quickMatchButtonPage.click()

      const calledId = (onMatchCreated as ReturnType<typeof vi.fn>).mock.calls[0][0]

      await waitFor(async () => {
        const storedMatch = await useCreateMatchPage.getStoredMatch(calledId)
        expect(storedMatch?.matchLength).toBe(7)
      })
    })

    it('stores match with same id that was passed to onMatchCreated', async () => {
      const { onMatchCreated } = quickMatchButtonPage.render()
      await quickMatchButtonPage.click()

      const calledId = (onMatchCreated as ReturnType<typeof vi.fn>).mock.calls[0][0]

      await waitFor(async () => {
        const storedMatch = await useCreateMatchPage.getStoredMatch(calledId)
        expect(storedMatch?.id).toBe(calledId)
      })
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
