import { expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, type HttpResponseResolver } from 'msw'
import { LOGIN_ENDPOINT, useLogin } from './useLogin'
import {
  createTestQueryClient,
  createWrapper,
} from '../test/utils'

const FULL_ENDPOINT = `/api/v1${LOGIN_ENDPOINT}`

export const useLoginPage = {
  render(options: { queryClient?: ReturnType<typeof createTestQueryClient> } = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.post(FULL_ENDPOINT, handler)
  },

  async waitForSuccess(result: ReturnType<typeof useLogin>) {
    await waitFor(() => {
      expect(result.isSuccess).toBe(true)
    })
  },

  async waitForError(result: ReturnType<typeof useLogin>) {
    await waitFor(() => {
      expect(result.isError).toBe(true)
    })
  },
}
