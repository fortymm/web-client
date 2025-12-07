import { useQuery } from '@tanstack/react-query'
import { getMatch, type StoredMatch } from '../lib/matchesDb'

export function useMatch(matchId: string | undefined) {
  return useQuery<StoredMatch | null>({
    queryKey: ['match', matchId],
    queryFn: async () => {
      if (!matchId) {
        return null
      }
      const match = await getMatch(matchId)
      return match ?? null
    },
    enabled: !!matchId,
  })
}
