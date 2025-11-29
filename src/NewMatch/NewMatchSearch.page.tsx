import { screen } from '@testing-library/react'
import { appPage } from '../App.page'

export const newMatchSearchPage = {
  render() {
    appPage.render('/matches/new')
  },

  get container() {
    return screen.getByText('Search players…').closest('div')
  },

  get placeholder() {
    return screen.getByText('Search players…')
  },
}
