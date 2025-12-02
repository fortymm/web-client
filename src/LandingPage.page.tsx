import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appPage } from './App.page'

export const landingPagePage = {
  render() {
    appPage.render('/')
  },

  get newMatchLink() {
    return within(appPage.main).getByRole('link', { name: 'New Match' })
  },

  async clickNewMatchLink() {
    await userEvent.click(landingPagePage.newMatchLink)
  },
}
