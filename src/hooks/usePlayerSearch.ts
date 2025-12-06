import { z } from 'zod'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api } from '../lib/api'

const ENDPOINT = '/users/search'

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

export const searchResultSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
  isEphemeral: z.boolean(),
  headToHead: headToHeadSchema.optional(),
  lastMatch: lastMatchSchema.optional(),
})

export const searchResponseSchema = z.object({
  results: z.array(searchResultSchema),
  query: z.string(),
  total: z.number(),
})

export type HeadToHead = z.infer<typeof headToHeadSchema>
export type LastMatch = z.infer<typeof lastMatchSchema>
export type SearchResult = z.infer<typeof searchResultSchema>
export type SearchResponse = z.infer<typeof searchResponseSchema>

export interface UsePlayerSearchOptions {
  query: string
  enabled?: boolean
}

export interface UsePlayerSearchReturn {
  results: SearchResult[] | null
  query: string | null
  total: number | null
  status: 'pending' | 'success' | 'error'
  error: Error | null
  isLoading: boolean
  isFetching: boolean
}

export function usePlayerSearch({
  query,
  enabled = true,
}: UsePlayerSearchOptions): UsePlayerSearchReturn {
  const trimmedQuery = query.trim()
  const shouldFetch = enabled && trimmedQuery.length > 0

  const result = useQuery({
    queryKey: ['player-search', trimmedQuery],
    queryFn: async ({ signal }) => {
      const response = await api.get<SearchResponse>(ENDPOINT, {
        params: { q: trimmedQuery, limit: 50 },
        signal,
      })
      const validated = searchResponseSchema.parse(response.data)
      return validated
    },
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  })

  return {
    results: result.data?.results ?? null,
    query: result.data?.query ?? null,
    total: result.data?.total ?? null,
    status: shouldFetch ? result.status : 'pending',
    error: result.error,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
  }
}

export { ENDPOINT as PLAYER_SEARCH_ENDPOINT }
