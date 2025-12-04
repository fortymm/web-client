import { describe, it, expect } from 'vitest'
import { matchScoreFormPage } from './MatchScoreForm.page'

describe('MatchScoreForm', () => {
  it('renders all game rows for match length', () => {
    matchScoreFormPage.render({ matchLength: 5 })
    expect(matchScoreFormPage.gameRows).toHaveLength(5)
  })

  it('renders 3 game rows for best of 3', () => {
    matchScoreFormPage.render({
      matchLength: 3,
      games: [
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
    })
    expect(matchScoreFormPage.gameRows).toHaveLength(3)
  })

  it('displays match score in header', () => {
    matchScoreFormPage.render({
      games: [
        { player: 11, opponent: 7 },
        { player: 11, opponent: 9 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
    })
    expect(matchScoreFormPage.getPlayerMatchWins()).toBe(2)
    expect(matchScoreFormPage.getOpponentMatchWins()).toBe(0)
  })

  it('calls onGameScoreChange when incrementing player score', async () => {
    const { onGameScoreChange } = matchScoreFormPage.render()
    await matchScoreFormPage.incrementPlayerScore(1)
    expect(onGameScoreChange).toHaveBeenCalledWith(0, 'player', 1)
  })

  it('calls onGameScoreChange when decrementing player score', async () => {
    const { onGameScoreChange } = matchScoreFormPage.render({
      games: [
        { player: 5, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
    })
    await matchScoreFormPage.decrementPlayerScore(1)
    expect(onGameScoreChange).toHaveBeenCalledWith(0, 'player', -1)
  })

  it('calls onGameScoreChange when incrementing opponent score', async () => {
    const { onGameScoreChange } = matchScoreFormPage.render()
    await matchScoreFormPage.incrementOpponentScore(1)
    expect(onGameScoreChange).toHaveBeenCalledWith(0, 'opponent', 1)
  })

  it('shows match complete message when player wins', () => {
    matchScoreFormPage.render({
      playerName: 'Alice',
      games: [
        { player: 11, opponent: 7 },
        { player: 11, opponent: 9 },
        { player: 11, opponent: 5 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
    })
    expect(matchScoreFormPage.matchCompleteMessage).toHaveTextContent('Alice wins!')
  })

  it('shows match complete message when opponent wins', () => {
    matchScoreFormPage.render({
      opponentName: 'Bob',
      games: [
        { player: 7, opponent: 11 },
        { player: 9, opponent: 11 },
        { player: 5, opponent: 11 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
    })
    expect(matchScoreFormPage.matchCompleteMessage).toHaveTextContent('Bob wins!')
  })

  it('marks completed games with checkmark indicator', () => {
    matchScoreFormPage.render({
      games: [
        { player: 11, opponent: 7 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
    })
    const row = matchScoreFormPage.getGameRow(1)
    expect(row.querySelector('[aria-label="Game complete"]')).toBeInTheDocument()
  })

  it('marks active game with indicator', () => {
    matchScoreFormPage.render({
      games: [
        { player: 11, opponent: 7 },
        { player: 5, opponent: 3 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
    })
    const row = matchScoreFormPage.getGameRow(2)
    expect(row.querySelector('[aria-label="Current game"]')).toBeInTheDocument()
  })

  it('handles deuce scenario - game not complete at 10-10', () => {
    matchScoreFormPage.render({
      games: [
        { player: 10, opponent: 10 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
    })
    // Game 1 should still be active since 10-10 is not complete
    const row = matchScoreFormPage.getGameRow(1)
    expect(row.querySelector('[aria-label="Current game"]')).toBeInTheDocument()
    expect(row.querySelector('[aria-label="Game complete"]')).not.toBeInTheDocument()
  })

  it('completes game at 12-10 in deuce', () => {
    matchScoreFormPage.render({
      games: [
        { player: 12, opponent: 10 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
        { player: 0, opponent: 0 },
      ],
    })
    expect(matchScoreFormPage.getPlayerMatchWins()).toBe(1)
  })

  it('has accessible game list', () => {
    matchScoreFormPage.render()
    expect(matchScoreFormPage.gameList).toHaveAccessibleName('Game scores')
  })
})
