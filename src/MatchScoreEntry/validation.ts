import type {
  GameScore,
  GameValidationResult,
  GameWinner,
  MatchConfig,
  MatchSummary,
} from './types'

export function validateGameScore(
  game: GameScore,
  config: MatchConfig
): GameValidationResult {
  const { youScore, opponentScore } = game
  const { pointsToWin, winBy } = config

  // If either score is null, it's not played yet - no validation needed
  if (youScore === null || opponentScore === null) {
    return {
      isValid: true,
      winner: null,
      error: null,
    }
  }

  // Check for tie
  if (youScore === opponentScore) {
    return {
      isValid: false,
      winner: null,
      error: 'Game cannot end in a tie.',
    }
  }

  const maxScore = Math.max(youScore, opponentScore)
  const diff = Math.abs(youScore - opponentScore)
  const winner: GameWinner = youScore > opponentScore ? 'you' : 'opponent'

  // Check if winner has at least pointsToWin
  if (maxScore < pointsToWin) {
    return {
      isValid: false,
      winner: null,
      error: `Winner must have at least ${pointsToWin} points.`,
    }
  }

  // Check win-by margin
  if (diff < winBy) {
    return {
      isValid: false,
      winner: null,
      error: `Winner must lead by at least ${winBy} points.`,
    }
  }

  return {
    isValid: true,
    winner,
    error: null,
  }
}

export function computeMatchSummary(
  scores: GameScore[],
  config: MatchConfig
): MatchSummary {
  const gamesNeededToWin = Math.ceil(config.bestOf / 2)

  let youWins = 0
  let opponentWins = 0

  for (const game of scores) {
    const result = validateGameScore(game, config)
    if (result.isValid && result.winner) {
      if (result.winner === 'you') {
        youWins++
      } else {
        opponentWins++
      }
    }
  }

  const isComplete = youWins >= gamesNeededToWin || opponentWins >= gamesNeededToWin
  const winner: GameWinner = isComplete
    ? youWins >= gamesNeededToWin
      ? 'you'
      : 'opponent'
    : null

  return {
    youWins,
    opponentWins,
    isComplete,
    winner,
    gamesNeededToWin,
  }
}

export function canSaveMatch(
  scores: GameScore[],
  config: MatchConfig,
  allowIncompleteSave: boolean
): { canSave: boolean; reason: string | null } {
  // Check for any invalid games
  const hasInvalidGames = scores.some((game) => {
    if (game.youScore === null || game.opponentScore === null) {
      return false // Empty games are not invalid
    }
    const result = validateGameScore(game, config)
    return !result.isValid
  })

  if (hasInvalidGames) {
    return {
      canSave: false,
      reason: 'Fix invalid scores before saving.',
    }
  }

  // Check if at least one game is valid
  const validGamesCount = scores.filter((game) => {
    if (game.youScore === null || game.opponentScore === null) {
      return false
    }
    const result = validateGameScore(game, config)
    return result.isValid
  }).length

  if (validGamesCount === 0) {
    return {
      canSave: false,
      reason: 'Enter at least one valid game score.',
    }
  }

  // Check if match is complete (unless allowIncompleteSave)
  const summary = computeMatchSummary(scores, config)
  if (!summary.isComplete && !allowIncompleteSave) {
    return {
      canSave: false,
      reason: `Match is not complete. ${summary.gamesNeededToWin} wins needed.`,
    }
  }

  return {
    canSave: true,
    reason: null,
  }
}

export function initializeScores(bestOf: number): GameScore[] {
  return Array.from({ length: bestOf }, (_, index) => ({
    gameIndex: index,
    youScore: null,
    opponentScore: null,
  }))
}
