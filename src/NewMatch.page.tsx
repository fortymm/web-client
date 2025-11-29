import userEvent from '@testing-library/user-event'
import { appPage } from './App.page'
import { newMatchHeroPage } from './NewMatch/NewMatchHero.page'
import { newMatchSearchPage } from './NewMatch/NewMatchSearch.page'
import { sectionHeaderPage } from './NewMatch/SectionHeader.page'
import { matchLengthControlPage } from './NewMatch/MatchLengthControl.page'
import { quickMatchButtonPage } from './NewMatch/QuickMatchButton.page'

export const newMatchPage = {
  render() {
    appPage.render('/matches/new')
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

  // Hero section
  get heroHeading() {
    return newMatchHeroPage.heading
  },

  get heroDescription() {
    return newMatchHeroPage.description
  },

  // Search section
  get searchPlaceholder() {
    return newMatchSearchPage.placeholder
  },

  // Section header
  get recentPlayersHeader() {
    return sectionHeaderPage.recentPlayersHeader
  },

  // Bottom panel
  get matchLengthControl() {
    return matchLengthControlPage.control
  },

  get quickMatchButton() {
    return quickMatchButtonPage.button
  },
}
