import { renderHook } from '@testing-library/react'
import { http, type HttpResponseResolver } from 'msw'
import { createElement, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateMatch, CREATE_MATCH_ENDPOINT } from './useCreateMatch'
import { createTestQueryClient } from '../test/utils'

const API_BASE = '/api/v1'
const FULL_ENDPOINT = `${API_BASE}${CREATE_MATCH_ENDPOINT}`

interface RenderOptions {
  queryClient?: QueryClient
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

export const useCreateMatchPage = {
  render(options: RenderOptions = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useCreateMatch(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.post(FULL_ENDPOINT, handler)
  },
}
