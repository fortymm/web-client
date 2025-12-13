import { faker } from '@faker-js/faker'
import { type Opponent } from '../../hooks/useOpponents'

export function buildOpponent(overrides: Partial<Opponent> = {}): Opponent {
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    avatarUrl: faker.helpers.arrayElement([null, faker.image.avatar()]),
    isEphemeral: faker.datatype.boolean(),
    headToHead: {
      wins: faker.number.int({ min: 0, max: 20 }),
      losses: faker.number.int({ min: 0, max: 20 }),
    },
    lastMatch: {
      id: faker.string.uuid(),
      result: faker.helpers.arrayElement(['win', 'loss'] as const),
      score: `${faker.number.int({ min: 0, max: 11 })}-${faker.number.int({ min: 0, max: 11 })}`,
      playedAt: faker.date.recent({ days: 30 }).toISOString(),
    },
    ...overrides,
  }
}

export function buildOpponents(count: number, overrides: Partial<Opponent> = {}): Opponent[] {
  return Array.from({ length: count }, () => buildOpponent(overrides))
}
