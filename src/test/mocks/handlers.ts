import { http, HttpResponse } from 'msw'

export const handlers = [
  // Default handler for recent opponents endpoint - returns empty list
  http.get('/api/v1/users/me/recent-opponents', () => {
    return HttpResponse.json({
      opponents: [],
      total: 0,
    })
  }),
]
