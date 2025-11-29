import { describe, it, expect } from 'vitest'
import { newMatchPage } from './NewMatch.page'
import { landingPagePage } from './LandingPage.page'

describe('NewMatch', () => {
  describe('routing', () => {
    it('renders when navigating to /matches/new', () => {
      newMatchPage.render()
      expect(newMatchPage.hero.heading).toBeInTheDocument()
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
      expect(newMatchPage.hero.heading).toBeInTheDocument()
      expect(newMatchPage.hero.description).toBeInTheDocument()

      // Search
      expect(newMatchPage.search.placeholder).toBeInTheDocument()

      // Section header
      expect(newMatchPage.sectionHeader.recentPlayersHeader).toBeInTheDocument()

      // Bottom panel
      expect(newMatchPage.matchLengthControl.control).toBeInTheDocument()
      expect(newMatchPage.quickMatchButton.button).toBeInTheDocument()
    })
  })
})
