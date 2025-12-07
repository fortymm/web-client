import { useQuery } from '@tanstack/react-query'
import { getMatch, type StoredMatch } from '../lib/matchesDb'

export interface UseMatchReturn {
  match: StoredMatch | null
  status: 'pending' | 'success' | 'error'
  error: Error | null
  isLoading: boolean
}

export function useMatch(matchId: string | undefined): UseMatchReturn {
  const query = useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      if (!matchId) {
        throw new Error('Match ID is required')
      }
      const match = await getMatch(matchId)
      if (!match) {
        throw new Error(`Match not found: ${matchId}`)
      }
      return match
    },
    enabled: !!matchId,
  })

  return {
    match: query.data ?? null,
    status: query.status,
    error: query.error,
    isLoading: query.isLoading,
  }
}
