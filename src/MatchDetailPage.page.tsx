import { within } from '@testing-library/react'
import { appPage } from './App.page'

export const matchDetailPagePage = {
  render(matchId: string) {
    appPage.render(`/matches/${matchId}`)
  },

  get heading() {
    return within(appPage.main).getByRole('heading', { level: 1 })
  },

  get headingText() {
    return matchDetailPagePage.heading.textContent
  },
}
