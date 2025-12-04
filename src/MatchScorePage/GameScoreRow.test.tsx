import { describe, it, expect } from 'vitest'
import { gameScoreRowPage } from './GameScoreRow.page'

describe('GameScoreRow', () => {
  it('displays game number', () => {
    gameScoreRowPage.render({ gameNumber: 3 })
    expect(gameScoreRowPage.gameLabel).toHaveTextContent('G3')
  })

  it('displays player and opponent scores', () => {
    gameScoreRowPage.render({ playerScore: 11, opponentScore: 7 })
    const scores = gameScoreRowPage.getScores()
    expect(scores.player).toBe(11)
    expect(scores.opponent).toBe(7)
  })

  it('calls onPlayerScoreChange with +1 when increment clicked', async () => {
    const { onPlayerScoreChange } = gameScoreRowPage.render()
    await gameScoreRowPage.incrementPlayerScore()
    expect(onPlayerScoreChange).toHaveBeenCalledWith(1)
  })

  it('calls onPlayerScoreChange with -1 when decrement clicked', async () => {
    const { onPlayerScoreChange } = gameScoreRowPage.render({ playerScore: 5 })
    await gameScoreRowPage.decrementPlayerScore()
    expect(onPlayerScoreChange).toHaveBeenCalledWith(-1)
  })

  it('calls onOpponentScoreChange with +1 when increment clicked', async () => {
    const { onOpponentScoreChange } = gameScoreRowPage.render()
    await gameScoreRowPage.incrementOpponentScore()
    expect(onOpponentScoreChange).toHaveBeenCalledWith(1)
  })

  it('calls onOpponentScoreChange with -1 when decrement clicked', async () => {
    const { onOpponentScoreChange } = gameScoreRowPage.render({ opponentScore: 5 })
    await gameScoreRowPage.decrementOpponentScore()
    expect(onOpponentScoreChange).toHaveBeenCalledWith(-1)
  })

  it('disables decrement button when score is 0', () => {
    gameScoreRowPage.render({ playerScore: 0, opponentScore: 0 })
    expect(gameScoreRowPage.playerDecrementButton).toBeDisabled()
    expect(gameScoreRowPage.opponentDecrementButton).toBeDisabled()
  })

  it('enables decrement button when score is greater than 0', () => {
    gameScoreRowPage.render({ playerScore: 5, opponentScore: 3 })
    expect(gameScoreRowPage.playerDecrementButton).not.toBeDisabled()
    expect(gameScoreRowPage.opponentDecrementButton).not.toBeDisabled()
  })

  it('shows complete indicator when game is complete', () => {
    gameScoreRowPage.render({ isComplete: true, playerScore: 11, opponentScore: 7 })
    expect(gameScoreRowPage.completeIndicator).toBeInTheDocument()
  })

  it('shows active indicator when game is active', () => {
    gameScoreRowPage.render({ isActive: true })
    expect(gameScoreRowPage.activeIndicator).toBeInTheDocument()
  })

  it('does not show active indicator when game is complete', () => {
    gameScoreRowPage.render({ isActive: true, isComplete: true })
    expect(gameScoreRowPage.activeIndicator).not.toBeInTheDocument()
  })

  it('disables all buttons when isDisabled is true', () => {
    gameScoreRowPage.render({ isDisabled: true })
    expect(gameScoreRowPage.playerIncrementButton).toBeDisabled()
    expect(gameScoreRowPage.opponentIncrementButton).toBeDisabled()
  })

  it('has accessible group label', () => {
    gameScoreRowPage.render({ gameNumber: 2 })
    expect(gameScoreRowPage.row).toHaveAccessibleName('Game 2')
  })
})
