import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appPage } from './App.page'

export const landingPagePage = {
  render() {
    appPage.render('/')
  },

  get increaseCountButton() {
    return within(appPage.main).getByRole('button', { name: /count is \d+/ })
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
