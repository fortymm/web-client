import { renderHook, waitFor } from '@testing-library/react'
import { type QueryClient } from '@tanstack/react-query'
import { http, type HttpResponseResolver } from 'msw'
import { usePrefetchRecentOpponents } from './usePrefetchRecentOpponents'
import { OPPONENTS_ENDPOINT } from './hooks/useOpponents'
import { createTestQueryClient, createWrapper } from './test/utils'

const FULL_ENDPOINT = `/api/v1${OPPONENTS_ENDPOINT}`

interface RenderOptions {
  queryClient?: QueryClient
}

export const usePrefetchRecentOpponentsPage = {
  render(options: RenderOptions = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    renderHook(() => usePrefetchRecentOpponents(), {
      wrapper: createWrapper(queryClient),
    })
    return { queryClient }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.get(FULL_ENDPOINT, handler)
  },

  async waitForPrefetch(queryClient: QueryClient) {
    await waitFor(() => {
      const state = queryClient.getQueryState(['opponents', ''])
      if (!state || state.status === 'pending') {
        throw new Error('Still prefetching')
      }
    })
  },

  getQueryData(queryClient: QueryClient) {
    return queryClient.getQueryData(['opponents', ''])
  },

  getQueryState(queryClient: QueryClient) {
    return queryClient.getQueryState(['opponents', ''])
  },
}
