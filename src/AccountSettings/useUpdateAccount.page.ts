import { expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, type HttpResponseResolver } from 'msw'
import { UPDATE_ACCOUNT_ENDPOINT, useUpdateAccount } from './useUpdateAccount'
import {
  createTestQueryClient,
  createWrapper,
} from '../test/utils'

const FULL_ENDPOINT = `/api/v1${UPDATE_ACCOUNT_ENDPOINT}`

export const useUpdateAccountPage = {
  render(options: { queryClient?: ReturnType<typeof createTestQueryClient> } = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useUpdateAccount(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  requestHandler(handler: HttpResponseResolver) {
    return http.patch(FULL_ENDPOINT, handler)
  },

  async waitForSuccess(result: ReturnType<typeof useUpdateAccount>) {
    await waitFor(() => {
      expect(result.isSuccess).toBe(true)
    })
  },

  async waitForError(result: ReturnType<typeof useUpdateAccount>) {
    await waitFor(() => {
      expect(result.isError).toBe(true)
    })
  },
}
