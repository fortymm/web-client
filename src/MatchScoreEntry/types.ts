import { z } from 'zod'

export interface MatchPlayer {
  id: string
  name: string
  isCurrentUser?: boolean
}

export type BestOf = 3 | 5 | 7

export interface MatchConfig {
  id: string
  playerYou: MatchPlayer
  playerOpponent: MatchPlayer
  bestOf: BestOf
  pointsToWin: number
  winBy: number
}

export interface GameScore {
  gameIndex: number
  youScore: number | null
  opponentScore: number | null
}

export interface MatchScoreEntryProps {
  config: MatchConfig
  initialScores?: GameScore[]
  onSave: (scores: GameScore[]) => Promise<void> | void
  onCancel?: () => void
  allowIncompleteSave?: boolean
}

export type GameWinner = 'you' | 'opponent' | null

export interface GameValidationResult {
  isValid: boolean
  winner: GameWinner
  error: string | null
}

export interface MatchSummary {
  youWins: number
  opponentWins: number
  isComplete: boolean
  winner: GameWinner
  gamesNeededToWin: number
}

// Zod schemas for API payloads
export const gameScoreSchema = z.object({
  gameIndex: z.number().int().min(0),
  youScore: z.number().int().min(0).nullable(),
  opponentScore: z.number().int().min(0).nullable(),
})

export const matchScoresPayloadSchema = z.object({
  matchId: z.string(),
  scores: z.array(gameScoreSchema),
})

export type MatchScoresPayload = z.infer<typeof matchScoresPayloadSchema>
