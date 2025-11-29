import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appPage } from '../App.page'

export const quickMatchButtonPage = {
  render() {
    appPage.render('/matches/new')
  },

  get button() {
    return screen.getByRole('button', { name: 'Quick Match' })
  },

  async click() {
    await userEvent.click(quickMatchButtonPage.button)
  },
}
