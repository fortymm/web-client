import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import { createWrapper } from './test/utils'
import { useDeleteMatch } from './useDeleteMatch'

export const useDeleteMatchPage = {
  render(queryClient?: QueryClient) {
    const client = queryClient ?? new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    const { result } = renderHook(() => useDeleteMatch(), {
      wrapper: createWrapper(client),
    })
    return { result, queryClient: client }
  },

  async waitForSuccess(result: ReturnType<typeof useDeleteMatch>) {
    await waitFor(() => {
      if (result.isError) throw result.error
      return result.isSuccess
    })
  },
}
