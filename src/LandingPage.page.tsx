import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appPage } from './App.page'

export const landingPagePage = {
  render() {
    appPage.render('/')
  },

  get newMatchButton() {
    return within(appPage.main).getByRole('button', { name: /new match/i })
  },

  async clickNewMatchButton() {
    await userEvent.click(landingPagePage.newMatchButton)
  },
}
