import { screen } from '@testing-library/react'
import { appPage } from '../App.page'

export const sectionHeaderPage = {
  render() {
    appPage.render('/matches/new')
  },

  get recentPlayersHeader() {
    return screen.getByRole('heading', { name: 'RECENT PLAYERS', level: 2 })
  },
}
