import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { matchScorePagePage } from './MatchScorePage.page'
import { createMockMatch, createMockGame } from './MatchScorePage/useMatch.page'
import { resetDb } from './lib/matchesDb'

describe('MatchScorePage', () => {
  beforeEach(async () => {
    await resetDb()
  })

  afterEach(async () => {
    await resetDb()
  })

  it('renders the game score form', async () => {
    await matchScorePagePage.render()
    await matchScorePagePage.waitForLoaded()

    expect(matchScorePagePage.gameScoreForm.heading).toBeInTheDocument()
  })

  it('displays default player names', async () => {
    await matchScorePagePage.render()
    await matchScorePagePage.waitForLoaded()

    expect(matchScorePagePage.gameScoreForm.getInputFor('You')).toBeInTheDocument()
    expect(matchScorePagePage.gameScoreForm.getInputFor('Opponent')).toBeInTheDocument()
  })

  it('shows game 1 in the subtitle for new match', async () => {
    await matchScorePagePage.render()
    await matchScorePagePage.waitForLoaded()

    expect(matchScorePagePage.gameScoreForm.getSubtitleFor(1)).toBeInTheDocument()
  })

  it('navigates to match detail page on cancel', async () => {
    await matchScorePagePage.render({ matchId: 'match-789' })
    await matchScorePagePage.waitForLoaded()

    await matchScorePagePage.gameScoreForm.clickCancel()

    expect(matchScorePagePage.matchDetailPage).toBeInTheDocument()
  })

  describe('best of 1 match', () => {
    it('navigates to match detail page after single game win', async () => {
      const match = createMockMatch({
        id: 'match-bo1',
        matchLength: 1,
      })
      await matchScorePagePage.render({ matchId: 'match-bo1', match })
      await matchScorePagePage.waitForLoaded()

      await matchScorePagePage.gameScoreForm.enterScore('You', '11')
      await matchScorePagePage.gameScoreForm.enterScore('Opponent', '9')
      await matchScorePagePage.gameScoreForm.clickSave()

      await matchScorePagePage.waitForMatchDetailPage()
      expect(matchScorePagePage.matchDetailPage).toBeInTheDocument()
    })
  })

  describe('best of 3 match', () => {
    it('stays on scoring page after first game', async () => {
      const match = createMockMatch({
        id: 'match-bo3',
        matchLength: 3,
      })
      await matchScorePagePage.render({ matchId: 'match-bo3', match })
      await matchScorePagePage.waitForLoaded()

      await matchScorePagePage.gameScoreForm.enterScore('You', '11')
      await matchScorePagePage.gameScoreForm.enterScore('Opponent', '9')
      await matchScorePagePage.gameScoreForm.clickSave()

      // Should still be on scoring page, now showing game 2
      await matchScorePagePage.waitForLoaded()
      expect(matchScorePagePage.gameScoreForm.getSubtitleFor(2)).toBeInTheDocument()
    })

    it('navigates to match detail page after winning 2 games', async () => {
      const match = createMockMatch({
        id: 'match-bo3-complete',
        matchLength: 3,
        games: [createMockGame({ winnerId: 'player-1' })],
      })
      await matchScorePagePage.render({ matchId: 'match-bo3-complete', match })
      await matchScorePagePage.waitForLoaded()

      // Should start at game 2
      expect(matchScorePagePage.gameScoreForm.getSubtitleFor(2)).toBeInTheDocument()

      // Win game 2
      await matchScorePagePage.gameScoreForm.enterScore('You', '11')
      await matchScorePagePage.gameScoreForm.enterScore('Opponent', '9')
      await matchScorePagePage.gameScoreForm.clickSave()

      await matchScorePagePage.waitForMatchDetailPage()
      expect(matchScorePagePage.matchDetailPage).toBeInTheDocument()
    })
  })

  describe('best of 5 match', () => {
    it('shows correct game number based on games already played', async () => {
      const match = createMockMatch({
        id: 'match-bo5-game3',
        matchLength: 5,
        games: [
          createMockGame({ winnerId: 'player-1' }),
          createMockGame({ winnerId: 'player-2' }),
        ],
      })
      await matchScorePagePage.render({ matchId: 'match-bo5-game3', match })
      await matchScorePagePage.waitForLoaded()

      expect(matchScorePagePage.gameScoreForm.getSubtitleFor(3)).toBeInTheDocument()
    })

    it('navigates to match detail page after winning 3 games', async () => {
      const match = createMockMatch({
        id: 'match-bo5-complete',
        matchLength: 5,
        games: [
          createMockGame({ winnerId: 'player-1' }),
          createMockGame({ winnerId: 'player-2' }),
          createMockGame({ winnerId: 'player-1' }),
        ],
      })
      await matchScorePagePage.render({ matchId: 'match-bo5-complete', match })
      await matchScorePagePage.waitForLoaded()

      // Should start at game 4 (score is 2-1)
      expect(matchScorePagePage.gameScoreForm.getSubtitleFor(4)).toBeInTheDocument()

      // Win game 4 to complete match (3-1)
      await matchScorePagePage.gameScoreForm.enterScore('You', '11')
      await matchScorePagePage.gameScoreForm.enterScore('Opponent', '9')
      await matchScorePagePage.gameScoreForm.clickSave()

      await matchScorePagePage.waitForMatchDetailPage()
      expect(matchScorePagePage.matchDetailPage).toBeInTheDocument()
    })
  })
})
