import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appPage } from './App.page'

export const newMatchPage = {
  render() {
    appPage.render('/matches/new')
  },

  // Hero section
  get heading() {
    return screen.getByRole('heading', { name: 'New match', level: 1 })
  },

  get heroDescription() {
    return screen.getByText(
      'Select a player, search, or start a Quick Match and assign a player later.'
    )
  },

  // Search section
  get searchContainer() {
    return screen.getByText('Search players…').closest('div')
  },

  get searchPlaceholder() {
    return screen.getByText('Search players…')
  },

  // Section header
  get recentPlayersHeader() {
    return screen.getByRole('heading', { name: 'RECENT PLAYERS', level: 2 })
  },

  get contentAreaPlaceholder() {
    return screen.getByText('Content area')
  },

  // Bottom panel
  get matchLengthControl() {
    return screen.getByText('Match length control placeholder')
  },

  get quickMatchButton() {
    return screen.getByRole('button', { name: 'Quick Match' })
  },

  async clickQuickMatch() {
    await userEvent.click(newMatchPage.quickMatchButton)
  },

  // Navigation
  get navbar() {
    return appPage.navbar
  },

  get brandLink() {
    return appPage.brandLink
  },

  async clickBrandLink() {
    await userEvent.click(newMatchPage.brandLink)
  },
}
