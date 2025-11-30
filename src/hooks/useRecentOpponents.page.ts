import { renderHook } from '@testing-library/react'
import { type QueryClient } from '@tanstack/react-query'
import { http, type HttpResponseResolver } from 'msw'
import { useRecentOpponents, RECENT_OPPONENTS_ENDPOINT } from './useRecentOpponents'
import { createTestQueryClient, createWrapper } from '../test/utils'

const FULL_ENDPOINT = `/api/v1${RECENT_OPPONENTS_ENDPOINT}`

interface RenderOptions {
  queryClient?: QueryClient
}

export const useRecentOpponentsPage = {
  render(options: RenderOptions = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useRecentOpponents(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.get(FULL_ENDPOINT, handler)
  },

  createMockOpponent(overrides: Partial<{
    id: string
    username: string
    avatarUrl: string | null
    isEphemeral: boolean
    headToHead: { wins: number; losses: number }
    lastMatch: { id: string; result: 'win' | 'loss'; score: string; playedAt: string }
  }> = {}) {
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

  createMockResponse(opponents: ReturnType<typeof this.createMockOpponent>[] = []) {
    return {
      opponents,
      total: opponents.length,
    }
  },
}
