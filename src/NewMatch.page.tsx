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

  // Child component page objects for layout verification
  hero: newMatchHeroPage,
  search: newMatchSearchPage,
  sectionHeader: sectionHeaderPage,
  matchLengthControl: matchLengthControlPage,
  quickMatchButton: quickMatchButtonPage,
}
