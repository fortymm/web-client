import type { MatchLength } from '../NewMatch/MatchLengthControl'

export interface GameScore {
  player1Score: number
  player2Score: number
  winnerId: string
}

/**
 * Calculate how many games a player needs to win to win the match.
 * For "best of N", a player needs to win (N + 1) / 2 games.
 */
export function gamesNeededToWin(matchLength: MatchLength): number {
  return Math.ceil(matchLength / 2)
}

/**
 * Count wins for each player from a list of games.
 */
export function countWins(
  games: GameScore[],
  player1Id: string,
  player2Id: string
): { player1Wins: number; player2Wins: number } {
  let player1Wins = 0
  let player2Wins = 0

  for (const game of games) {
    if (game.winnerId === player1Id) {
      player1Wins++
    } else if (game.winnerId === player2Id) {
      player2Wins++
    }
  }

  return { player1Wins, player2Wins }
}

/**
 * Determine if a match is complete based on games played and match length.
 */
export function isMatchComplete(
  games: GameScore[],
  matchLength: MatchLength,
  player1Id: string,
  player2Id: string
): boolean {
  const neededToWin = gamesNeededToWin(matchLength)
  const { player1Wins, player2Wins } = countWins(games, player1Id, player2Id)

  return player1Wins >= neededToWin || player2Wins >= neededToWin
}

/**
 * Get the match winner ID, or null if match is not complete.
 */
export function getMatchWinner(
  games: GameScore[],
  matchLength: MatchLength,
  player1Id: string,
  player2Id: string
): string | null {
  const neededToWin = gamesNeededToWin(matchLength)
  const { player1Wins, player2Wins } = countWins(games, player1Id, player2Id)

  if (player1Wins >= neededToWin) {
    return player1Id
  }
  if (player2Wins >= neededToWin) {
    return player2Id
  }
  return null
}

/**
 * Get the current game number (1-indexed).
 */
export function getCurrentGameNumber(games: GameScore[]): number {
  return games.length + 1
}
