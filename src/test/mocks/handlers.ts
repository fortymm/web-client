import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/v1/matches', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>

    return HttpResponse.json({
      id: 'match-123',
      playerId: body.playerId ?? null,
      opponentId: body.opponentId ?? null,
      matchLength: body.matchLength,
      status: body.status,
      createdAt: new Date().toISOString(),
    })
  }),
]
