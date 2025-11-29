import { describe, it, expect } from 'vitest'
import { newMatchPage } from './NewMatch.page'
import { landingPagePage } from './LandingPage.page'

describe('NewMatch', () => {
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
})
