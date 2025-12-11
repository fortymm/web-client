import { describe, it, expect } from 'vitest'
import { landingPagePage } from './LandingPage.page'
import { newMatchPage } from './NewMatch.page'

describe('LandingPage', () => {
  describe('new match button', () => {
    it('displays the new match button', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()
      expect(landingPagePage.newMatchButton).toBeInTheDocument()
    })

    it('has the correct button text', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()
      expect(landingPagePage.newMatchButton).toHaveTextContent('New match')
    })

    it('has the correct styling', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()
      expect(landingPagePage.newMatchButton).toHaveClass('btn', 'btn-primary')
    })

    it('navigates to new match page when clicked', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      await landingPagePage.clickNewMatchButton()

      expect(newMatchPage.heroHeading).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('displays empty state when no matches exist', async () => {
      landingPagePage.render()
      await landingPagePage.waitForLoaded()

      expect(landingPagePage.emptyState).toBeInTheDocument()
    })
  })
})
