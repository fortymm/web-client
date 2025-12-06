import { renderHook } from '@testing-library/react'
import { type QueryClient } from '@tanstack/react-query'
import { http, type HttpResponseResolver } from 'msw'
import { useOpponents, OPPONENTS_ENDPOINT, type UseOpponentsOptions } from './useOpponents'
import { createTestQueryClient, createWrapper } from '../test/utils'

const FULL_ENDPOINT = `/api/v1${OPPONENTS_ENDPOINT}`

interface RenderOptions {
  queryClient?: QueryClient
  query?: string
}

export const useOpponentsPage = {
  render(options: RenderOptions = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const hookOptions: UseOpponentsOptions = {}
    if (options.query !== undefined) {
      hookOptions.query = options.query
    }

    const { result, rerender } = renderHook(
      (props: UseOpponentsOptions) => useOpponents(props),
      {
        wrapper: createWrapper(queryClient),
        initialProps: hookOptions,
      }
    )
    return { result, queryClient, rerender }
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
      headToHead: overrides.headToHead,
      lastMatch: overrides.lastMatch,
    }
  },

  createMockRecentOpponent(overrides: Partial<{
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

  createMockResponse(
    opponents: ReturnType<typeof this.createMockOpponent>[],
    query: string | null = null
  ) {
    return {
      opponents,
      query,
      total: opponents.length,
    }
  },
}
