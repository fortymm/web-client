import { expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, type HttpResponseResolver } from 'msw'
import { CREATE_USER_ENDPOINT, useCreateUser } from './useCreateUser'
import {
  createTestQueryClient,
  createWrapper,
} from '../test/utils'

const FULL_ENDPOINT = `/api/v1${CREATE_USER_ENDPOINT}`

export const useCreateUserPage = {
  render(options: { queryClient?: ReturnType<typeof createTestQueryClient> } = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.post(FULL_ENDPOINT, handler)
  },

  async waitForSuccess(result: ReturnType<typeof useCreateUser>) {
    await waitFor(() => {
      expect(result.isSuccess).toBe(true)
    })
  },

  async waitForError(result: ReturnType<typeof useCreateUser>) {
    await waitFor(() => {
      expect(result.isError).toBe(true)
    })
  },
}
