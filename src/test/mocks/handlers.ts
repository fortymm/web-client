import { http, HttpResponse } from 'msw'

export const handlers = [
  // Default handler for player results endpoint - returns empty list
  http.get('/api/v1/users/players', () => {
    return HttpResponse.json({
      players: [],
      query: '',
      total: 0,
    })
  }),
]
