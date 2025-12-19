import { expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, type HttpResponseResolver } from 'msw'
import { LOGIN_WITH_EMAIL_ENDPOINT, useLoginWithEmail } from './useLoginWithEmail'
import {
  createTestQueryClient,
  createWrapper,
} from '../test/utils'

const FULL_ENDPOINT = `/api/v1${LOGIN_WITH_EMAIL_ENDPOINT}`

export const useLoginWithEmailPage = {
  render(options: { queryClient?: ReturnType<typeof createTestQueryClient> } = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useLoginWithEmail(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.post(FULL_ENDPOINT, handler)
  },

  async waitForSuccess(result: ReturnType<typeof useLoginWithEmail>) {
    await waitFor(() => {
      expect(result.isSuccess).toBe(true)
    })
  },

  async waitForError(result: ReturnType<typeof useLoginWithEmail>) {
    await waitFor(() => {
      expect(result.isError).toBe(true)
    })
  },
}
