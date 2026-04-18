import { faker } from '@faker-js/faker'
import { http, HttpResponse } from 'msw'
import type { Player } from '@/components/dashboard/data'

export const handlers = [
  http.get('/api/me', () => {
    const player: Player = {
      name: faker.person.fullName(),
      seed: faker.number.int({ min: 1, max: 32 }),
      rating: faker.number.int({ min: 1200, max: 2400 }),
    }
    return HttpResponse.json(player)
  }),
]
