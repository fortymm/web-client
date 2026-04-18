import { faker } from '@faker-js/faker'
import { http, HttpResponse } from 'msw'
import type { Player } from '@/components/dashboard/data'
import { PLAYERS } from '@/components/new-match/data'

export const handlers = [
  http.get('/api/me', () => {
    const player: Player = {
      name: faker.person.fullName(),
      seed: faker.number.int({ min: 1, max: 32 }),
      rating: faker.number.int({ min: 1200, max: 2400 }),
    }
    return HttpResponse.json(player)
  }),

  http.get('/api/players', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.trim().toLowerCase() ?? ''
    const matches = q
      ? PLAYERS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.club.toLowerCase().includes(q),
        )
      : PLAYERS.filter((p) => p.recent)
    return HttpResponse.json(matches)
  }),
]
