import { screen } from '@testing-library/react'
import { appPage } from '../App.page'

export const newMatchHeroPage = {
  render() {
    appPage.render('/matches/new')
  },

  get heading() {
    return screen.getByRole('heading', { name: 'New match', level: 1 })
  },

  get description() {
    return screen.getByText(
      'Select a player, search, or start a Quick Match and assign a player later.'
    )
  },
}
