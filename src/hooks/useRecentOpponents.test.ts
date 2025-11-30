import { describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { server } from '../test/mocks/server'
import { useRecentOpponentsPage } from './useRecentOpponents.page'

describe('useRecentOpponents', () => {
  describe('initial state', () => {
    it('starts with pending status and null opponents', () => {
      server.use(
        useRecentOpponentsPage.requestHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          return HttpResponse.json(useRecentOpponentsPage.createMockResponse())
        })
      )

      const { result } = useRecentOpponentsPage.render()

      expect(result.current.status).toBe('pending')
      expect(result.current.opponents).toBeNull()
      expect(result.current.isInitialLoading).toBe(true)
      expect(result.current.isRefetching).toBe(false)
    })
  })

  describe('successful fetch', () => {
    it('returns opponents on successful fetch', async () => {
      const mockOpponent = useRecentOpponentsPage.createMockOpponent({
        id: 'opponent-1',
        username: 'player1',
        headToHead: { wins: 3, losses: 2 },
        lastMatch: {
          id: 'match-1',
          result: 'win',
          score: '11-7',
          playedAt: '2024-01-15T10:00:00Z',
        },
      })

      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.json(
            useRecentOpponentsPage.createMockResponse([mockOpponent])
          )
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.opponents).toHaveLength(1)
      expect(result.current.opponents![0]).toMatchObject({
        id: 'opponent-1',
        username: 'player1',
        headToHead: { wins: 3, losses: 2 },
        lastMatch: {
          id: 'match-1',
          result: 'win',
          score: '11-7',
          playedAt: '2024-01-15T10:00:00Z',
        },
      })
      expect(result.current.isInitialLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('handles multiple opponents', async () => {
      const opponents = [
        useRecentOpponentsPage.createMockOpponent({ id: 'op-1', username: 'alice' }),
        useRecentOpponentsPage.createMockOpponent({ id: 'op-2', username: 'bob' }),
        useRecentOpponentsPage.createMockOpponent({ id: 'op-3', username: 'charlie' }),
      ]

      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.json(
            useRecentOpponentsPage.createMockResponse(opponents)
          )
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.opponents).toHaveLength(3)
      expect(result.current.opponents!.map((o) => o.username)).toEqual([
        'alice',
        'bob',
        'charlie',
      ])
    })

    it('handles empty opponents list', async () => {
      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.json(useRecentOpponentsPage.createMockResponse([]))
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.opponents).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('handles ephemeral (anonymous) users', async () => {
      const ephemeralOpponent = useRecentOpponentsPage.createMockOpponent({
        id: 'anon-1',
        username: 'Anonymous',
        isEphemeral: true,
        avatarUrl: null,
      })

      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.json(
            useRecentOpponentsPage.createMockResponse([ephemeralOpponent])
          )
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.opponents![0].isEphemeral).toBe(true)
      expect(result.current.opponents![0].avatarUrl).toBeNull()
    })
  })

  describe('error handling', () => {
    it('sets error state on network failure', async () => {
      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.error()
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.opponents).toBeNull()
    })

    it('sets error state on server error response', async () => {
      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
          )
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('validation', () => {
    it('rejects invalid response structure', async () => {
      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.json({ invalid: 'data' })
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBeDefined()
    })

    it('rejects opponent with missing required fields', async () => {
      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.json({
            opponents: [{ id: 'op-1' }], // missing username, headToHead, lastMatch
            total: 1,
          })
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBeDefined()
    })

    it('rejects invalid lastMatch result value', async () => {
      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.json({
            opponents: [
              {
                id: 'op-1',
                username: 'test',
                avatarUrl: null,
                isEphemeral: false,
                headToHead: { wins: 0, losses: 0 },
                lastMatch: {
                  id: 'match-1',
                  result: 'draw', // invalid - should be 'win' or 'loss'
                  score: '11-11',
                  playedAt: '2024-01-15T10:00:00Z',
                },
              },
            ],
            total: 1,
          })
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('refetch behavior', () => {
    it('provides refetch function', async () => {
      server.use(
        useRecentOpponentsPage.requestHandler(() => {
          return HttpResponse.json(useRecentOpponentsPage.createMockResponse([]))
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(typeof result.current.refetch).toBe('function')
    })

    it('sets isRefetching when refetching with existing data', async () => {
      let callCount = 0

      server.use(
        useRecentOpponentsPage.requestHandler(async () => {
          callCount++
          if (callCount === 2) {
            await new Promise((resolve) => setTimeout(resolve, 100))
          }
          return HttpResponse.json(
            useRecentOpponentsPage.createMockResponse([
              useRecentOpponentsPage.createMockOpponent({ username: `user-${callCount}` }),
            ])
          )
        })
      )

      const { result } = useRecentOpponentsPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.opponents![0].username).toBe('user-1')

      // Trigger refetch
      result.current.refetch()

      await waitFor(() => {
        expect(result.current.isRefetching).toBe(true)
      })

      // Data should still be available during refetch
      expect(result.current.opponents).not.toBeNull()
      expect(result.current.isInitialLoading).toBe(false)

      await waitFor(() => {
        expect(result.current.isRefetching).toBe(false)
      })

      expect(result.current.opponents![0].username).toBe('user-2')
    })
  })

  describe('derived state', () => {
    it('isInitialLoading is true only when loading without data', async () => {
      server.use(
        useRecentOpponentsPage.requestHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 50))
          return HttpResponse.json(useRecentOpponentsPage.createMockResponse([]))
        })
      )

      const { result } = useRecentOpponentsPage.render()

      // Initially loading
      expect(result.current.isInitialLoading).toBe(true)
      expect(result.current.opponents).toBeNull()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      // After success, isInitialLoading should be false
      expect(result.current.isInitialLoading).toBe(false)
    })
  })
})
