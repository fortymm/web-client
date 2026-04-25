import { Suspense, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { useTokenStore } from '@/lib/auth/tokenStore'
import { useSession } from './session'

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <Suspense fallback={null}>{children}</Suspense>
    </QueryClientProvider>
  )
}

describe('useSession', () => {
  it('returns the session from POST /v1/session', async () => {
    server.use(
      http.post('*/v1/session', () =>
        HttpResponse.json({
          token: 'test-token',
          user: {
            id: '00000000-0000-0000-0000-000000000001',
            username: 'tester',
          },
        }),
      ),
    )

    const { result } = renderHook(() => useSession(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(result.current).toEqual({
      token: 'test-token',
      user: {
        id: '00000000-0000-0000-0000-000000000001',
        username: 'tester',
      },
    })
  })

  it('sends the stored token as a Bearer header', async () => {
    useTokenStore.setState({ token: 'stored-token' })
    let receivedAuthHeader: string | null = null
    server.use(
      http.post('*/v1/session', ({ request }) => {
        receivedAuthHeader = request.headers.get('authorization')
        return HttpResponse.json({
          token: 'next-token',
          user: { id: '00000000-0000-0000-0000-000000000002', username: 'tester' },
        })
      }),
    )

    const { result } = renderHook(() => useSession(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(receivedAuthHeader).toBe('Bearer stored-token')
  })

  it('persists the response token', async () => {
    server.use(
      http.post('*/v1/session', () =>
        HttpResponse.json({
          token: 'rotated-token',
          user: { id: '00000000-0000-0000-0000-000000000003', username: 'tester' },
        }),
      ),
    )

    const { result } = renderHook(() => useSession(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(useTokenStore.getState().token).toBe('rotated-token')
  })
})
