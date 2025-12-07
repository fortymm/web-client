import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMatch, saveMatch, type StoredGameScore, type StoredMatch } from '../lib/matchesDb'
import { isMatchComplete, getMatchWinner } from '../lib/matchLogic'
import type { MatchLength } from '../NewMatch/MatchLengthControl'

interface SaveGamePayload {
  matchId: string
  game: StoredGameScore
}

export interface SaveGameResult {
  match: StoredMatch
  isMatchComplete: boolean
}

export function useSaveGame() {
  const queryClient = useQueryClient()

  return useMutation<SaveGameResult, Error, SaveGamePayload>({
    mutationFn: async ({ matchId, game }): Promise<SaveGameResult> => {
      const match = await getMatch(matchId)

      if (!match) {
        throw new Error(`Match ${matchId} not found`)
      }

      // Add the new game to the games array
      const updatedGames = [...match.games, game]

      // Determine player IDs (use playerId for player1, opponentId for player2)
      const player1Id = match.playerId ?? 'player-1'
      const player2Id = match.opponentId ?? 'player-2'

      // Check if match is complete
      const matchComplete = isMatchComplete(
        updatedGames,
        match.matchLength as MatchLength,
        player1Id,
        player2Id
      )

      // Get winner if complete
      const matchWinner = matchComplete
        ? getMatchWinner(updatedGames, match.matchLength as MatchLength, player1Id, player2Id)
        : null

      // Update match
      const updatedMatch: StoredMatch = {
        ...match,
        games: updatedGames,
        status: matchComplete ? 'completed' : 'in_progress',
        winnerId: matchWinner,
      }

      await saveMatch(updatedMatch)

      return {
        match: updatedMatch,
        isMatchComplete: matchComplete,
      }
    },
    onSuccess: (data) => {
      // Invalidate match query to refresh data
      queryClient.invalidateQueries({ queryKey: ['match', data.match.id] })
    },
  })
}
