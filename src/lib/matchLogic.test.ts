import { describe, it, expect } from 'vitest'
import {
  gamesNeededToWin,
  countWins,
  isMatchComplete,
  getMatchWinner,
  getCurrentGameNumber,
  type GameScore,
} from './matchLogic'

describe('gamesNeededToWin', () => {
  it('returns 1 for best of 1', () => {
    expect(gamesNeededToWin(1)).toBe(1)
  })

  it('returns 2 for best of 3', () => {
    expect(gamesNeededToWin(3)).toBe(2)
  })

  it('returns 3 for best of 5', () => {
    expect(gamesNeededToWin(5)).toBe(3)
  })

  it('returns 4 for best of 7', () => {
    expect(gamesNeededToWin(7)).toBe(4)
  })
})

describe('countWins', () => {
  const player1Id = 'player-1'
  const player2Id = 'player-2'

  it('returns 0-0 for no games', () => {
    const result = countWins([], player1Id, player2Id)
    expect(result).toEqual({ player1Wins: 0, player2Wins: 0 })
  })

  it('counts player 1 wins', () => {
    const games: GameScore[] = [
      { player1Score: 11, player2Score: 5, winnerId: player1Id },
      { player1Score: 11, player2Score: 9, winnerId: player1Id },
    ]
    const result = countWins(games, player1Id, player2Id)
    expect(result).toEqual({ player1Wins: 2, player2Wins: 0 })
  })

  it('counts player 2 wins', () => {
    const games: GameScore[] = [
      { player1Score: 5, player2Score: 11, winnerId: player2Id },
      { player1Score: 9, player2Score: 11, winnerId: player2Id },
    ]
    const result = countWins(games, player1Id, player2Id)
    expect(result).toEqual({ player1Wins: 0, player2Wins: 2 })
  })

  it('counts mixed wins', () => {
    const games: GameScore[] = [
      { player1Score: 11, player2Score: 5, winnerId: player1Id },
      { player1Score: 5, player2Score: 11, winnerId: player2Id },
      { player1Score: 11, player2Score: 9, winnerId: player1Id },
    ]
    const result = countWins(games, player1Id, player2Id)
    expect(result).toEqual({ player1Wins: 2, player2Wins: 1 })
  })
})

describe('isMatchComplete', () => {
  const player1Id = 'player-1'
  const player2Id = 'player-2'

  describe('best of 1', () => {
    it('is not complete with no games', () => {
      expect(isMatchComplete([], 1, player1Id, player2Id)).toBe(false)
    })

    it('is complete when player 1 wins 1 game', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
      ]
      expect(isMatchComplete(games, 1, player1Id, player2Id)).toBe(true)
    })

    it('is complete when player 2 wins 1 game', () => {
      const games: GameScore[] = [
        { player1Score: 5, player2Score: 11, winnerId: player2Id },
      ]
      expect(isMatchComplete(games, 1, player1Id, player2Id)).toBe(true)
    })
  })

  describe('best of 3', () => {
    it('is not complete with 0 games', () => {
      expect(isMatchComplete([], 3, player1Id, player2Id)).toBe(false)
    })

    it('is not complete with 1-0', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
      ]
      expect(isMatchComplete(games, 3, player1Id, player2Id)).toBe(false)
    })

    it('is not complete with 1-1', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
        { player1Score: 5, player2Score: 11, winnerId: player2Id },
      ]
      expect(isMatchComplete(games, 3, player1Id, player2Id)).toBe(false)
    })

    it('is complete with 2-0 for player 1', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
        { player1Score: 11, player2Score: 9, winnerId: player1Id },
      ]
      expect(isMatchComplete(games, 3, player1Id, player2Id)).toBe(true)
    })

    it('is complete with 2-1 for player 2', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
        { player1Score: 5, player2Score: 11, winnerId: player2Id },
        { player1Score: 9, player2Score: 11, winnerId: player2Id },
      ]
      expect(isMatchComplete(games, 3, player1Id, player2Id)).toBe(true)
    })
  })

  describe('best of 5', () => {
    it('is not complete with 2-2', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
        { player1Score: 5, player2Score: 11, winnerId: player2Id },
        { player1Score: 11, player2Score: 9, winnerId: player1Id },
        { player1Score: 9, player2Score: 11, winnerId: player2Id },
      ]
      expect(isMatchComplete(games, 5, player1Id, player2Id)).toBe(false)
    })

    it('is complete with 3-0 for player 1', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
        { player1Score: 11, player2Score: 9, winnerId: player1Id },
        { player1Score: 11, player2Score: 7, winnerId: player1Id },
      ]
      expect(isMatchComplete(games, 5, player1Id, player2Id)).toBe(true)
    })

    it('is complete with 3-2 for player 2', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
        { player1Score: 5, player2Score: 11, winnerId: player2Id },
        { player1Score: 11, player2Score: 9, winnerId: player1Id },
        { player1Score: 9, player2Score: 11, winnerId: player2Id },
        { player1Score: 9, player2Score: 11, winnerId: player2Id },
      ]
      expect(isMatchComplete(games, 5, player1Id, player2Id)).toBe(true)
    })
  })

  describe('best of 7', () => {
    it('is not complete with 3-3', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
        { player1Score: 5, player2Score: 11, winnerId: player2Id },
        { player1Score: 11, player2Score: 9, winnerId: player1Id },
        { player1Score: 9, player2Score: 11, winnerId: player2Id },
        { player1Score: 11, player2Score: 7, winnerId: player1Id },
        { player1Score: 7, player2Score: 11, winnerId: player2Id },
      ]
      expect(isMatchComplete(games, 7, player1Id, player2Id)).toBe(false)
    })

    it('is complete with 4-2 for player 1', () => {
      const games: GameScore[] = [
        { player1Score: 11, player2Score: 5, winnerId: player1Id },
        { player1Score: 5, player2Score: 11, winnerId: player2Id },
        { player1Score: 11, player2Score: 9, winnerId: player1Id },
        { player1Score: 9, player2Score: 11, winnerId: player2Id },
        { player1Score: 11, player2Score: 7, winnerId: player1Id },
        { player1Score: 11, player2Score: 8, winnerId: player1Id },
      ]
      expect(isMatchComplete(games, 7, player1Id, player2Id)).toBe(true)
    })
  })
})

describe('getMatchWinner', () => {
  const player1Id = 'player-1'
  const player2Id = 'player-2'

  it('returns null when match is not complete', () => {
    const games: GameScore[] = [
      { player1Score: 11, player2Score: 5, winnerId: player1Id },
    ]
    expect(getMatchWinner(games, 5, player1Id, player2Id)).toBeNull()
  })

  it('returns player 1 id when player 1 wins', () => {
    const games: GameScore[] = [
      { player1Score: 11, player2Score: 5, winnerId: player1Id },
      { player1Score: 11, player2Score: 9, winnerId: player1Id },
      { player1Score: 11, player2Score: 7, winnerId: player1Id },
    ]
    expect(getMatchWinner(games, 5, player1Id, player2Id)).toBe(player1Id)
  })

  it('returns player 2 id when player 2 wins', () => {
    const games: GameScore[] = [
      { player1Score: 5, player2Score: 11, winnerId: player2Id },
      { player1Score: 9, player2Score: 11, winnerId: player2Id },
      { player1Score: 7, player2Score: 11, winnerId: player2Id },
    ]
    expect(getMatchWinner(games, 5, player1Id, player2Id)).toBe(player2Id)
  })
})

describe('getCurrentGameNumber', () => {
  it('returns 1 for no games', () => {
    expect(getCurrentGameNumber([])).toBe(1)
  })

  it('returns 2 after 1 game', () => {
    const games: GameScore[] = [
      { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
    ]
    expect(getCurrentGameNumber(games)).toBe(2)
  })

  it('returns 4 after 3 games', () => {
    const games: GameScore[] = [
      { player1Score: 11, player2Score: 5, winnerId: 'player-1' },
      { player1Score: 5, player2Score: 11, winnerId: 'player-2' },
      { player1Score: 11, player2Score: 9, winnerId: 'player-1' },
    ]
    expect(getCurrentGameNumber(games)).toBe(4)
  })
})
