import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse, delay } from 'msw'
import { server } from './test/mocks/server'
import { newMatchPage } from './NewMatch.page'
import { landingPagePage } from './LandingPage.page'
import { useCreateMatchPage } from './NewMatch/useCreateMatch.page'
import { matchScorePagePage } from './MatchScorePage.page'

describe('NewMatch', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { vibrate: vi.fn() })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('routing', () => {
    it('renders when navigating to /matches/new', () => {
      newMatchPage.render()
      expect(newMatchPage.heroHeading).toBeInTheDocument()
    })

    it('includes the shared navbar', () => {
      newMatchPage.render()
      expect(newMatchPage.navbar).toBeInTheDocument()
      expect(newMatchPage.brandLink).toBeInTheDocument()
    })

    it('can navigate back to home via brand link', async () => {
      newMatchPage.render()
      await newMatchPage.clickBrandLink()
      expect(landingPagePage.increaseCountButton).toBeInTheDocument()
    })
  })

  describe('layout structure', () => {
    it('renders all child components', () => {
      newMatchPage.render()

      // Hero
      expect(newMatchPage.heroHeading).toBeInTheDocument()
      expect(newMatchPage.heroDescription).toBeInTheDocument()

      // Search
      expect(newMatchPage.searchPlaceholder).toBeInTheDocument()

      // Section header
      expect(newMatchPage.recentPlayersHeader).toBeInTheDocument()

      // Bottom panel
      expect(newMatchPage.matchLengthLabel).toBeInTheDocument()
      expect(newMatchPage.matchLengthGroup).toBeInTheDocument()
      expect(newMatchPage.quickMatchButton).toBeInTheDocument()
    })
  })

  describe('match length control', () => {
    it('defaults to best of 5', () => {
      newMatchPage.render()
      expect(newMatchPage.getMatchLengthRadio(5)).toBeChecked()
    })

    it('allows selecting different match lengths', async () => {
      newMatchPage.render()

      await newMatchPage.selectMatchLength(3)
      expect(newMatchPage.getMatchLengthRadio(3)).toBeChecked()

      await newMatchPage.selectMatchLength(7)
      expect(newMatchPage.getMatchLengthRadio(7)).toBeChecked()
    })
  })

  describe('quick match integration', () => {
    it('sends default match length when clicking quick match', async () => {
      let capturedPayload: Record<string, unknown> | null = null

      server.use(
        useCreateMatchPage.requestHandler(async ({ request }) => {
          capturedPayload = await request.json() as Record<string, unknown>
          return HttpResponse.json({
            id: 'match-123',
            playerId: null,
            matchLength: capturedPayload.matchLength,
            opponentId: null,
            status: 'in_progress',
            createdAt: new Date().toISOString(),
          })
        })
      )

      newMatchPage.render()
      await newMatchPage.clickQuickMatch()

      await waitFor(() => {
        expect(capturedPayload).toEqual({
          opponentId: null,
          matchLength: 5,
        })
      })
    })

    it('sends selected match length when clicking quick match', async () => {
      let capturedPayload: Record<string, unknown> | null = null

      server.use(
        useCreateMatchPage.requestHandler(async ({ request }) => {
          capturedPayload = await request.json() as Record<string, unknown>
          return HttpResponse.json({
            id: 'match-456',
            playerId: null,
            matchLength: capturedPayload.matchLength,
            opponentId: null,
            status: 'in_progress',
            createdAt: new Date().toISOString(),
          })
        })
      )

      newMatchPage.render()
      await newMatchPage.selectMatchLength(7)
      await newMatchPage.clickQuickMatch()

      await waitFor(() => {
        expect(capturedPayload).toEqual({
          opponentId: null,
          matchLength: 7,
        })
      })
    })

    it('shows loading state while creating match', async () => {
      server.use(
        useCreateMatchPage.requestHandler(async () => {
          await delay('infinite')
          return HttpResponse.json({})
        })
      )

      newMatchPage.render()
      await newMatchPage.clickQuickMatch()

      await waitFor(() => {
        expect(newMatchPage.quickMatchButtonLoading).toBeDisabled()
      })
    })

    it('navigates to score page after successful match creation', async () => {
      server.use(
        useCreateMatchPage.requestHandler(() => {
          return HttpResponse.json({
            id: 'match-789',
            playerId: null,
            matchLength: 5,
            opponentId: null,
            status: 'in_progress',
            createdAt: new Date().toISOString(),
          })
        })
      )

      newMatchPage.render()
      await newMatchPage.clickQuickMatch()

      await waitFor(() => {
        expect(matchScorePagePage.heading).toBeInTheDocument()
      })
    })

    it('can change match length and create match in sequence', async () => {
      const capturedPayloads: Record<string, unknown>[] = []

      server.use(
        useCreateMatchPage.requestHandler(async ({ request }) => {
          const payload = await request.json() as Record<string, unknown>
          capturedPayloads.push(payload)
          return HttpResponse.json({
            id: `match-${capturedPayloads.length}`,
            playerId: null,
            matchLength: payload.matchLength,
            opponentId: null,
            status: 'in_progress',
            createdAt: new Date().toISOString(),
          })
        })
      )

      newMatchPage.render()

      // Select best of 1 and create match
      await newMatchPage.selectMatchLength(1)
      expect(newMatchPage.getMatchLengthRadio(1)).toBeChecked()
      await newMatchPage.clickQuickMatch()

      await waitFor(() => {
        expect(capturedPayloads[0]).toEqual({
          opponentId: null,
          matchLength: 1,
        })
      })
    })
  })
})
