import { describe, it, expect } from 'vitest'
import { landingPagePage } from './LandingPage.page'

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
})
