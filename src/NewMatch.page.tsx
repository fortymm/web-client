import userEvent from '@testing-library/user-event'
import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { expect } from 'vitest'
import { appPage } from './App.page'
import { newMatchHeroPage } from './NewMatch/NewMatchHero.page'
import { newMatchSearchPage } from './NewMatch/NewMatchSearch.page'
import { sectionHeaderPage } from './NewMatch/SectionHeader.page'
import { matchLengthControlPage } from './NewMatch/MatchLengthControl.page'
import { quickMatchButtonPage } from './NewMatch/QuickMatchButton.page'
import { playerListPage } from './NewMatch/PlayerList.page'
import { skeletonRowsPage } from './NewMatch/SkeletonRows.page'
import { recentsErrorCardPage } from './NewMatch/RecentsErrorCard.page'

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

  // Player list
  get playerList() {
    return playerListPage.list
  },

  get playerRows() {
    return playerListPage.playerRows
  },

  getPlayerRowByIndex(index: number) {
    return playerListPage.playerRows[index]
  },

  async clickPlayerByIndex(index: number) {
    const user = userEvent.setup()
    const row = playerListPage.playerRows[index]
    await user.click(row)
  },

  // Bottom panel - Match length control
  get matchLengthLabel() {
    return matchLengthControlPage.label
  },

  get matchLengthGroup() {
    return matchLengthControlPage.group
  },

  get matchLengthRadios() {
    return matchLengthControlPage.allRadios
  },

  getMatchLengthRadio(length: 1 | 3 | 5 | 7) {
    return matchLengthControlPage.getRadio(length)
  },

  async selectMatchLength(length: 1 | 3 | 5 | 7) {
    await matchLengthControlPage.selectLength(length)
  },

  // Quick match button
  get quickMatchButton() {
    return quickMatchButtonPage.button
  },

  async clickQuickMatch() {
    await quickMatchButtonPage.click()
  },

  // Loading states
  get skeletonContainer() {
    return skeletonRowsPage.queryContainer()
  },

  get isShowingSkeleton() {
    return this.skeletonContainer !== null
  },

  skeletonRows: skeletonRowsPage,

  async waitForPlayersToLoad() {
    const skeleton = skeletonRowsPage.queryContainer()
    if (skeleton) {
      await waitForElementToBeRemoved(skeleton)
    }
  },

  // Score page detection (after navigation)
  getScorePageHeading() {
    return screen.queryByRole('heading', { name: /score/i })
  },

  // Error card delegation
  get errorCard() {
    return recentsErrorCardPage
  },

  queryErrorCardHeading() {
    return screen.queryByRole('heading', { level: 3 })
  },

  get hasErrorCard() {
    return this.queryErrorCardHeading() !== null
  },

  async waitForErrorCard() {
    await waitFor(() => {
      expect(this.queryErrorCardHeading()).toBeInTheDocument()
    })
  },

  async clickRetry() {
    await recentsErrorCardPage.clickRetry()
  },
}
