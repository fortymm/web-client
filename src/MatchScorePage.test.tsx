import { describe, it, expect, vi } from 'vitest'
import { matchScorePagePage } from './MatchScorePage.page'

// Mock console.log to avoid noise in tests
vi.spyOn(console, 'log').mockImplementation(() => {})

describe('MatchScorePage', () => {
  it('renders the game score form', async () => {
    await matchScorePagePage.render()

    expect(matchScorePagePage.gameScoreForm.heading).toBeInTheDocument()
  })

  it('displays default player names', async () => {
    await matchScorePagePage.render()

    expect(matchScorePagePage.gameScoreForm.getInputFor('You')).toBeInTheDocument()
    expect(matchScorePagePage.gameScoreForm.getInputFor('Opponent')).toBeInTheDocument()
  })

  it('shows game 1 in the subtitle', async () => {
    await matchScorePagePage.render()

    // Default match length is 5, so subtitle shows "Game 1 of 5"
    expect(matchScorePagePage.gameScoreForm.getSubtitleFor(1, 5)).toBeInTheDocument()
  })

  it('navigates to match detail page on cancel', async () => {
    await matchScorePagePage.render({ matchId: 'match-789' })

    await matchScorePagePage.gameScoreForm.clickCancel()

    expect(matchScorePagePage.matchDetailPage).toBeInTheDocument()
  })

  it('shows match length in subtitle', async () => {
    await matchScorePagePage.render({ match: { matchLength: 7 } })

    expect(matchScorePagePage.gameScoreForm.getSubtitleFor(1, 7)).toBeInTheDocument()
  })

  describe('game progression', () => {
    it('advances to game 2 after saving game 1 in a Best of 5 match', async () => {
      await matchScorePagePage.render({ match: { matchLength: 5 } })

      await matchScorePagePage.saveGameAndWaitForUpdate('11', '9', 2)

      // Should now be on game 2
      expect(matchScorePagePage.gameScoreForm.getSubtitleFor(2, 5)).toBeInTheDocument()
    })

    it('shows match progress after first game', async () => {
      await matchScorePagePage.render({ match: { matchLength: 5 } })

      await matchScorePagePage.saveGameAndWaitForUpdate('11', '9', 2)

      expect(matchScorePagePage.matchProgress).toBeInTheDocument()
      expect(matchScorePagePage.getScoreBadge(1, 0)).toBeInTheDocument()
    })

    it('navigates to match detail when match is complete', async () => {
      // Best of 1 match - single game win completes the match
      await matchScorePagePage.render({ matchId: 'match-bo1', match: { matchLength: 1 } })

      await matchScorePagePage.saveGameAndWaitForMatchComplete('11', '9')

      expect(matchScorePagePage.matchDetailPage).toBeInTheDocument()
    })
  })
})
