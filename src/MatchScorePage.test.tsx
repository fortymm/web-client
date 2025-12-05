import { describe, it, expect, vi } from 'vitest'
import { matchScorePagePage } from './MatchScorePage.page'

// Mock console.log to avoid noise in tests
vi.spyOn(console, 'log').mockImplementation(() => {})

describe('MatchScorePage', () => {
  it('renders the game score form', () => {
    matchScorePagePage.render()

    expect(matchScorePagePage.gameScoreForm.heading).toBeInTheDocument()
  })

  it('displays default player names', () => {
    matchScorePagePage.render()

    expect(matchScorePagePage.gameScoreForm.getInputFor('You')).toBeInTheDocument()
    expect(matchScorePagePage.gameScoreForm.getInputFor('Opponent')).toBeInTheDocument()
  })

  it('shows game 1 in the subtitle', () => {
    matchScorePagePage.render()

    expect(matchScorePagePage.gameScoreForm.getSubtitleFor(1)).toBeInTheDocument()
  })

  it('navigates to match detail page on save', async () => {
    matchScorePagePage.render({ matchId: 'match-456' })

    await matchScorePagePage.gameScoreForm.enterScore('You', '11')
    await matchScorePagePage.gameScoreForm.enterScore('Opponent', '9')
    await matchScorePagePage.gameScoreForm.clickSave()

    expect(matchScorePagePage.matchDetailPage).toBeInTheDocument()
  })

  it('navigates to match detail page on cancel', async () => {
    matchScorePagePage.render({ matchId: 'match-789' })

    await matchScorePagePage.gameScoreForm.clickCancel()

    expect(matchScorePagePage.matchDetailPage).toBeInTheDocument()
  })
})
