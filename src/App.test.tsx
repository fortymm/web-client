import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

const appPage = {
  render() {
    render(<App />)
  },

  get increaseCountButton() {
    return screen.getByRole('button')
  },

  get currentCount() {
    const text = appPage.increaseCountButton.textContent ?? ''
    const match = text.match(/count is (\d+)/)
    return match ? parseInt(match[1], 10) : 0
  },

  async clickIncreaseCount() {
    await userEvent.click(appPage.increaseCountButton)
  },
}

describe('App', () => {
  it('renders the counter button', () => {
    appPage.render()
    expect(appPage.currentCount).toBe(0)
  })

  it('increments the count when clicked', async () => {
    appPage.render()

    await appPage.clickIncreaseCount()

    expect(appPage.currentCount).toBe(1)
  })
})
