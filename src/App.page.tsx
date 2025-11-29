import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

export const appPage = {
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
