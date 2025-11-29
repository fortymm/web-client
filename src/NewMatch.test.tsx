import { describe, it, expect } from 'vitest'
import { newMatchPage } from './NewMatch.page'
import { landingPagePage } from './LandingPage.page'

describe('NewMatch', () => {
  describe('routing', () => {
    it('renders when navigating to /matches/new', () => {
      newMatchPage.render()
      expect(newMatchPage.heading).toBeInTheDocument()
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

  describe('hero section', () => {
    it('displays the page heading', () => {
      newMatchPage.render()
      expect(newMatchPage.heading).toBeInTheDocument()
      expect(newMatchPage.heading).toHaveTextContent('New match')
    })

    it('displays the hero description', () => {
      newMatchPage.render()
      expect(newMatchPage.heroDescription).toBeInTheDocument()
    })

    it('has correct heading level for accessibility', () => {
      newMatchPage.render()
      expect(newMatchPage.heading.tagName).toBe('H1')
    })
  })

  describe('search section', () => {
    it('displays the search placeholder', () => {
      newMatchPage.render()
      expect(newMatchPage.searchPlaceholder).toBeInTheDocument()
    })

    it('has the search container', () => {
      newMatchPage.render()
      expect(newMatchPage.searchContainer).toBeInTheDocument()
    })
  })

  describe('content area', () => {
    it('displays the recent players section header', () => {
      newMatchPage.render()
      expect(newMatchPage.recentPlayersHeader).toBeInTheDocument()
    })

    it('has correct heading level for section header', () => {
      newMatchPage.render()
      expect(newMatchPage.recentPlayersHeader.tagName).toBe('H2')
    })

    it('displays the content area placeholder', () => {
      newMatchPage.render()
      expect(newMatchPage.contentAreaPlaceholder).toBeInTheDocument()
    })
  })

  describe('bottom panel', () => {
    it('displays the match length control placeholder', () => {
      newMatchPage.render()
      expect(newMatchPage.matchLengthControl).toBeInTheDocument()
    })

    it('displays the quick match button', () => {
      newMatchPage.render()
      expect(newMatchPage.quickMatchButton).toBeInTheDocument()
    })

    it('quick match button has correct styling', () => {
      newMatchPage.render()
      expect(newMatchPage.quickMatchButton).toHaveClass('btn', 'btn-primary')
    })

    it('quick match button has correct text', () => {
      newMatchPage.render()
      expect(newMatchPage.quickMatchButton).toHaveTextContent('Quick Match')
    })
  })

  describe('layout structure', () => {
    it('renders all main sections', () => {
      newMatchPage.render()

      // Hero
      expect(newMatchPage.heading).toBeInTheDocument()
      expect(newMatchPage.heroDescription).toBeInTheDocument()

      // Search
      expect(newMatchPage.searchPlaceholder).toBeInTheDocument()

      // Content
      expect(newMatchPage.recentPlayersHeader).toBeInTheDocument()

      // Bottom panel
      expect(newMatchPage.matchLengthControl).toBeInTheDocument()
      expect(newMatchPage.quickMatchButton).toBeInTheDocument()
    })
  })
})
