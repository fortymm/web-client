import { z } from 'zod'
import { useQuery, keepPreviousData, type QueryObserverResult } from '@tanstack/react-query'
import { api } from '../lib/api'

const ENDPOINT = '/users/players'

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

export const playerResultSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  isEphemeral: z.boolean(),
  headToHead: headToHeadSchema.optional(),
  lastMatch: lastMatchSchema.optional(),
})

export const playerResultsResponseSchema = z.object({
  players: z.array(playerResultSchema),
  query: z.string(),
  total: z.number(),
})

export type HeadToHead = z.infer<typeof headToHeadSchema>
export type LastMatch = z.infer<typeof lastMatchSchema>
export type PlayerResult = z.infer<typeof playerResultSchema>
export type PlayerResultsResponse = z.infer<typeof playerResultsResponseSchema>

export interface UsePlayerResultsOptions {
  query: string
}

export interface UsePlayerResultsReturn {
  players: PlayerResult[] | null
  query: string | null
  total: number | null
  status: 'pending' | 'success' | 'error'
  error: Error | null
  isInitialLoading: boolean
  isRefetching: boolean
  isFetching: boolean
  refetch: () => Promise<QueryObserverResult<PlayerResultsResponse, Error>>
}

export function usePlayerResults({
  query,
}: UsePlayerResultsOptions): UsePlayerResultsReturn {
  const trimmedQuery = query.trim()
  const isSearchMode = trimmedQuery.length > 0

  const result = useQuery({
    queryKey: ['player-results', trimmedQuery],
    queryFn: async ({ signal }) => {
      const params: Record<string, string | number> = { limit: 50 }
      if (isSearchMode) {
        params.q = trimmedQuery
      }
      const response = await api.get<PlayerResultsResponse>(ENDPOINT, {
        params,
        signal,
      })
      const validated = playerResultsResponseSchema.parse(response.data)
      return validated
    },
    staleTime: isSearchMode ? 1000 * 60 * 2 : 1000 * 60, // 2 min for search, 1 min for recents
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: !isSearchMode, // Only refetch on focus for recents
    placeholderData: keepPreviousData,
  })

  return {
    players: result.data?.players ?? null,
    query: result.data?.query ?? null,
    total: result.data?.total ?? null,
    status: result.status,
    error: result.error,
    isInitialLoading: result.isLoading && !result.data,
    isRefetching: result.isFetching && !!result.data,
    isFetching: result.isFetching,
    refetch: result.refetch,
  }
}

export { ENDPOINT as PLAYER_RESULTS_ENDPOINT }
