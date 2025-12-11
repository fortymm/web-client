import { useQuery } from '@tanstack/react-query'
import { getAllMatches, type StoredMatch } from './lib/matchesDb'

export interface UseMatchesReturn {
  matches: StoredMatch[]
  status: 'pending' | 'success' | 'error'
  error: Error | null
  isLoading: boolean
}

export function useMatches(): UseMatchesReturn {
  const query = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const matches = await getAllMatches()
      // Sort by createdAt descending (most recent first)
      return matches.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
  })

  return {
    matches: query.data ?? [],
    status: query.status,
    error: query.error,
    isLoading: query.isLoading,
  }
}
