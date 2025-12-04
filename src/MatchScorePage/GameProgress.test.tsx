import { describe, it, expect } from 'vitest'
import { gameProgressPage } from './GameProgress.page'

describe('GameProgress', () => {
  it('renders nothing for game 1 with no completed games', () => {
    gameProgressPage.render({ completedGames: [], currentGame: 1 })
    expect(gameProgressPage.gameHistory).not.toBeInTheDocument()
  })

  it('shows current game chip when games are in progress', () => {
    gameProgressPage.render({
      completedGames: [{ player: 11, opponent: 7 }],
      currentGame: 2,
    })
    expect(gameProgressPage.currentGameChip).toBeInTheDocument()
  })

  it('hides current game chip when match is complete', () => {
    gameProgressPage.render({
      completedGames: [
        { player: 11, opponent: 7 },
        { player: 11, opponent: 9 },
        { player: 11, opponent: 5 },
      ],
      currentGame: 4,
      isMatchComplete: true,
    })
    expect(gameProgressPage.currentGameChip).not.toBeInTheDocument()
  })

  it('displays completed game scores', () => {
    gameProgressPage.render({
      completedGames: [
        { player: 11, opponent: 7 },
        { player: 9, opponent: 11 },
      ],
      currentGame: 3,
    })

    expect(gameProgressPage.getGameChipScore(1)).toContain('11–7')
    expect(gameProgressPage.getGameChipScore(2)).toContain('9–11')
  })

  it('shows player-won games in success color', () => {
    gameProgressPage.render({
      completedGames: [
        { player: 11, opponent: 7 },
        { player: 11, opponent: 9 },
      ],
      currentGame: 3,
    })

    expect(gameProgressPage.getPlayerWonGames()).toHaveLength(2)
  })

  it('shows opponent-won games in error color', () => {
    gameProgressPage.render({
      completedGames: [
        { player: 7, opponent: 11 },
        { player: 9, opponent: 11 },
      ],
      currentGame: 3,
    })

    expect(gameProgressPage.getOpponentWonGames()).toHaveLength(2)
  })

  it('has accessible game history list', () => {
    gameProgressPage.render({
      completedGames: [{ player: 11, opponent: 7 }],
      currentGame: 2,
    })

    expect(gameProgressPage.gameHistory).toHaveAccessibleName('Game history')
  })
})
