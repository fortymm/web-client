import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

const ENDPOINT = '/users/me/recent-opponents'

export const headToHeadSchema = z.object({
  wins: z.number(),
  losses: z.number(),
})

export const lastMatchSchema = z.object({
  id: z.string(),
  result: z.union([z.literal('win'), z.literal('loss')]),
  score: z.string(),
  playedAt: z.string(),
})

export const recentOpponentSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  isEphemeral: z.boolean(),
  headToHead: headToHeadSchema,
  lastMatch: lastMatchSchema,
})

export const recentOpponentsResponseSchema = z.object({
  opponents: z.array(recentOpponentSchema),
  total: z.number(),
})

export type HeadToHead = z.infer<typeof headToHeadSchema>
export type LastMatch = z.infer<typeof lastMatchSchema>
export type RecentOpponent = z.infer<typeof recentOpponentSchema>
export type RecentOpponentsResponse = z.infer<typeof recentOpponentsResponseSchema>

export interface UseRecentOpponentsReturn {
  opponents: RecentOpponent[] | null
  status: 'pending' | 'success' | 'error'
  error: Error | null
  isInitialLoading: boolean
  isRefetching: boolean
  refetch: () => void
}

export function useRecentOpponents(): UseRecentOpponentsReturn {
  const query = useQuery({
    queryKey: ['recent-opponents'],
    queryFn: async () => {
      const response = await api.get<RecentOpponentsResponse>(ENDPOINT, {
        params: { limit: 50 },
      })
      const validated = recentOpponentsResponseSchema.parse(response.data)
      return validated.opponents
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes (cache time)
    refetchOnWindowFocus: true,
  })

  return {
    opponents: query.data ?? null,
    status: query.status,
    error: query.error,
    isInitialLoading: query.isLoading && !query.data,
    isRefetching: query.isFetching && !!query.data,
    refetch: query.refetch,
  }
}

export { ENDPOINT as RECENT_OPPONENTS_ENDPOINT }
