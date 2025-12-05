import { describe, it, expect, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { matchScoreEntryPage } from './MatchScoreEntry.page'

describe('MatchScoreEntry', () => {
  describe('rendering', () => {
    it('displays the title "Enter scores"', () => {
      matchScoreEntryPage.render()
      expect(matchScoreEntryPage.title).toBeInTheDocument()
    })

    it('displays player names in subtitle', () => {
      matchScoreEntryPage.render({
        config: {
          playerYou: { id: '1', name: 'Alice', isCurrentUser: true },
          playerOpponent: { id: '2', name: 'Bob' },
        },
      })
      expect(matchScoreEntryPage.subtitle).toHaveTextContent('Alice vs Bob')
    })

    it('displays match configuration info', () => {
      matchScoreEntryPage.render({
        config: { bestOf: 5, pointsToWin: 11, winBy: 2 },
      })
      expect(matchScoreEntryPage.metaInfo).toHaveTextContent('Best of 5')
      expect(matchScoreEntryPage.metaInfo).toHaveTextContent('To 11')
      expect(matchScoreEntryPage.metaInfo).toHaveTextContent('Win by 2')
    })

    it('shows all potential games for Bo5', () => {
      matchScoreEntryPage.render({ config: { bestOf: 5 } })
      expect(matchScoreEntryPage.gameRows).toHaveLength(5)
    })

    it('shows all potential games for Bo3', () => {
      matchScoreEntryPage.render({ config: { bestOf: 3 } })
      expect(matchScoreEntryPage.gameRows).toHaveLength(3)
    })

    it('shows all potential games for Bo7', () => {
      matchScoreEntryPage.render({ config: { bestOf: 7 } })
      expect(matchScoreEntryPage.gameRows).toHaveLength(7)
    })

    it('displays save button', () => {
      matchScoreEntryPage.render()
      expect(matchScoreEntryPage.saveButton).toBeInTheDocument()
      expect(matchScoreEntryPage.saveButton).toHaveTextContent('Save match')
    })

    it('displays cancel button when onCancel is provided', () => {
      matchScoreEntryPage.render({ onCancel: vi.fn() })
      expect(matchScoreEntryPage.cancelButton).toBeInTheDocument()
    })

    it('does not display cancel button when onCancel is not provided', () => {
      matchScoreEntryPage.render()
      expect(matchScoreEntryPage.cancelButton).not.toBeInTheDocument()
    })
  })

  describe('match summary updates', () => {
    it('shows initial match score as 0-0', () => {
      matchScoreEntryPage.render()
      expect(matchScoreEntryPage.matchSummaryText).toContain('0–0')
    })

    it('updates match summary when valid game is entered', async () => {
      matchScoreEntryPage.render()

      await matchScoreEntryPage.enterGameScore(1, '11', '7')

      await waitFor(() => {
        expect(matchScoreEntryPage.matchSummaryText).toContain('1–0')
      })
    })

    it('shows match complete when winner determined', async () => {
      matchScoreEntryPage.render({ config: { bestOf: 3 } })

      await matchScoreEntryPage.enterGameScore(1, '11', '7')
      await matchScoreEntryPage.enterGameScore(2, '11', '9')

      await waitFor(() => {
        expect(matchScoreEntryPage.matchSummaryText).toContain('Match complete')
        expect(matchScoreEntryPage.matchSummaryText).toContain('2–0')
      })
    })
  })

  describe('per-game validation', () => {
    it('shows winner when score is valid (11-7)', async () => {
      matchScoreEntryPage.render()

      await matchScoreEntryPage.enterGameScore(1, '11', '7')

      const row = matchScoreEntryPage.getGameRow(1)
      await waitFor(() => {
        expect(row.statusText).toHaveTextContent(/winner/i)
      })
    })

    it('accepts extended games (14-12)', async () => {
      matchScoreEntryPage.render()

      await matchScoreEntryPage.enterGameScore(1, '14', '12')

      const row = matchScoreEntryPage.getGameRow(1)
      await waitFor(() => {
        expect(row.statusText).toHaveTextContent(/winner/i)
      })
    })

    it('shows error for tie (10-10)', async () => {
      matchScoreEntryPage.render()

      await matchScoreEntryPage.enterGameScore(1, '10', '10')

      const row = matchScoreEntryPage.getGameRow(1)
      await waitFor(() => {
        expect(row.statusText).toHaveTextContent('Game cannot end in a tie.')
      })
    })

    it('shows error when winner has less than pointsToWin (10-7)', async () => {
      matchScoreEntryPage.render({ config: { pointsToWin: 11 } })

      await matchScoreEntryPage.enterGameScore(1, '10', '7')

      const row = matchScoreEntryPage.getGameRow(1)
      await waitFor(() => {
        expect(row.statusText).toHaveTextContent(
          'Winner must have at least 11 points.'
        )
      })
    })

    it('shows error when win margin is less than winBy (11-10)', async () => {
      matchScoreEntryPage.render({ config: { winBy: 2 } })

      await matchScoreEntryPage.enterGameScore(1, '11', '10')

      const row = matchScoreEntryPage.getGameRow(1)
      await waitFor(() => {
        expect(row.statusText).toHaveTextContent(
          'Winner must lead by at least 2 points.'
        )
      })
    })
  })

  describe('save behavior', () => {
    it('prevents saving with invalid games and shows inline error', async () => {
      matchScoreEntryPage.render()

      // Enter a tie score which is invalid
      await matchScoreEntryPage.enterGameScore(1, '10', '10')

      // Verify validation error shows on the row
      const row = matchScoreEntryPage.getGameRow(1)
      await waitFor(() => {
        expect(row.statusText).toHaveTextContent('Game cannot end in a tie.')
      })
    })

    it('shows error when trying to save with no valid games', async () => {
      matchScoreEntryPage.render()

      await matchScoreEntryPage.clickSave()

      await waitFor(() => {
        expect(matchScoreEntryPage.errorAlert).toBeInTheDocument()
        expect(matchScoreEntryPage.errorAlert).toHaveTextContent(
          /enter at least one valid game/i
        )
      })
    })

    it('shows error when match is not complete', async () => {
      matchScoreEntryPage.render({ config: { bestOf: 5 } })

      await matchScoreEntryPage.enterGameScore(1, '11', '7')
      await matchScoreEntryPage.enterGameScore(2, '11', '9')
      await matchScoreEntryPage.clickSave()

      await waitFor(() => {
        expect(matchScoreEntryPage.errorAlert).toBeInTheDocument()
        expect(matchScoreEntryPage.errorAlert).toHaveTextContent(
          /not complete/i
        )
      })
    })

    it('calls onSave when match is complete and valid', async () => {
      const { onSave } = matchScoreEntryPage.render({ config: { bestOf: 3 } })

      await matchScoreEntryPage.enterGameScore(1, '11', '7')
      await matchScoreEntryPage.enterGameScore(2, '11', '9')
      await matchScoreEntryPage.clickSave()

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledTimes(1)
      })
    })

    it('allows saving incomplete match when allowIncompleteSave is true', async () => {
      const { onSave } = matchScoreEntryPage.render({
        config: { bestOf: 5 },
        allowIncompleteSave: true,
      })

      await matchScoreEntryPage.enterGameScore(1, '11', '7')
      await matchScoreEntryPage.clickSave()

      await waitFor(() => {
        expect(onSave).toHaveBeenCalled()
      })
    })

    it('shows loading state while saving', async () => {
      const onSave = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )
      matchScoreEntryPage.render({
        config: { bestOf: 3 },
        onSave,
      })

      await matchScoreEntryPage.enterGameScore(1, '11', '7')
      await matchScoreEntryPage.enterGameScore(2, '11', '9')
      await matchScoreEntryPage.clickSave()

      expect(matchScoreEntryPage.saveButton).toHaveTextContent('Saving')
    })
  })

  describe('editing existing scores', () => {
    it('pre-fills scores from initialScores', () => {
      matchScoreEntryPage.render({
        initialScores: [
          { gameIndex: 0, youScore: 11, opponentScore: 7 },
          { gameIndex: 1, youScore: 9, opponentScore: 11 },
          { gameIndex: 2, youScore: null, opponentScore: null },
        ],
        config: { bestOf: 3 },
      })

      const row1 = matchScoreEntryPage.getGameRow(1)
      expect(row1.youInput).toHaveValue(11)
      expect(row1.opponentInput).toHaveValue(7)

      const row2 = matchScoreEntryPage.getGameRow(2)
      expect(row2.youInput).toHaveValue(9)
      expect(row2.opponentInput).toHaveValue(11)

      const row3 = matchScoreEntryPage.getGameRow(3)
      expect(row3.youInput).toHaveValue(null)
      expect(row3.opponentInput).toHaveValue(null)
    })

    it('computes winners correctly from initial scores', () => {
      matchScoreEntryPage.render({
        initialScores: [
          { gameIndex: 0, youScore: 11, opponentScore: 7 },
          { gameIndex: 1, youScore: 9, opponentScore: 11 },
          { gameIndex: 2, youScore: null, opponentScore: null },
        ],
        config: { bestOf: 3 },
      })

      const row1 = matchScoreEntryPage.getGameRow(1)
      expect(row1.statusText).toHaveTextContent(/winner/i)

      expect(matchScoreEntryPage.matchSummaryText).toContain('1–1')
    })

    it('allows editing pre-filled scores', async () => {
      matchScoreEntryPage.render({
        initialScores: [
          { gameIndex: 0, youScore: 11, opponentScore: 7 },
          { gameIndex: 1, youScore: null, opponentScore: null },
          { gameIndex: 2, youScore: null, opponentScore: null },
        ],
        config: { bestOf: 3 },
      })

      await matchScoreEntryPage.enterGameScore(1, '12', '10')

      const row1 = matchScoreEntryPage.getGameRow(1)
      expect(row1.youInput).toHaveValue(12)
      expect(row1.opponentInput).toHaveValue(10)
    })
  })

  describe('cancel behavior', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const onCancel = vi.fn()
      matchScoreEntryPage.render({ onCancel })

      await matchScoreEntryPage.clickCancel()

      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('early completion', () => {
    it('detects 3-0 win in Bo5', async () => {
      const { onSave } = matchScoreEntryPage.render({ config: { bestOf: 5 } })

      await matchScoreEntryPage.enterGameScore(1, '11', '7')
      await matchScoreEntryPage.enterGameScore(2, '11', '5')
      await matchScoreEntryPage.enterGameScore(3, '11', '9')
      await matchScoreEntryPage.clickSave()

      await waitFor(() => {
        expect(matchScoreEntryPage.matchSummaryText).toContain('Match complete')
        expect(matchScoreEntryPage.matchSummaryText).toContain('3–0')
      })
      expect(onSave).toHaveBeenCalled()
    })

    it('detects 3-2 win in Bo5', async () => {
      const { onSave } = matchScoreEntryPage.render({ config: { bestOf: 5 } })

      await matchScoreEntryPage.enterGameScore(1, '11', '7')
      await matchScoreEntryPage.enterGameScore(2, '7', '11')
      await matchScoreEntryPage.enterGameScore(3, '5', '11')
      await matchScoreEntryPage.enterGameScore(4, '11', '9')
      await matchScoreEntryPage.enterGameScore(5, '11', '8')
      await matchScoreEntryPage.clickSave()

      await waitFor(() => {
        expect(matchScoreEntryPage.matchSummaryText).toContain('Match complete')
        expect(matchScoreEntryPage.matchSummaryText).toContain('3–2')
      })
      expect(onSave).toHaveBeenCalled()
    })
  })
})
