import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appPage } from './App.page'

export const landingPagePage = {
  render() {
    appPage.render('/')
  },

  get main() {
    return screen.getByRole('main')
  },

  get increaseCountButton() {
    return within(landingPagePage.main).getByRole('button', { name: /count is \d+/ })
  },

  get currentCount() {
    const text = landingPagePage.increaseCountButton.textContent ?? ''
    const match = text.match(/count is (\d+)/)
    return match ? parseInt(match[1], 10) : 0
  },

  async clickIncreaseCount() {
    await userEvent.click(landingPagePage.increaseCountButton)
  },
}
