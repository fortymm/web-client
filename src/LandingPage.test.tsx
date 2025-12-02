import { describe, it, expect } from 'vitest'
import { landingPagePage } from './LandingPage.page'
import { newMatchPage } from './NewMatch.page'

describe('LandingPage', () => {
  describe('new match link', () => {
    it('displays the new match link', () => {
      landingPagePage.render()
      expect(landingPagePage.newMatchLink).toBeInTheDocument()
    })

    it('has the correct link text', () => {
      landingPagePage.render()
      expect(landingPagePage.newMatchLink).toHaveTextContent('New Match')
    })

    it('has the correct styling', () => {
      landingPagePage.render()
      expect(landingPagePage.newMatchLink).toHaveClass('btn', 'btn-secondary')
    })

    it('links to the new match page', () => {
      landingPagePage.render()
      expect(landingPagePage.newMatchLink).toHaveAttribute('href', '/matches/new')
    })

    it('navigates to new match page when clicked', async () => {
      landingPagePage.render()

      await landingPagePage.clickNewMatchLink()

      expect(newMatchPage.heroHeading).toBeInTheDocument()
    })
  })
})
