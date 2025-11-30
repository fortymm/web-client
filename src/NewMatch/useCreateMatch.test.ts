import { describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { useCreateMatchPage } from './useCreateMatch.page'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

describe('useCreateMatch', () => {

  describe('successful mutation', () => {
    it('saves match to IndexedDB', async () => {
      const { result } = useCreateMatchPage.render()
      const id = crypto.randomUUID()

      result.current.mutate({ id, opponentId: null, matchLength: 5 })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const storedMatch = await useCreateMatchPage.getStoredMatch(id)
      expect(storedMatch).toBeDefined()
      expect(storedMatch!.id).toBe(id)
      expect(storedMatch!.opponentId).toBeNull()
      expect(storedMatch!.matchLength).toBe(5)
      expect(storedMatch!.status).toBe('in_progress')
    })

    it('returns match data with createdAt as Date', async () => {
      const { result } = useCreateMatchPage.render()
      const id = crypto.randomUUID()

      result.current.mutate({ id, opponentId: 'player-2', matchLength: 7 })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toMatchObject({
        id,
        playerId: null,
        opponentId: 'player-2',
        matchLength: 7,
        status: 'in_progress',
      })

      expect(result.current.data?.createdAt).toBeInstanceOf(Date)
    })

    it('stores match with correct id format', async () => {
      const { result } = useCreateMatchPage.render()
      const id = crypto.randomUUID()

      result.current.mutate({ id, opponentId: null, matchLength: 3 })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const storedMatch = await useCreateMatchPage.getStoredMatch(id)
      expect(storedMatch!.id).toMatch(UUID_REGEX)
    })
  })

  describe('payload validation', () => {
    it('validates matchLength is one of the allowed values', async () => {
      const { result } = useCreateMatchPage.render()

      // @ts-expect-error - testing invalid payload
      result.current.mutate({ id: crypto.randomUUID(), opponentId: null, matchLength: 10 })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })

    it('validates id is a valid UUID', async () => {
      const { result } = useCreateMatchPage.render()

      // Testing invalid UUID format - Zod will reject this at runtime
      result.current.mutate({ id: 'not-a-uuid', opponentId: null, matchLength: 5 })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
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

    it('transitions to success state after mutation', async () => {
      const { result } = useCreateMatchPage.render()

      result.current.mutate({ id: crypto.randomUUID(), opponentId: null, matchLength: 1 })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })
})
