import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from './lib/api'
import { opponentsResponseSchema, OPPONENTS_ENDPOINT } from './hooks/useOpponents'

export function usePrefetchRecentOpponents(): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['opponents', ''],
      queryFn: async () => {
        const response = await api.get(OPPONENTS_ENDPOINT, {
          params: { limit: 50 },
        })
        return opponentsResponseSchema.parse(response.data)
      },
      staleTime: 1000 * 60, // 1 minute (same as useOpponents for recents)
    })
  }, [queryClient])
}
