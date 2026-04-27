import createClient from 'openapi-fetch'
import type { paths } from './schema'

export const api = createClient<paths>({
  baseUrl: `${location.origin}/api`,
  fetch: (...args) => globalThis.fetch(...args),
})
