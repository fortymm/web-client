import { screen } from '@testing-library/react'
import { matchScoreEntryPage } from './MatchScoreEntry/MatchScoreEntry.page'

export const matchScorePagePage = {
  get heading() {
    return screen.getByRole('heading', { name: /Enter scores/i })
  },

  get matchSummary() {
    return matchScoreEntryPage.matchSummary
  },

  getGameRow: matchScoreEntryPage.getGameRow.bind(matchScoreEntryPage),

  enterGameScore: matchScoreEntryPage.enterGameScore.bind(matchScoreEntryPage),

  get saveButton() {
    return matchScoreEntryPage.saveButton
  },

  get cancelButton() {
    return matchScoreEntryPage.cancelButton
  },
}
