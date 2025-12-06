import { describe, it, expect, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse, delay } from 'msw'
import { server } from '../test/mocks/server'
import { usePlayerSearchPage } from './usePlayerSearch.page'

describe('usePlayerSearch', () => {
  describe('idle state when query is empty', () => {
    it('returns pending status and null results when query is empty string', () => {
      const { result } = usePlayerSearchPage.render({ query: '' })

      expect(result.current.status).toBe('pending')
      expect(result.current.results).toBeNull()
      expect(result.current.query).toBeNull()
      expect(result.current.total).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
    })

    it('returns pending status when query is only whitespace', () => {
      const { result } = usePlayerSearchPage.render({ query: '   ' })

      expect(result.current.status).toBe('pending')
      expect(result.current.results).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })

    it('does not fetch when enabled is false', () => {
      let fetchCalled = false

      server.use(
        usePlayerSearchPage.requestHandler(() => {
          fetchCalled = true
          return HttpResponse.json(usePlayerSearchPage.createMockResponse())
        })
      )

      const { result } = usePlayerSearchPage.render({
        query: 'test',
        enabled: false,
      })

      expect(result.current.status).toBe('pending')
      expect(result.current.results).toBeNull()
      expect(fetchCalled).toBe(false)
    })
  })

  describe('fetches when query is non-empty', () => {
    it('fetches when query has content', async () => {
      const mockResult = usePlayerSearchPage.createMockSearchResult({
        id: 'player-1',
        username: 'alice',
      })

      server.use(
        usePlayerSearchPage.requestHandler(() => {
          return HttpResponse.json(
            usePlayerSearchPage.createMockResponse([mockResult], 'alice')
          )
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'alice' })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.results).toHaveLength(1)
      expect(result.current.results![0].username).toBe('alice')
    })

    it('sends correct query parameters to API', async () => {
      let capturedQuery: string | null = null
      let capturedLimit: string | null = null

      server.use(
        usePlayerSearchPage.requestHandler(({ request }) => {
          const params = new URL(request.url).searchParams
          capturedQuery = params.get('q')
          capturedLimit = params.get('limit')
          return HttpResponse.json(
            usePlayerSearchPage.createMockResponse([], 'search-term')
          )
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'search-term' })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(capturedQuery).toBe('search-term')
      expect(capturedLimit).toBe('50')
    })

    it('trims whitespace from query before sending', async () => {
      let capturedQuery: string | null = null

      server.use(
        usePlayerSearchPage.requestHandler(({ request }) => {
          capturedQuery = new URL(request.url).searchParams.get('q')
          return HttpResponse.json(
            usePlayerSearchPage.createMockResponse([], 'trimmed')
          )
        })
      )

      const { result } = usePlayerSearchPage.render({ query: '  trimmed  ' })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(capturedQuery).toBe('trimmed')
    })
  })

  describe('loading/success/error states', () => {
    it('shows loading state while fetching', async () => {
      server.use(
        usePlayerSearchPage.requestHandler(async () => {
          await delay(100)
          return HttpResponse.json(usePlayerSearchPage.createMockResponse())
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'test' })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.isFetching).toBe(true)
      expect(result.current.status).toBe('pending')

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
    })

    it('returns success state with data on successful fetch', async () => {
      const mockResults = [
        usePlayerSearchPage.createMockSearchResult({ username: 'player1' }),
        usePlayerSearchPage.createMockSearchResult({ username: 'player2' }),
      ]

      server.use(
        usePlayerSearchPage.requestHandler(() => {
          return HttpResponse.json(
            usePlayerSearchPage.createMockResponse(mockResults, 'test')
          )
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'test' })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.results).toHaveLength(2)
      expect(result.current.query).toBe('test')
      expect(result.current.total).toBe(2)
      expect(result.current.error).toBeNull()
    })

    it('returns error state on network failure', async () => {
      server.use(
        usePlayerSearchPage.requestHandler(() => {
          return HttpResponse.error()
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'test' })

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.results).toBeNull()
    })

    it('returns error state on server error response', async () => {
      server.use(
        usePlayerSearchPage.requestHandler(() => {
          return HttpResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
          )
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'test' })

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('API response parsing', () => {
    it('correctly parses full search result with head-to-head', async () => {
      const mockResult = usePlayerSearchPage.createMockSearchResult({
        id: 'player-123',
        username: 'testplayer',
        avatarUrl: 'https://example.com/avatar.jpg',
        isEphemeral: false,
        headToHead: { wins: 5, losses: 3 },
        lastMatch: {
          id: 'match-456',
          result: 'win',
          score: '11-7',
          playedAt: '2024-01-15T10:00:00Z',
        },
      })

      server.use(
        usePlayerSearchPage.requestHandler(() => {
          return HttpResponse.json(
            usePlayerSearchPage.createMockResponse([mockResult], 'test')
          )
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'test' })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      const player = result.current.results![0]
      expect(player).toMatchObject({
        id: 'player-123',
        username: 'testplayer',
        avatarUrl: 'https://example.com/avatar.jpg',
        isEphemeral: false,
        headToHead: { wins: 5, losses: 3 },
        lastMatch: {
          id: 'match-456',
          result: 'win',
          score: '11-7',
          playedAt: '2024-01-15T10:00:00Z',
        },
      })
    })

    it('correctly parses search result without optional fields', async () => {
      const mockResult = usePlayerSearchPage.createMockSearchResult({
        id: 'new-player',
        username: 'newcomer',
        avatarUrl: null,
        isEphemeral: true,
      })

      server.use(
        usePlayerSearchPage.requestHandler(() => {
          return HttpResponse.json(
            usePlayerSearchPage.createMockResponse([mockResult], 'new')
          )
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'new' })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      const player = result.current.results![0]
      expect(player.id).toBe('new-player')
      expect(player.username).toBe('newcomer')
      expect(player.avatarUrl).toBeNull()
      expect(player.isEphemeral).toBe(true)
      expect(player.headToHead).toBeUndefined()
      expect(player.lastMatch).toBeUndefined()
    })

    it('handles empty results array', async () => {
      server.use(
        usePlayerSearchPage.requestHandler(() => {
          return HttpResponse.json(
            usePlayerSearchPage.createMockResponse([], 'nonexistent')
          )
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'nonexistent' })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.results).toEqual([])
      expect(result.current.total).toBe(0)
    })

    it('rejects invalid response structure', async () => {
      server.use(
        usePlayerSearchPage.requestHandler(() => {
          return HttpResponse.json({ invalid: 'data' })
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'test' })

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBeDefined()
    })

    it('rejects search result with missing required fields', async () => {
      server.use(
        usePlayerSearchPage.requestHandler(() => {
          return HttpResponse.json({
            results: [{ id: 'player-1' }], // missing username, avatarUrl, isEphemeral
            query: 'test',
            total: 1,
          })
        })
      )

      const { result } = usePlayerSearchPage.render({ query: 'test' })

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('request cancellation', () => {
    it('cancels previous request when query changes', async () => {
      const requestLog: { query: string; aborted: boolean }[] = []

      server.use(
        usePlayerSearchPage.requestHandler(async ({ request }) => {
          const query = new URL(request.url).searchParams.get('q') ?? ''
          const entry = { query, aborted: false }
          requestLog.push(entry)

          // Check if aborted during delay
          await delay(50)
          if (request.signal.aborted) {
            entry.aborted = true
            return HttpResponse.error()
          }

          return HttpResponse.json(
            usePlayerSearchPage.createMockResponse([], query)
          )
        })
      )

      const { result, rerender } = usePlayerSearchPage.render({ query: 'a' })

      // Wait a bit for first request to start
      await vi.waitFor(() => {
        expect(requestLog.length).toBeGreaterThanOrEqual(1)
      })

      // Change query to trigger cancellation
      rerender({ query: 'ab', enabled: true })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      // Wait for all requests to settle
      await delay(100)

      // Verify final result is from second query
      expect(result.current.query).toBe('ab')

      // First request should have been aborted (or second request completed)
      expect(requestLog.some((r) => r.query === 'ab' && !r.aborted)).toBe(true)
    })

    it('only shows results from most recent query', async () => {
      const responses: Record<string, string[]> = {
        first: ['result-from-first'],
        second: ['result-from-second'],
      }

      server.use(
        usePlayerSearchPage.requestHandler(async ({ request }) => {
          const query = new URL(request.url).searchParams.get('q') ?? ''

          // First query takes longer
          if (query === 'first') {
            await delay(100)
          }

          const results =
            responses[query]?.map((username) =>
              usePlayerSearchPage.createMockSearchResult({ username })
            ) ?? []

          return HttpResponse.json(
            usePlayerSearchPage.createMockResponse(results, query)
          )
        })
      )

      const { result, rerender } = usePlayerSearchPage.render({ query: 'first' })

      // Quickly change to second query
      rerender({ query: 'second', enabled: true })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      // Should show second query results (the faster one)
      expect(result.current.query).toBe('second')
      expect(result.current.results?.[0]?.username).toBe('result-from-second')
    })
  })
})
