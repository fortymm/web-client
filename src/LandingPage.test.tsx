import { describe, it, expect } from 'vitest'
import { landingPagePage } from './LandingPage.page'
import { newMatchPage } from './NewMatch.page'

describe('LandingPage', () => {
  describe('counter button', () => {
    it('renders with initial count of 0', () => {
      landingPagePage.render()
      expect(landingPagePage.currentCount).toBe(0)
    })

    it('displays the count is button', () => {
      landingPagePage.render()
      expect(landingPagePage.increaseCountButton).toBeInTheDocument()
      expect(landingPagePage.increaseCountButton).toHaveTextContent('count is 0')
    })

    it('increments the count when clicked once', async () => {
      landingPagePage.render()

      await landingPagePage.clickIncreaseCount()

      expect(landingPagePage.currentCount).toBe(1)
    })

    it('increments the count multiple times', async () => {
      landingPagePage.render()

      await landingPagePage.clickIncreaseCount()
      expect(landingPagePage.currentCount).toBe(1)

      await landingPagePage.clickIncreaseCount()
      expect(landingPagePage.currentCount).toBe(2)

      await landingPagePage.clickIncreaseCount()
      expect(landingPagePage.currentCount).toBe(3)
    })

    it('has the correct button styling', () => {
      landingPagePage.render()
      expect(landingPagePage.increaseCountButton).toHaveClass('btn', 'btn-primary')
    })
  })

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

      expect(newMatchPage.heading).toBeInTheDocument()
    })
  })
})
