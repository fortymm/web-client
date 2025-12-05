import { screen, within, waitFor } from '@testing-library/react'
import { appPage } from './App.page'

export const matchDetailPagePage = {
  render(matchId: string, searchParams?: string) {
    const url = `/matches/${matchId}${searchParams ? `?${searchParams}` : ''}`
    appPage.render(url)
  },

  async waitForContent() {
    await waitFor(() => {
      if (screen.queryByTestId('match-detail-skeleton')) {
        throw new Error('Still loading')
      }
    })
  },

  get heading() {
    return within(appPage.main).getByRole('heading', { level: 1 })
  },

  get headingText() {
    return matchDetailPagePage.heading.textContent
  },

  queryPage() {
    return screen.queryByTestId('match-detail-page')
  },

  querySkeleton() {
    return screen.queryByTestId('match-detail-skeleton')
  },
}
