import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { server } from '../test/mocks/server'
import { useSessionPage } from './useSession.page'

describe('useSession', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  describe('initial state', () => {
    it('starts with pending status and null username', () => {
      server.use(
        useSessionPage.requestHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          return HttpResponse.json(useSessionPage.createMockResponse())
        })
      )

      const { result } = useSessionPage.render()

      expect(result.current.status).toBe('pending')
      expect(result.current.username).toBeNull()
      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('fetching session', () => {
    it('returns username on successful fetch', async () => {
      server.use(
        useSessionPage.requestHandler(() =>
          HttpResponse.json(useSessionPage.createMockResponse({ username: 'TestUser' }))
        )
      )

      const { result } = useSessionPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.username).toBe('TestUser')
      expect(result.current.isLoading).toBe(false)
    })

    it('returns Guest username by default', async () => {
      server.use(
        useSessionPage.requestHandler(() =>
          HttpResponse.json(useSessionPage.createMockResponse())
        )
      )

      const { result } = useSessionPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.username).toBe('Guest')
    })
  })

  describe('error handling', () => {
    it('sets error state on network failure', async () => {
      server.use(
        useSessionPage.requestHandler(() => HttpResponse.error())
      )

      const { result } = useSessionPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).not.toBeNull()
      expect(result.current.username).toBeNull()
    })

    it('sets error state on server error response', async () => {
      server.use(
        useSessionPage.requestHandler(() =>
          HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        )
      )

      const { result } = useSessionPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.error).not.toBeNull()
    })
  })

  describe('validation', () => {
    it('rejects invalid response structure', async () => {
      server.use(
        useSessionPage.requestHandler(() =>
          HttpResponse.json({ invalid: 'response' })
        )
      )

      const { result } = useSessionPage.render()

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })
    })
  })
})
