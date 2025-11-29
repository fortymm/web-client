import { describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse, delay } from 'msw'
import { server } from '../test/mocks/server'
import { useCreateMatchPage } from './useCreateMatch.page'

describe('useCreateMatch', () => {
  describe('successful mutation', () => {
    it('sends payload to the correct endpoint', async () => {
      let capturedPayload: Record<string, unknown> | null = null

      server.use(
        useCreateMatchPage.requestHandler(async ({ request }) => {
          capturedPayload = await request.json() as Record<string, unknown>
          return HttpResponse.json({
            id: 'match-123',
            playerId: null,
            opponentId: null,
            matchLength: 5,
            status: 'in_progress',
            createdAt: '2024-01-15T10:30:00.000Z',
          })
        })
      )

      const { result } = useCreateMatchPage.render()

      result.current.mutate({ opponentId: null, matchLength: 5 })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(capturedPayload).toEqual({
        opponentId: null,
        matchLength: 5,
      })
    })

    it('returns parsed response with createdAt as Date', async () => {
      const isoDate = '2024-01-15T10:30:00.000Z'

      server.use(
        useCreateMatchPage.requestHandler(() => {
          return HttpResponse.json({
            id: 'match-456',
            playerId: 'player-1',
            opponentId: 'player-2',
            matchLength: 7,
            status: 'in_progress',
            createdAt: isoDate,
          })
        })
      )

      const { result } = useCreateMatchPage.render()

      result.current.mutate({ opponentId: 'player-2', matchLength: 7 })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual({
        id: 'match-456',
        playerId: 'player-1',
        opponentId: 'player-2',
        matchLength: 7,
        status: 'in_progress',
        createdAt: new Date(isoDate),
      })

      expect(result.current.data?.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('payload validation', () => {
    it('validates matchLength is one of the allowed values', async () => {
      const { result } = useCreateMatchPage.render()

      // @ts-expect-error - testing invalid payload
      result.current.mutate({ opponentId: null, matchLength: 10 })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('handles server errors', async () => {
      server.use(
        useCreateMatchPage.requestHandler(() => {
          return HttpResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          )
        })
      )

      const { result } = useCreateMatchPage.render()

      result.current.mutate({ opponentId: null, matchLength: 5 })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })

    it('handles network errors', async () => {
      server.use(
        useCreateMatchPage.requestHandler(() => {
          return HttpResponse.error()
        })
      )

      const { result } = useCreateMatchPage.render()

      result.current.mutate({ opponentId: null, matchLength: 3 })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('mutation states', () => {
    it('starts in idle state', () => {
      const { result } = useCreateMatchPage.render()

      expect(result.current.isIdle).toBe(true)
      expect(result.current.isPending).toBe(false)
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('transitions through pending state', async () => {
      server.use(
        useCreateMatchPage.requestHandler(async () => {
          await delay(50)
          return HttpResponse.json({
            id: 'match-789',
            playerId: null,
            opponentId: null,
            matchLength: 1,
            status: 'in_progress',
            createdAt: new Date().toISOString(),
          })
        })
      )

      const { result } = useCreateMatchPage.render()

      result.current.mutate({ opponentId: null, matchLength: 1 })

      // Should transition to pending
      await waitFor(() => {
        expect(result.current.isPending).toBe(true)
      })

      // Should eventually succeed
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })
})
