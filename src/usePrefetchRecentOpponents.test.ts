import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { HttpResponse } from 'msw'
import { server } from './test/mocks/server'
import { usePrefetchRecentOpponentsPage } from './usePrefetchRecentOpponents.page'
import { useOpponentsPage } from './hooks/useOpponents.page'

describe('usePrefetchRecentOpponents', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it('prefetches recent opponents on mount', async () => {
    const mockOpponent = useOpponentsPage.createMockRecentOpponent({
      username: 'PrefetchedPlayer',
    })
    server.use(
      usePrefetchRecentOpponentsPage.requestHandler(() =>
        HttpResponse.json(useOpponentsPage.createMockResponse([mockOpponent]))
      )
    )

    const { queryClient } = usePrefetchRecentOpponentsPage.render()

    await usePrefetchRecentOpponentsPage.waitForPrefetch(queryClient)

    const data = usePrefetchRecentOpponentsPage.getQueryData(queryClient)
    expect(data).toEqual({
      opponents: [mockOpponent],
      query: null,
      total: 1,
    })
  })

  it('caches data for subsequent useOpponents calls', async () => {
    const mockOpponent = useOpponentsPage.createMockRecentOpponent({
      username: 'CachedPlayer',
    })
    let requestCount = 0
    server.use(
      usePrefetchRecentOpponentsPage.requestHandler(() => {
        requestCount++
        return HttpResponse.json(useOpponentsPage.createMockResponse([mockOpponent]))
      })
    )

    const { queryClient } = usePrefetchRecentOpponentsPage.render()
    await usePrefetchRecentOpponentsPage.waitForPrefetch(queryClient)

    // Now render useOpponents with the same queryClient - should use cached data
    const { result } = useOpponentsPage.render({ queryClient })

    // Data should be immediately available from cache
    expect(result.current.opponents).toEqual([mockOpponent])
    expect(result.current.status).toBe('success')

    // Only one request should have been made (from the prefetch)
    expect(requestCount).toBe(1)
  })

  it('handles empty opponents list', async () => {
    server.use(
      usePrefetchRecentOpponentsPage.requestHandler(() =>
        HttpResponse.json(useOpponentsPage.createMockResponse([]))
      )
    )

    const { queryClient } = usePrefetchRecentOpponentsPage.render()
    await usePrefetchRecentOpponentsPage.waitForPrefetch(queryClient)

    const data = usePrefetchRecentOpponentsPage.getQueryData(queryClient)
    expect(data).toEqual({
      opponents: [],
      query: null,
      total: 0,
    })
  })

  it('handles network errors gracefully', async () => {
    server.use(
      usePrefetchRecentOpponentsPage.requestHandler(() => HttpResponse.error())
    )

    const { queryClient } = usePrefetchRecentOpponentsPage.render()
    await usePrefetchRecentOpponentsPage.waitForPrefetch(queryClient)

    const state = usePrefetchRecentOpponentsPage.getQueryState(queryClient)
    expect(state?.status).toBe('error')
  })
})
