import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { server } from './mocks/server'
import { resetDb, clearAllMatches } from '@lib/matchesDb'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

beforeEach(async () => {
  await clearAllMatches()
})

afterEach(async () => {
  server.resetHandlers()
  await resetDb()
})

afterAll(() => server.close())
