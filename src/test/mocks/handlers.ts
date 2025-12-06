import { http, HttpResponse } from 'msw'

export const handlers = [
  // Default handler for opponents endpoint - returns empty list
  http.get('/api/v1/matches/new/opponents', () => {
    return HttpResponse.json({
      opponents: [],
      query: null,
      total: 0,
    })
  }),
]
