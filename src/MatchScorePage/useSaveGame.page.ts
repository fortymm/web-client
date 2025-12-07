import { renderHook, waitFor } from '@testing-library/react'
import { type QueryClient } from '@tanstack/react-query'
import { useSaveGame } from './useSaveGame'
import { createTestQueryClient, createWrapper } from '../test/utils'

interface RenderOptions {
  queryClient?: QueryClient
}

export const useSaveGamePage = {
  render(options: RenderOptions = {}) {
    const queryClient = options.queryClient ?? createTestQueryClient()
    const { result } = renderHook(() => useSaveGame(), {
      wrapper: createWrapper(queryClient),
    })
    return { result, queryClient }
  },

  async waitForSuccess(result: { current: ReturnType<typeof useSaveGame> }) {
    await waitFor(() => {
      if (!result.current.isSuccess) {
        throw new Error('Not yet successful')
      }
    })
  },

  async waitForError(result: { current: ReturnType<typeof useSaveGame> }) {
    await waitFor(() => {
      if (!result.current.isError) {
        throw new Error('Not yet errored')
      }
    })
  },
}
