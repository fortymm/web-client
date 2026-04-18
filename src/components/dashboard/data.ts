export type DashboardState =
  | 'idle'
  | 'live_match'
  | 'in_tournament'
  | 'in_tournament_playing'
  | 'td'
  | 'td_playing'

export const DASHBOARD_STATES = [
  'idle',
  'live_match',
  'in_tournament',
  'in_tournament_playing',
  'td',
  'td_playing',
] as const satisfies readonly DashboardState[]

export type PathResult = 'W' | 'L' | 'bye' | 'live' | 'upcoming' | 'locked'

export type GameScore = {
  me: number
  them: number
  winner: 'me' | 'them' | null
}

export type Player = {
  name: string
  seed: number
  rating: number
}

export type Opponent = Player & {
  club: string
  hand: 'Right' | 'Left'
  style: string
  h2h: { w: number; l: number }
}

export type LiveMatch = {
  court: number
  round: string
  event: string
  bestOf: number
  serving: 'me' | 'them'
  games: GameScore[]
  opponent: Opponent
  me: Player
  timer: string
  startedAt: string
}

export type PathStep = {
  round: string
  opponent: string
  score: string | null
  result: PathResult
  games?: string
  detail?: string
  eta?: string
}

export type UpNext = {
  court: number
  time: string
  a: string
  b: string
  round: string
  you: boolean
  note?: string
}

export type Tournament = {
  name: string
  venue: string
  day: number
  ofDays: number
  format: string
  status: string
  myPath: PathStep[]
  upNext: UpNext[]
  bracket: { yourSeed: number; remaining: number; toWin: number }
  standings: { placed: number; of: number; reachedAtLeast: string }
}

export type NeedsYouKind = 'score' | 'call' | 'nudge'

export type CourtStatus =
  | {
      n: number
      state: 'live'
      a: string
      b: string
      g: number
      sa: number
      sb: number
      win: 'a' | 'b' | null
      you?: boolean
    }
  | { n: number; state: 'open'; next: string }
  | { n: number; state: 'setup' }

export type TDEvent = {
  name: string
  role: string
  courts: { total: number; live: number; open: number; setup: number }
  schedule: { onTime: boolean; drift: string; behind: number; ahead: number }
  players: { checkedIn: number; total: number; noShow: number }
  matches: { done: number; live: number; upcoming: number; unscored: number }
  solver: {
    status: string
    horizon: string
    ms: number
    conflicts: number
  }
  needsYou: {
    kind: NeedsYouKind
    label: string
    detail: string
    urgent: boolean
  }[]
  courtStatus: CourtStatus[]
}

export type RecentMatch = {
  when: string
  opponent: string
  result: 'W' | 'L'
  score: string
  delta: number
  event: string
}

export type ClubFeedItem = {
  id: number
  who: string
  initials: string
  text: string
  meta: string
  when: string
  tone?: 'win' | 'announce' | 'milestone'
}

export type StateLabel = {
  key: DashboardState
  label: string
  sub: string
}

export const ME = {
  name: 'Thuy Nguyen',
  handle: '@thuy',
  initials: 'TN',
  rating: 1847,
  ratingDelta: +23,
  club: 'Eastside TTC',
  record: { w: 42, l: 18 },
  streak: 4,
  rank: { club: 3, region: 42 },
} as const

export const LIVE_MATCH: LiveMatch = {
  court: 3,
  round: 'R16',
  event: 'Spring Open 2026',
  bestOf: 5,
  serving: 'me',
  games: [
    { me: 11, them: 7, winner: 'me' },
    { me: 9, them: 11, winner: 'them' },
    { me: 11, them: 8, winner: 'me' },
    { me: 6, them: 4, winner: null },
  ],
  opponent: {
    name: 'Rafael Silva',
    seed: 16,
    rating: 1792,
    club: 'Riverside TT',
    hand: 'Right',
    style: 'Defensive chopper',
    h2h: { w: 2, l: 1 },
  },
  me: {
    name: 'Thuy Nguyen',
    seed: 1,
    rating: 1847,
  },
  timer: '23:14',
  startedAt: '6:42 PM',
}

export const TOURNAMENT: Tournament = {
  name: 'Spring Open 2026',
  venue: 'Eastside Sports Complex',
  day: 2,
  ofDays: 2,
  format: '64-draw, single elim',
  status: 'Day 2 · Quarterfinals soon',
  myPath: [
    { round: 'R64', opponent: 'Bye', score: null, result: 'bye' },
    {
      round: 'R32',
      opponent: 'L. Tran',
      score: '3–0',
      result: 'W',
      games: '11-6, 11-8, 11-9',
    },
    {
      round: 'R16',
      opponent: 'R. Silva',
      score: '2–1',
      result: 'live',
      detail: 'game 4 · 6-4',
    },
    {
      round: 'QF',
      opponent: 'Winner R16·4',
      score: null,
      result: 'upcoming',
      eta: '~7:40 PM · Court 3',
    },
    { round: 'SF', opponent: 'TBD', score: null, result: 'locked' },
    { round: 'F', opponent: 'TBD', score: null, result: 'locked' },
  ],
  upNext: [
    {
      court: 3,
      time: '7:42 PM',
      a: 'Nguyen, T.',
      b: 'Winner R16·4',
      round: 'QF',
      you: true,
      note: 'after your current match',
    },
    {
      court: 2,
      time: '7:55 PM',
      a: 'Kim, H.',
      b: 'Dubois, C.',
      round: 'QF',
      you: false,
    },
    {
      court: 1,
      time: '8:20 PM',
      a: 'Tran, L.',
      b: 'Rossi, G.',
      round: 'QF',
      you: false,
    },
  ],
  bracket: { yourSeed: 1, remaining: 8, toWin: 3 },
  standings: { placed: 1, of: 64, reachedAtLeast: 'R16' },
}

export const TD_EVENT: TDEvent = {
  name: 'Spring Open 2026',
  role: 'Tournament Director',
  courts: { total: 8, live: 4, open: 2, setup: 2 },
  schedule: { onTime: true, drift: '+2m', behind: 0, ahead: 0 },
  players: { checkedIn: 58, total: 64, noShow: 1 },
  matches: { done: 48, live: 4, upcoming: 12, unscored: 1 },
  solver: { status: 'optimal', horizon: '4h 14m', ms: 234, conflicts: 0 },
  needsYou: [
    {
      kind: 'score',
      label: 'Unscored match — Court 5',
      detail: 'Finished 18 min ago',
      urgent: true,
    },
    {
      kind: 'call',
      label: 'Call Kim, H. vs Ali, R.',
      detail: 'Court 4 · in 3 min',
      urgent: false,
    },
    {
      kind: 'nudge',
      label: "Chen, W. hasn't checked in",
      detail: 'QF at 7:55 PM',
      urgent: true,
    },
  ],
  courtStatus: [
    {
      n: 1,
      state: 'live',
      a: 'Tran, L.',
      b: 'Rossi, G.',
      g: 4,
      sa: 11,
      sb: 8,
      win: 'a',
    },
    {
      n: 2,
      state: 'live',
      a: 'Okafor, D.',
      b: 'Johansen, A.',
      g: 2,
      sa: 9,
      sb: 11,
      win: 'b',
    },
    {
      n: 3,
      state: 'live',
      a: 'Nguyen, T.',
      b: 'Silva, R.',
      g: 4,
      sa: 6,
      sb: 4,
      win: null,
      you: true,
    },
    {
      n: 4,
      state: 'live',
      a: 'Chen, W.',
      b: 'Park, J.',
      g: 1,
      sa: 7,
      sb: 6,
      win: 'a',
    },
    { n: 5, state: 'open', next: 'Kim, H. vs Ali, R.' },
    { n: 6, state: 'open', next: 'Dubois, C. vs Patel, M.' },
    { n: 7, state: 'setup' },
    { n: 8, state: 'setup' },
  ],
}

export const RECENT_MATCHES: RecentMatch[] = [
  {
    when: 'Yesterday',
    opponent: 'L. Tran',
    result: 'W',
    score: '3–0',
    delta: +14,
    event: 'Spring Open · R32',
  },
  {
    when: 'Yesterday',
    opponent: 'R. Silva',
    result: 'W',
    score: '3–2',
    delta: +18,
    event: 'Club ladder',
  },
  {
    when: 'Sat, Apr 12',
    opponent: 'M. Patel',
    result: 'L',
    score: '1–3',
    delta: -9,
    event: 'Friendly',
  },
  {
    when: 'Fri, Apr 11',
    opponent: 'D. Okafor',
    result: 'W',
    score: '3–1',
    delta: +11,
    event: 'Club ladder',
  },
  {
    when: 'Thu, Apr 10',
    opponent: 'J. Park',
    result: 'W',
    score: '3–2',
    delta: +8,
    event: 'Friendly',
  },
]

export const CLUB_FEED: ClubFeedItem[] = [
  {
    id: 1,
    who: 'Mika',
    initials: 'MK',
    text: 'logged a match vs D. Okafor',
    meta: 'W 3–1 · +11',
    when: '12 min ago',
    tone: 'win',
  },
  {
    id: 2,
    who: 'Rafael',
    initials: 'RS',
    text: 'checked in for Spring Open',
    meta: 'seed #16',
    when: '1 hr ago',
  },
  {
    id: 3,
    who: 'Eastside TTC',
    initials: '●',
    text: 'Wed night league needs 2 more — anyone in?',
    meta: '',
    when: '3 hr ago',
    tone: 'announce',
  },
  {
    id: 4,
    who: 'Hanna',
    initials: 'HK',
    text: 'hit 1900 for the first time',
    meta: '+42 streak',
    when: 'yesterday',
    tone: 'milestone',
  },
]

export const STATE_LABELS: Record<DashboardState, StateLabel> = {
  idle: { key: 'idle', label: 'Idle', sub: 'No match. No tournament.' },
  live_match: {
    key: 'live_match',
    label: 'Live match',
    sub: "You're on court right now.",
  },
  in_tournament: {
    key: 'in_tournament',
    label: 'In tournament',
    sub: 'Between matches.',
  },
  in_tournament_playing: {
    key: 'in_tournament_playing',
    label: 'In tournament · playing',
    sub: 'On court, in an active draw.',
  },
  td: {
    key: 'td',
    label: 'Tournament director',
    sub: 'Running an event.',
  },
  td_playing: {
    key: 'td_playing',
    label: 'TD · also playing',
    sub: "You're on court in your own event.",
  },
}
