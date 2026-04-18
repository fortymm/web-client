export type OpponentPlayer = {
  id: string
  name: string
  initials: string
  rating: number
  club: string
  lastPlayed: string
  recent: boolean
  isGuest?: false
}

export type GuestOpponent = {
  id: 'guest' | 'tbd'
  name: string
  initials: string
  rating: null
  club: ''
  lastPlayed: ''
  recent: false
  isGuest: true
}

export type Opponent = OpponentPlayer | GuestOpponent

export const GUEST_OPPONENT: GuestOpponent = {
  id: 'guest',
  name: 'Guest player',
  initials: '?',
  rating: null,
  club: '',
  lastPlayed: '',
  recent: false,
  isGuest: true,
}

export const TBD_OPPONENT: GuestOpponent = {
  id: 'tbd',
  name: 'Opponent TBD',
  initials: '?',
  rating: null,
  club: '',
  lastPlayed: '',
  recent: false,
  isGuest: true,
}

export type BestOf = 1 | 3 | 5 | 7

export const BEST_OF_OPTIONS: ReadonlyArray<{
  n: BestOf
  label: string
}> = [
  { n: 1, label: 'SINGLE' },
  { n: 3, label: 'SHORT' },
  { n: 5, label: 'STD' },
  { n: 7, label: 'LONG' },
]

export const PLAYERS: OpponentPlayer[] = [
  {
    id: 'p1',
    name: 'Nguyen, T.',
    initials: 'NT',
    rating: 2145,
    club: 'Hanoi TT',
    lastPlayed: '3 days ago',
    recent: true,
  },
  {
    id: 'p2',
    name: 'Okafor, D.',
    initials: 'OD',
    rating: 1988,
    club: 'Lagos Club',
    lastPlayed: '1 week ago',
    recent: true,
  },
  {
    id: 'p3',
    name: 'Silva, R.',
    initials: 'SR',
    rating: 1820,
    club: 'São Paulo',
    lastPlayed: 'Yesterday',
    recent: true,
  },
  {
    id: 'p4',
    name: 'Patel, M.',
    initials: 'PM',
    rating: 1756,
    club: 'Hanoi TT',
    lastPlayed: '2 weeks ago',
    recent: true,
  },
  {
    id: 'p5',
    name: 'Johansen, A.',
    initials: 'JA',
    rating: 1912,
    club: 'Oslo Bat',
    lastPlayed: '—',
    recent: false,
  },
  {
    id: 'p6',
    name: 'Chen, W.',
    initials: 'CW',
    rating: 1680,
    club: 'Hanoi TT',
    lastPlayed: '—',
    recent: false,
  },
  {
    id: 'p7',
    name: 'Park, J.',
    initials: 'PJ',
    rating: 2041,
    club: 'Seoul Open',
    lastPlayed: '—',
    recent: false,
  },
  {
    id: 'p8',
    name: 'Tran, L.',
    initials: 'TL',
    rating: 1604,
    club: 'Hanoi TT',
    lastPlayed: '—',
    recent: false,
  },
  {
    id: 'p9',
    name: 'Rossi, G.',
    initials: 'RG',
    rating: 1845,
    club: 'Roma TT',
    lastPlayed: '—',
    recent: false,
  },
  {
    id: 'p10',
    name: 'Dubois, C.',
    initials: 'DC',
    rating: 1720,
    club: 'Paris Smash',
    lastPlayed: '—',
    recent: false,
  },
]

export function estimateRatingDelta(
  myRating: number,
  oppRating: number,
): number {
  const diff = oppRating - myRating
  const base = 16
  const mod = Math.max(-8, Math.min(8, Math.round(diff / 60)))
  return base + mod
}
