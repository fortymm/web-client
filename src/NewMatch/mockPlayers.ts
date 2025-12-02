import { type PlayerListPlayer } from './PlayerList'

const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery',
  'Cameron', 'Drew', 'Skyler', 'Reese', 'Finley', 'Parker', 'Sage', 'Blake',
  'Hayden', 'Peyton', 'Rowan', 'Charlie', 'Emery', 'Phoenix', 'River', 'Eden',
  'Kai', 'Lennox', 'Marley', 'Oakley', 'Remy', 'Shiloh', 'Tatum', 'Wren',
  'Arden', 'Blair', 'Corey', 'Dallas', 'Ellis', 'Frankie', 'Grey', 'Harper',
  'Indie', 'Jamie', 'Kendall', 'Logan', 'Milan', 'Nico', 'Ocean', 'Presley',
  'Raven', 'Sam',
]

const lastNames = [
  'Smith', 'Chen', 'Garcia', 'Kim', 'Patel', 'Williams', 'Johnson', 'Brown',
  'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore',
  'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis',
  'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres',
  'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
  'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans',
  'Turner', 'Diaz', 'Parker',
]

const avatarUrls = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=',
  'https://api.dicebear.com/7.x/bottts/svg?seed=',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=',
]

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomDate(daysAgo: number): string {
  const date = new Date()
  const hoursAgo = getRandomInt(0, daysAgo * 24)
  date.setHours(date.getHours() - hoursAgo)
  return date.toISOString()
}

function generateMockPlayers(count: number): PlayerListPlayer[] {
  const players: PlayerListPlayer[] = []

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[(i * 7) % lastNames.length]
    const username = `${firstName}${lastName}${i > 0 ? i : ''}`
    const id = `player-${i + 1}`

    // 20% chance of being ephemeral
    const isEphemeral = i % 5 === 4

    // 70% chance of having an avatar (non-ephemeral users)
    const hasAvatar = !isEphemeral && Math.random() < 0.7
    const avatarUrl = hasAvatar
      ? `${avatarUrls[i % avatarUrls.length]}${username}`
      : null

    // Generate head-to-head record
    const wins = getRandomInt(0, 15)
    const losses = getRandomInt(0, 15)

    // Last match result
    const result: 'win' | 'loss' = Math.random() > 0.5 ? 'win' : 'loss'
    const winnerScore = getRandomInt(11, 15)
    const loserScore = getRandomInt(0, winnerScore - 2)
    const score =
      result === 'win'
        ? `${winnerScore}–${loserScore}`
        : `${loserScore}–${winnerScore}`

    // Recency: first players played more recently
    const maxDaysAgo = Math.min(1 + Math.floor(i / 5), 30)
    const playedAt = getRandomDate(maxDaysAgo)

    players.push({
      id,
      username: isEphemeral ? 'Anonymous' : username,
      avatarUrl,
      isEphemeral,
      headToHead: { wins, losses },
      lastMatch: {
        result,
        score,
        playedAt,
      },
    })
  }

  return players
}

export const mockPlayers = generateMockPlayers(50)
