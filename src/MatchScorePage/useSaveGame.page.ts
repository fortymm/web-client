import { renderHook, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import { type QueryClient } from '@tanstack/react-query'
import { createTestQueryClient, createWrapper } from '../test/utils'
import { useSaveGame } from './useSaveGame'

interface RenderOptions {
  queryClient?: QueryClient
}

export const useSaveGamePage = {
  render(options: RenderOptions = {}) {
    const { queryClient = createTestQueryClient() } = options

    const { result } = renderHook(() => useSaveGame(), {
      wrapper: createWrapper(queryClient),
    })

    return { result, queryClient }
  },

  async waitForSuccess(result: ReturnType<typeof useSaveGame>) {
    await waitFor(() => {
      expect(result.isSuccess).toBe(true)
    })
  },
}
