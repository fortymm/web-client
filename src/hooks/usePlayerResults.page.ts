import { renderHook } from '@testing-library/react'
import { type QueryClient } from '@tanstack/react-query'
import { http, type HttpResponseResolver } from 'msw'
import {
  usePlayerResults,
  PLAYER_RESULTS_ENDPOINT,
  type UsePlayerResultsOptions,
} from './usePlayerResults'
import { createTestQueryClient, createWrapper } from '../test/utils'

const FULL_ENDPOINT = `/api/v1${PLAYER_RESULTS_ENDPOINT}`

interface RenderOptions extends Partial<UsePlayerResultsOptions> {
  queryClient?: QueryClient
}

export const usePlayerResultsPage = {
  render(options: RenderOptions = {}) {
    const { queryClient: providedClient, query = '' } = options
    const queryClient = providedClient ?? createTestQueryClient()
    const { result, rerender } = renderHook(
      (props: UsePlayerResultsOptions) => usePlayerResults(props),
      {
        wrapper: createWrapper(queryClient),
        initialProps: { query },
      }
    )
    return { result, queryClient, rerender }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.get(FULL_ENDPOINT, handler)
  },

  createMockPlayer(
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

  createMockRecentPlayer(
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
    // Recent players always have headToHead and lastMatch
    return {
      id: overrides.id ?? crypto.randomUUID(),
      username: overrides.username ?? 'opponent',
      avatarUrl: overrides.avatarUrl ?? null,
      isEphemeral: overrides.isEphemeral ?? false,
      headToHead: overrides.headToHead ?? { wins: 0, losses: 0 },
      lastMatch: overrides.lastMatch ?? {
        id: crypto.randomUUID(),
        result: 'win' as const,
        score: '11-7',
        playedAt: new Date().toISOString(),
      },
    }
  },

  createMockResponse(
    players: ReturnType<typeof this.createMockPlayer>[] = [],
    query = ''
  ) {
    return {
      players,
      query,
      total: players.length,
    }
  },
}
