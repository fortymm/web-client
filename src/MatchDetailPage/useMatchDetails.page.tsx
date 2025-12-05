import { renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { type ReactNode } from 'react'
import { useMatchDetails } from './useMatchDetails'

function createWrapper(initialEntries: string[] = ['/matches/test-123']) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    )
  }
}

export const useMatchDetailsPage = {
  render(matchId: string = 'test-123', initialEntries?: string[]) {
    const { result } = renderHook(() => useMatchDetails(matchId), {
      wrapper: createWrapper(initialEntries),
    })
    return { result }
  },

  async waitForLoaded(result: ReturnType<typeof this.render>['result']) {
    await waitFor(() => {
      if (result.current.isLoading) {
        throw new Error('Still loading')
      }
    })
  },
}
