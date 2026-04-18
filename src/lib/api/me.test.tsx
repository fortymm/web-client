import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { useMe } from './me'

describe('useMe', () => {
  it('returns the player from /api/me', async () => {
    server.use(
      http.get('/api/me', () =>
        HttpResponse.json({ name: 'Test Player', seed: 3, rating: 1700 }),
      ),
    )

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useMe(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({
      name: 'Test Player',
      seed: 3,
      rating: 1700,
    })
  })
})
