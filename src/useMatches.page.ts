import { renderHook, waitFor } from '@testing-library/react'
import { type QueryClient } from '@tanstack/react-query'
import { useMatches } from './useMatches'
import { createTestQueryClient, createWrapper } from './test/utils'
import { type StoredMatch } from './lib/matchesDb'

interface RenderOptions {
  queryClient?: QueryClient
}

export function createTestMatch(overrides: Partial<StoredMatch> = {}): StoredMatch {
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

export const useMatchesPage = {
  render(options: RenderOptions = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useMatches(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  async waitForSuccess(result: { current: ReturnType<typeof useMatches> }) {
    await waitFor(() => {
      if (result.current.status !== 'success') {
        throw new Error('Not yet successful')
      }
    })
  },

  async waitForError(result: { current: ReturnType<typeof useMatches> }) {
    await waitFor(() => {
      if (result.current.status !== 'error') {
        throw new Error('Not yet errored')
      }
    })
  },
}
