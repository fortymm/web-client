import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { server } from '../test/mocks/server'
import { useOpponentsPage } from './useOpponents.page'

describe('useOpponents', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  describe('initial state', () => {
    it('starts with pending status and null opponents', () => {
      server.use(
        useOpponentsPage.requestHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          return HttpResponse.json(useOpponentsPage.createMockResponse([]))
        })
      )

      const { result } = useOpponentsPage.render()

      expect(result.current.status).toBe('pending')
      expect(result.current.opponents).toBeNull()
      expect(result.current.isInitialLoading).toBe(true)
      expect(result.current.isFetching).toBe(true)
    })
  })

  describe('fetching recent opponents (no query)', () => {
    it('returns opponents on successful fetch', async () => {
      const mockOpponent = useOpponentsPage.createMockRecentOpponent({
        username: 'TestPlayer',
      })
      server.use(
        useOpponentsPage.requestHandler(() =>
          HttpResponse.json(useOpponentsPage.createMockResponse([mockOpponent]))
        )
      )

      const { result } = useOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.opponents).toHaveLength(1)
      expect(result.current.opponents![0].username).toBe('TestPlayer')
      expect(result.current.query).toBeNull()
      expect(result.current.isInitialLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
    })

    it('handles empty opponents list', async () => {
      server.use(
        useOpponentsPage.requestHandler(() =>
          HttpResponse.json(useOpponentsPage.createMockResponse([]))
        )
      )

      const { result } = useOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.opponents).toEqual([])
      expect(result.current.total).toBe(0)
    })
  })

  describe('searching opponents (with query)', () => {
    it('fetches with query parameter', async () => {
      const mockOpponent = useOpponentsPage.createMockOpponent({
        username: 'SearchResult',
      })
      server.use(
        useOpponentsPage.requestHandler(({ request }) => {
          const url = new URL(request.url)
          const query = url.searchParams.get('query')
          expect(query).toBe('john')
          return HttpResponse.json(
            useOpponentsPage.createMockResponse([mockOpponent], 'john')
          )
        })
      )

      const { result } = useOpponentsPage.render({ query: 'john' })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.opponents).toHaveLength(1)
      expect(result.current.query).toBe('john')
    })

    it('trims whitespace from query', async () => {
      server.use(
        useOpponentsPage.requestHandler(({ request }) => {
          const url = new URL(request.url)
          const query = url.searchParams.get('query')
          expect(query).toBe('test')
          return HttpResponse.json(useOpponentsPage.createMockResponse([], 'test'))
        })
      )

      const { result } = useOpponentsPage.render({ query: '  test  ' })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })
    })

    it('handles search with optional headToHead and lastMatch', async () => {
      const opponentWithHistory = useOpponentsPage.createMockOpponent({
        username: 'WithHistory',
        headToHead: { wins: 5, losses: 3 },
        lastMatch: { id: 'match-1', result: 'win', score: '11-9', playedAt: '2025-01-01' },
      })
      const opponentWithoutHistory = useOpponentsPage.createMockOpponent({
        username: 'NoHistory',
      })

      server.use(
        useOpponentsPage.requestHandler(() =>
          HttpResponse.json(
            useOpponentsPage.createMockResponse(
              [opponentWithHistory, opponentWithoutHistory],
              'test'
            )
          )
        )
      )

      const { result } = useOpponentsPage.render({ query: 'test' })

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.opponents).toHaveLength(2)
      expect(result.current.opponents![0].headToHead).toEqual({ wins: 5, losses: 3 })
      expect(result.current.opponents![1].headToHead).toBeUndefined()
    })
  })

  describe('error handling', () => {
    it('sets error state on network failure', async () => {
      server.use(
        useOpponentsPage.requestHandler(() => HttpResponse.error())
      )

      const { result } = useOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).not.toBeNull()
      expect(result.current.opponents).toBeNull()
    })

    it('sets error state on server error response', async () => {
      server.use(
        useOpponentsPage.requestHandler(() =>
          HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        )
      )

      const { result } = useOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).not.toBeNull()
    })
  })

  describe('validation', () => {
    it('rejects invalid response structure', async () => {
      server.use(
        useOpponentsPage.requestHandler(() =>
          HttpResponse.json({ invalid: 'response' })
        )
      )

      const { result } = useOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })
    })

    it('rejects opponent with missing required fields', async () => {
      server.use(
        useOpponentsPage.requestHandler(() =>
          HttpResponse.json({
            opponents: [{ id: 'player-1' }], // missing username, etc.
            query: null,
            total: 1,
          })
        )
      )

      const { result } = useOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })
    })
  })

  describe('query key differentiation', () => {
    it('uses different cache entries for different queries', async () => {
      const recentOpponent = useOpponentsPage.createMockRecentOpponent({ username: 'Recent' })
      const searchOpponent = useOpponentsPage.createMockOpponent({ username: 'SearchResult' })

      let callCount = 0
      server.use(
        useOpponentsPage.requestHandler(({ request }) => {
          callCount++
          const url = new URL(request.url)
          const query = url.searchParams.get('query')
          if (query === 'test') {
            return HttpResponse.json(
              useOpponentsPage.createMockResponse([searchOpponent], 'test')
            )
          }
          return HttpResponse.json(
            useOpponentsPage.createMockResponse([recentOpponent], null)
          )
        })
      )

      // Fetch recents
      const { result, rerender } = useOpponentsPage.render()
      await waitFor(() => expect(result.current.status).toBe('success'))
      expect(result.current.opponents![0].username).toBe('Recent')

      // Fetch search
      rerender({ query: 'test' })
      await waitFor(() => expect(result.current.opponents![0].username).toBe('SearchResult'))

      // Both requests should have been made
      expect(callCount).toBe(2)
    })
  })
})
