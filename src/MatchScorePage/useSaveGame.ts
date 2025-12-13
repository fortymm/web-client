import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMatch, saveMatch, type GameScore, type StoredMatch } from '@lib/matchesDb'

export interface SaveGamePayload {
  matchId: string
  game: GameScore
}

export interface SaveGameResult {
  match: StoredMatch
  isMatchComplete: boolean
}

function calculateMatchWinner(
  games: GameScore[],
  matchLength: number,
  player1Id: string,
  player2Id: string
): string | null {
  const gamesToWin = Math.ceil(matchLength / 2)

  let player1Wins = 0
  let player2Wins = 0

  for (const game of games) {
    if (game.winnerId === player1Id) {
      player1Wins++
    } else if (game.winnerId === player2Id) {
      player2Wins++
    }
  }

  if (player1Wins >= gamesToWin) {
    return player1Id
  }
  if (player2Wins >= gamesToWin) {
    return player2Id
  }

  return null
}

export function useSaveGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SaveGamePayload): Promise<SaveGameResult> => {
      const { matchId, game } = payload

      const match = await getMatch(matchId)
      if (!match) {
        throw new Error(`Match not found: ${matchId}`)
      }

      if (match.status === 'completed') {
        throw new Error('Cannot add game to completed match')
      }

      const updatedGames = [...match.games, game]

      // Determine player IDs - use playerId (or 'player-1' as default) and opponentId (or 'player-2' as default)
      const player1Id = match.playerId ?? 'player-1'
      const player2Id = match.opponentId ?? 'player-2'

      const matchWinner = calculateMatchWinner(
        updatedGames,
        match.matchLength,
        player1Id,
        player2Id
      )

      const isMatchComplete = matchWinner !== null

      const updatedMatch: StoredMatch = {
        ...match,
        games: updatedGames,
        status: isMatchComplete ? 'completed' : 'in_progress',
        winnerId: matchWinner,
      }

      await saveMatch(updatedMatch)

      return {
        match: updatedMatch,
        isMatchComplete,
      }
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['match', variables.matchId], data.match)
    },
  })
}

export function getGamesToWin(matchLength: number): number {
  return Math.ceil(matchLength / 2)
}

export function getGameWins(games: GameScore[], playerId: string): number {
  return games.filter(game => game.winnerId === playerId).length
}
