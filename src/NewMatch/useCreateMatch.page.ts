import { renderHook } from '@testing-library/react'
import { type QueryClient } from '@tanstack/react-query'
import { useCreateMatch } from './useCreateMatch'
import { createTestQueryClient, createWrapper } from '../test/utils'
import { getMatch } from '../lib/matchesDb'

interface RenderOptions {
  queryClient?: QueryClient
}

export const useCreateMatchPage = {
  render(options: RenderOptions = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useCreateMatch(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  async getStoredMatch(id: string) {
    return getMatch(id)
  },
}
