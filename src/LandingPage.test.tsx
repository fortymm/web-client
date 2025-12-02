import { describe, it, expect } from 'vitest'
import { landingPagePage } from './LandingPage.page'
import { newMatchPage } from './NewMatch.page'

describe('LandingPage', () => {
  describe('new match button', () => {
    it('displays the new match button', () => {
      landingPagePage.render()
      expect(landingPagePage.newMatchButton).toBeInTheDocument()
    })

    it('has the correct button text', () => {
      landingPagePage.render()
      expect(landingPagePage.newMatchButton).toHaveTextContent('New match')
    })

    it('has the correct styling', () => {
      landingPagePage.render()
      expect(landingPagePage.newMatchButton).toHaveClass('btn', 'btn-primary')
    })

    it('navigates to new match page when clicked', async () => {
      landingPagePage.render()

      await landingPagePage.clickNewMatchButton()

      expect(newMatchPage.heroHeading).toBeInTheDocument()
    })
  })
})
