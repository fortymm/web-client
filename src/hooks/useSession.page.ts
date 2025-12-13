import { renderHook } from '@testing-library/react'
import { type QueryClient } from '@tanstack/react-query'
import { http, type HttpResponseResolver } from 'msw'
import { useSession, SESSION_ENDPOINT } from './useSession'
import { createTestQueryClient, createWrapper } from '../test/utils'

const FULL_ENDPOINT = `/api/v1${SESSION_ENDPOINT}`

interface RenderOptions {
  queryClient?: QueryClient
}

export const useSessionPage = {
  render(options: RenderOptions = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()

    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.get(FULL_ENDPOINT, handler)
  },

  createMockResponse(overrides: Partial<{ username: string }> = {}) {
    return {
      username: overrides.username ?? 'Guest',
    }
  },
}
