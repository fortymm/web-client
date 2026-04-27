import { faker } from '@faker-js/faker'
import { http, HttpResponse } from 'msw'
import type { Player } from '@/components/dashboard/data'
import type { Session } from '@/lib/api/session'

export const handlers = [
  http.get('/api/me', () => {
    const player: Player = {
      name: faker.person.fullName(),
      seed: faker.number.int({ min: 1, max: 32 }),
      rating: faker.number.int({ min: 1200, max: 2400 }),
    }
    return HttpResponse.json(player)
  }),
  http.post('*/api/v1/session', () => {
    const session: Session = {
      token: faker.string.alphanumeric(32),
      user: {
        id: faker.string.uuid(),
        username: faker.internet.username(),
      },
    }
    return HttpResponse.json(session)
  }),
]
