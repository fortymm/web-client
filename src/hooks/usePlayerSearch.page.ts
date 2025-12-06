import { renderHook } from '@testing-library/react'
import { type QueryClient } from '@tanstack/react-query'
import { http, type HttpResponseResolver } from 'msw'
import {
  usePlayerSearch,
  PLAYER_SEARCH_ENDPOINT,
  type UsePlayerSearchOptions,
} from './usePlayerSearch'
import { createTestQueryClient, createWrapper } from '../test/utils'

const FULL_ENDPOINT = `/api/v1${PLAYER_SEARCH_ENDPOINT}`

interface RenderOptions extends Partial<UsePlayerSearchOptions> {
  queryClient?: QueryClient
}

export const usePlayerSearchPage = {
  render(options: RenderOptions = {}) {
    const { queryClient: providedClient, query = '', enabled = true } = options
    const queryClient = providedClient ?? createTestQueryClient()
    const { result, rerender } = renderHook(
      (props: UsePlayerSearchOptions) => usePlayerSearch(props),
      {
        wrapper: createWrapper(queryClient),
        initialProps: { query, enabled },
      }
    )
    return { result, queryClient, rerender }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.get(FULL_ENDPOINT, handler)
  },

  createMockSearchResult(
    overrides: Partial<{
      id: string
      username: string
      avatarUrl: string | null
      isEphemeral: boolean
      headToHead: { wins: number; losses: number }
      lastMatch: {
        id: string
        result: 'win' | 'loss'
        score: string
        playedAt: string
      }
    }> = {}
  ) {
    return {
      id: overrides.id ?? crypto.randomUUID(),
      username: overrides.username ?? 'player',
      avatarUrl: overrides.avatarUrl ?? null,
      isEphemeral: overrides.isEphemeral ?? false,
      ...(overrides.headToHead && { headToHead: overrides.headToHead }),
      ...(overrides.lastMatch && { lastMatch: overrides.lastMatch }),
    }
  },

  createMockResponse(
    results: ReturnType<typeof this.createMockSearchResult>[] = [],
    query = 'test'
  ) {
    return {
      results,
      query,
      total: results.length,
    }
  },
}
