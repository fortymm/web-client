import { screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import { appPage } from './App.page'
import { matchListPage } from './MatchList.page'
import { inProgressMatchModalPage } from './InProgressMatchModal.page'

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

  get emptyState() {
    return screen.queryByText(/no matches yet/i)
  },

  get loadingSpinner() {
    return document.querySelector('.loading-spinner')
  },

  async waitForLoaded() {
    await waitFor(() => {
      expect(landingPagePage.loadingSpinner).not.toBeInTheDocument()
    })
  },

  // Delegate to MatchList page object
  matchList: matchListPage,

  // Delegate to InProgressMatchModal page object
  inProgressMatchModal: inProgressMatchModalPage,
}
