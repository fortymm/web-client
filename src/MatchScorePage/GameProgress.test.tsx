import { describe, it, expect } from 'vitest'
import { gameProgressPage } from './GameProgress.page'

describe('GameProgress', () => {
  it('displays game counter', () => {
    gameProgressPage.render({ currentGame: 2, matchLength: 5 })
    expect(gameProgressPage.gameCounter).toHaveTextContent('Game 2 of 5')
  })

  it('shows correct number of dots for best of 5', () => {
    gameProgressPage.render({ matchLength: 5 })

    // Best of 5 = need 3 to win, so 3 dots each side
    const playerContainer = gameProgressPage.playerGamesIndicator
    const opponentContainer = gameProgressPage.opponentGamesIndicator

    expect(playerContainer.querySelectorAll('span')).toHaveLength(3)
    expect(opponentContainer.querySelectorAll('span')).toHaveLength(3)
  })

  it('shows correct number of dots for best of 7', () => {
    gameProgressPage.render({ matchLength: 7 })

    // Best of 7 = need 4 to win, so 4 dots each side
    const playerContainer = gameProgressPage.playerGamesIndicator
    expect(playerContainer.querySelectorAll('span')).toHaveLength(4)
  })

  it('fills player dots based on games won', () => {
    gameProgressPage.render({ gamesWon: { player: 2, opponent: 0 }, matchLength: 5 })
    expect(gameProgressPage.getPlayerFilledDots()).toHaveLength(2)
  })

  it('fills opponent dots based on games won', () => {
    gameProgressPage.render({ gamesWon: { player: 1, opponent: 2 }, matchLength: 5 })
    expect(gameProgressPage.getOpponentFilledDots()).toHaveLength(2)
  })

  it('has accessible labels for screen readers', () => {
    gameProgressPage.render({ gamesWon: { player: 1, opponent: 2 } })
    expect(gameProgressPage.playerGamesIndicator).toHaveAccessibleName('You: 1 games')
    expect(gameProgressPage.opponentGamesIndicator).toHaveAccessibleName('Opponent: 2 games')
  })
})
