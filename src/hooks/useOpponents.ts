import { z } from 'zod'
import { useQuery, keepPreviousData, type QueryObserverResult } from '@tanstack/react-query'
import { api } from '../lib/api'

const ENDPOINT = '/matches/new/opponents'

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

export const opponentSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  isEphemeral: z.boolean(),
  headToHead: headToHeadSchema.optional(),
  lastMatch: lastMatchSchema.optional(),
})

export const opponentsResponseSchema = z.object({
  opponents: z.array(opponentSchema),
  query: z.string().nullable(),
  total: z.number(),
})

export type HeadToHead = z.infer<typeof headToHeadSchema>
export type LastMatch = z.infer<typeof lastMatchSchema>
export type Opponent = z.infer<typeof opponentSchema>
export type OpponentsResponse = z.infer<typeof opponentsResponseSchema>

export interface UseOpponentsOptions {
  query?: string
}

export interface UseOpponentsReturn {
  opponents: Opponent[] | null
  query: string | null
  total: number | null
  status: 'pending' | 'success' | 'error'
  error: Error | null
  isInitialLoading: boolean
  isFetching: boolean
  isPlaceholderData: boolean
  refetch: () => Promise<QueryObserverResult<OpponentsResponse, Error>>
}

export function useOpponents(options: UseOpponentsOptions = {}): UseOpponentsReturn {
  const { query = '' } = options
  const trimmedQuery = query.trim()
  const hasQuery = trimmedQuery.length > 0

  const result = useQuery({
    queryKey: ['opponents', trimmedQuery],
    queryFn: async ({ signal }) => {
      const params: Record<string, string | number> = { limit: 50 }
      if (hasQuery) {
        params.query = trimmedQuery
      }

      const response = await api.get<OpponentsResponse>(ENDPOINT, {
        params,
        signal,
      })
      return opponentsResponseSchema.parse(response.data)
    },
    staleTime: hasQuery ? 1000 * 60 * 2 : 1000 * 60, // 2 min for search, 1 min for recents
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: !hasQuery, // Only auto-refetch recents
    placeholderData: keepPreviousData, // Keep showing previous data while fetching new
  })

  return {
    opponents: result.data?.opponents ?? null,
    query: result.data?.query ?? null,
    total: result.data?.total ?? null,
    status: result.status,
    error: result.error,
    isInitialLoading: result.isLoading && !result.data,
    isFetching: result.isFetching,
    isPlaceholderData: result.isPlaceholderData,
    refetch: result.refetch,
  }
}

export { ENDPOINT as OPPONENTS_ENDPOINT }
