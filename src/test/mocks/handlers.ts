import { HttpResponse } from 'msw'
import { useCreateMatchPage } from '../../NewMatch/useCreateMatch.page'

export const handlers = [
  useCreateMatchPage.requestHandler(async ({ request }) => {
    const body = await request.json() as Record<string, unknown>

    return HttpResponse.json({
      id: 'match-123',
      playerId: body.playerId ?? null,
      opponentId: body.opponentId ?? null,
      matchLength: body.matchLength,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    })
  }),
]
