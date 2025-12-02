import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { newMatchPage } from './NewMatch.page'
import { landingPagePage } from './LandingPage.page'
import { matchScorePagePage } from './MatchScorePage.page'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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

  describe('player list', () => {
    it('renders the player list with mock players', async () => {
      newMatchPage.render()
      await newMatchPage.waitForPlayersToLoad()
      expect(newMatchPage.playerList).toBeInTheDocument()
      expect(newMatchPage.playerRows.length).toBeGreaterThan(0)
    })

    it('displays 50 player rows', async () => {
      newMatchPage.render()
      await newMatchPage.waitForPlayersToLoad()
      expect(newMatchPage.playerRows).toHaveLength(50)
    })
  })

  describe('player selection', () => {
    it('navigates to score page when clicking a player', async () => {
      newMatchPage.render()
      await newMatchPage.waitForPlayersToLoad()
      await newMatchPage.clickPlayerByIndex(0)

      expect(matchScorePagePage.heading).toBeInTheDocument()
    })

    it('saves match with opponentId when clicking a player', async () => {
      newMatchPage.render()
      await newMatchPage.waitForPlayersToLoad()
      await newMatchPage.clickPlayerByIndex(0)

      await waitFor(async () => {
        const matches = await import('./lib/matchesDb').then(m => m.getAllMatches())
        expect(matches).toHaveLength(1)
        expect(matches[0].opponentId).toBe('player-1')
        expect(matches[0].matchLength).toBe(5)
        expect(matches[0].id).toMatch(UUID_REGEX)
      })
    })

    it('uses selected match length when clicking a player', async () => {
      newMatchPage.render()
      await newMatchPage.waitForPlayersToLoad()
      await newMatchPage.selectMatchLength(3)
      await newMatchPage.clickPlayerByIndex(0)

      await waitFor(async () => {
        const matches = await import('./lib/matchesDb').then(m => m.getAllMatches())
        expect(matches).toHaveLength(1)
        expect(matches[0].matchLength).toBe(3)
      })
    })
  })

  describe('quick match integration', () => {
    it('saves default match length to IndexedDB when clicking quick match', async () => {
      newMatchPage.render()
      await newMatchPage.clickQuickMatch()

      // Get all matches from IndexedDB
      await waitFor(async () => {
        const matches = await import('./lib/matchesDb').then(m => m.getAllMatches())
        expect(matches).toHaveLength(1)
        expect(matches[0]).toMatchObject({
          opponentId: null,
          matchLength: 5,
        })
        expect(matches[0].id).toMatch(UUID_REGEX)
      })
    })

    it('saves selected match length to IndexedDB when clicking quick match', async () => {
      newMatchPage.render()
      await newMatchPage.selectMatchLength(7)
      await newMatchPage.clickQuickMatch()

      await waitFor(async () => {
        const matches = await import('./lib/matchesDb').then(m => m.getAllMatches())
        expect(matches).toHaveLength(1)
        expect(matches[0]).toMatchObject({
          opponentId: null,
          matchLength: 7,
        })
        expect(matches[0].id).toMatch(UUID_REGEX)
      })
    })

    it('navigates to score page immediately with generated id', async () => {
      newMatchPage.render()
      await newMatchPage.clickQuickMatch()

      // Navigation happens optimistically, so it should be immediate
      expect(matchScorePagePage.heading).toBeInTheDocument()
    })

    it('can change match length and create match in sequence', async () => {
      newMatchPage.render()

      // Select best of 1 and create match
      await newMatchPage.selectMatchLength(1)
      expect(newMatchPage.getMatchLengthRadio(1)).toBeChecked()
      await newMatchPage.clickQuickMatch()

      await waitFor(async () => {
        const matches = await import('./lib/matchesDb').then(m => m.getAllMatches())
        expect(matches).toHaveLength(1)
        expect(matches[0]).toMatchObject({
          opponentId: null,
          matchLength: 1,
        })
        expect(matches[0].id).toMatch(UUID_REGEX)
      })
    })
  })
})
