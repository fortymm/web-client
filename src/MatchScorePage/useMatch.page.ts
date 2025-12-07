import { renderHook, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import { type QueryClient } from '@tanstack/react-query'
import { createTestQueryClient, createWrapper } from '../test/utils'
import { useMatch } from './useMatch'
import type { StoredMatch, StoredGameScore } from '../lib/matchesDb'

interface RenderOptions {
  queryClient?: QueryClient
  matchId?: string
}

export function createMockMatch(overrides: Partial<StoredMatch> = {}): StoredMatch {
  return {
    id: 'test-match-123',
    playerId: 'player-1',
    opponentId: 'player-2',
    matchLength: 5,
    status: 'in_progress',
    games: [],
    winnerId: null,
    createdAt: new Date(),
    ...overrides,
  }
}

export function createMockGame(overrides: Partial<StoredGameScore> = {}): StoredGameScore {
  return {
    player1Score: 11,
    player2Score: 5,
    winnerId: 'player-1',
    ...overrides,
  }
}

export const useMatchPage = {
  render(options: RenderOptions = {}) {
    const { queryClient = createTestQueryClient(), matchId = 'test-match-123' } = options

    const { result } = renderHook(() => useMatch(matchId), {
      wrapper: createWrapper(queryClient),
    })

    return { result, queryClient }
  },

  async waitForSuccess(result: ReturnType<typeof useMatch>) {
    await waitFor(() => {
      expect(result.isSuccess).toBe(true)
    })
  },
}
