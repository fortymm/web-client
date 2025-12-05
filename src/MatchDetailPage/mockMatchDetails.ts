import { z } from 'zod'

// Match status enum
export const matchStatusSchema = z.enum([
  'pending',
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
])

export type MatchStatus = z.infer<typeof matchStatusSchema>

// Match format enum
export const matchFormatSchema = z.enum(['singles', 'doubles'])

export type MatchFormat = z.infer<typeof matchFormatSchema>

// Match length (best of N)
export const matchLengthSchema = z.union([
  z.literal(1),
  z.literal(3),
  z.literal(5),
  z.literal(7),
])

export type MatchLength = z.infer<typeof matchLengthSchema>

// Participant schema
export const participantSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  rating: z.number().nullable(),
  ratingChange: z.number().nullable(),
  isYou: z.boolean(),
  isPlaceholder: z.boolean(),
  isWinner: z.boolean().nullable(),
})

export type Participant = z.infer<typeof participantSchema>

// Context entity (tournament, league, club)
export const contextEntitySchema = z.object({
  id: z.string(),
  type: z.enum(['tournament', 'league', 'club']),
  name: z.string(),
  url: z.string(),
})

export type ContextEntity = z.infer<typeof contextEntitySchema>

// Activity item schema
export const activityItemSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(['created', 'scheduled', 'table_assigned', 'started', 'completed', 'cancelled', 'note']),
  description: z.string(),
  actor: z.string().nullable(),
})

export type ActivityItem = z.infer<typeof activityItemSchema>

// Permissions schema
export const permissionsSchema = z.object({
  canEdit: z.boolean(),
  canEditParticipants: z.boolean(),
  canCancel: z.boolean(),
  canMarkNoShow: z.boolean(),
  canDelete: z.boolean(),
})

export type Permissions = z.infer<typeof permissionsSchema>

// Full match details schema
export const matchDetailsSchema = z.object({
  id: z.string(),
  status: matchStatusSchema,
  format: matchFormatSchema,
  matchLength: matchLengthSchema,
  participants: z.tuple([participantSchema, participantSchema]),
  finalScore: z.tuple([z.number(), z.number()]).nullable(),
  location: z.object({
    name: z.string(),
    tableNumber: z.number().nullable(),
  }).nullable(),
  timestamps: z.object({
    created: z.string(),
    scheduled: z.string().nullable(),
    started: z.string().nullable(),
    completed: z.string().nullable(),
  }),
  context: z.array(contextEntitySchema),
  activity: z.array(activityItemSchema),
  notes: z.array(z.object({
    id: z.string(),
    text: z.string(),
    author: z.string(),
    timestamp: z.string(),
  })),
  permissions: permissionsSchema,
})

export type MatchDetails = z.infer<typeof matchDetailsSchema>

// Mock data variants

export const pendingMatch: MatchDetails = {
  id: 'match-pending-001',
  status: 'pending',
  format: 'singles',
  matchLength: 5,
  participants: [
    {
      id: 'player-001',
      name: 'Alex Johnson',
      avatarUrl: null,
      rating: 1850,
      ratingChange: null,
      isYou: true,
      isPlaceholder: false,
      isWinner: null,
    },
    {
      id: 'player-tbd',
      name: 'Opponent to be assigned',
      avatarUrl: null,
      rating: null,
      ratingChange: null,
      isYou: false,
      isPlaceholder: true,
      isWinner: null,
    },
  ],
  finalScore: null,
  location: null,
  timestamps: {
    created: '2025-12-05T10:30:00Z',
    scheduled: null,
    started: null,
    completed: null,
  },
  context: [
    {
      id: 'tournament-001',
      type: 'tournament',
      name: 'Winter Open 2025',
      url: '/tournaments/tournament-001',
    },
  ],
  activity: [
    {
      id: 'activity-001',
      timestamp: '2025-12-05T10:30:00Z',
      type: 'created',
      description: 'Match created',
      actor: 'Tournament Director',
    },
  ],
  notes: [],
  permissions: {
    canEdit: true,
    canEditParticipants: true,
    canCancel: true,
    canMarkNoShow: false,
    canDelete: true,
  },
}

export const scheduledMatch: MatchDetails = {
  id: 'match-scheduled-001',
  status: 'scheduled',
  format: 'singles',
  matchLength: 5,
  participants: [
    {
      id: 'player-001',
      name: 'Alex Johnson',
      avatarUrl: null,
      rating: 1850,
      ratingChange: null,
      isYou: true,
      isPlaceholder: false,
      isWinner: null,
    },
    {
      id: 'player-002',
      name: 'Marcus Chen',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=MC',
      rating: 1920,
      ratingChange: null,
      isYou: false,
      isPlaceholder: false,
      isWinner: null,
    },
  ],
  finalScore: null,
  location: {
    name: 'Spin Chicago',
    tableNumber: 3,
  },
  timestamps: {
    created: '2025-12-04T14:00:00Z',
    scheduled: '2025-12-05T18:00:00Z',
    started: null,
    completed: null,
  },
  context: [
    {
      id: 'league-001',
      type: 'league',
      name: 'Chicago Masters League',
      url: '/leagues/league-001',
    },
    {
      id: 'club-001',
      type: 'club',
      name: 'Spin Chicago',
      url: '/clubs/club-001',
    },
  ],
  activity: [
    {
      id: 'activity-001',
      timestamp: '2025-12-04T14:00:00Z',
      type: 'created',
      description: 'Match created',
      actor: 'League Admin',
    },
    {
      id: 'activity-002',
      timestamp: '2025-12-04T14:30:00Z',
      type: 'scheduled',
      description: 'Match scheduled for Dec 5, 2025 at 6:00 PM',
      actor: 'League Admin',
    },
    {
      id: 'activity-003',
      timestamp: '2025-12-05T09:00:00Z',
      type: 'table_assigned',
      description: 'Assigned to Table 3',
      actor: 'Venue Staff',
    },
  ],
  notes: [
    {
      id: 'note-001',
      text: 'Both players confirmed attendance.',
      author: 'League Admin',
      timestamp: '2025-12-04T16:00:00Z',
    },
  ],
  permissions: {
    canEdit: true,
    canEditParticipants: false,
    canCancel: true,
    canMarkNoShow: true,
    canDelete: false,
  },
}

export const inProgressMatch: MatchDetails = {
  id: 'match-inprogress-001',
  status: 'in_progress',
  format: 'singles',
  matchLength: 5,
  participants: [
    {
      id: 'player-001',
      name: 'Alex Johnson',
      avatarUrl: null,
      rating: 1850,
      ratingChange: null,
      isYou: true,
      isPlaceholder: false,
      isWinner: null,
    },
    {
      id: 'player-003',
      name: 'Sarah Williams',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SW',
      rating: 1780,
      ratingChange: null,
      isYou: false,
      isPlaceholder: false,
      isWinner: null,
    },
  ],
  finalScore: null,
  location: {
    name: 'Spin Chicago',
    tableNumber: 5,
  },
  timestamps: {
    created: '2025-12-05T11:00:00Z',
    scheduled: '2025-12-05T14:00:00Z',
    started: '2025-12-05T14:05:00Z',
    completed: null,
  },
  context: [
    {
      id: 'club-001',
      type: 'club',
      name: 'Spin Chicago',
      url: '/clubs/club-001',
    },
  ],
  activity: [
    {
      id: 'activity-001',
      timestamp: '2025-12-05T11:00:00Z',
      type: 'created',
      description: 'Match created',
      actor: 'Alex Johnson',
    },
    {
      id: 'activity-002',
      timestamp: '2025-12-05T11:05:00Z',
      type: 'scheduled',
      description: 'Match scheduled for Dec 5, 2025 at 2:00 PM',
      actor: 'Alex Johnson',
    },
    {
      id: 'activity-003',
      timestamp: '2025-12-05T14:00:00Z',
      type: 'table_assigned',
      description: 'Assigned to Table 5',
      actor: 'Venue Staff',
    },
    {
      id: 'activity-004',
      timestamp: '2025-12-05T14:05:00Z',
      type: 'started',
      description: 'Match started',
      actor: null,
    },
  ],
  notes: [],
  permissions: {
    canEdit: false,
    canEditParticipants: false,
    canCancel: true,
    canMarkNoShow: false,
    canDelete: false,
  },
}

export const completedMatch: MatchDetails = {
  id: 'match-completed-001',
  status: 'completed',
  format: 'singles',
  matchLength: 5,
  participants: [
    {
      id: 'player-001',
      name: 'Alex Johnson',
      avatarUrl: null,
      rating: 1862,
      ratingChange: 12,
      isYou: true,
      isPlaceholder: false,
      isWinner: true,
    },
    {
      id: 'player-004',
      name: 'David Park',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DP',
      rating: 1895,
      ratingChange: -12,
      isYou: false,
      isPlaceholder: false,
      isWinner: false,
    },
  ],
  finalScore: [3, 1],
  location: {
    name: 'Spin Chicago',
    tableNumber: 2,
  },
  timestamps: {
    created: '2025-12-03T09:00:00Z',
    scheduled: '2025-12-04T19:00:00Z',
    started: '2025-12-04T19:10:00Z',
    completed: '2025-12-04T20:15:00Z',
  },
  context: [
    {
      id: 'tournament-002',
      type: 'tournament',
      name: 'December Showdown',
      url: '/tournaments/tournament-002',
    },
    {
      id: 'club-001',
      type: 'club',
      name: 'Spin Chicago',
      url: '/clubs/club-001',
    },
  ],
  activity: [
    {
      id: 'activity-001',
      timestamp: '2025-12-03T09:00:00Z',
      type: 'created',
      description: 'Match created',
      actor: 'Tournament Director',
    },
    {
      id: 'activity-002',
      timestamp: '2025-12-03T09:15:00Z',
      type: 'scheduled',
      description: 'Match scheduled for Dec 4, 2025 at 7:00 PM',
      actor: 'Tournament Director',
    },
    {
      id: 'activity-003',
      timestamp: '2025-12-04T18:45:00Z',
      type: 'table_assigned',
      description: 'Assigned to Table 2',
      actor: 'Venue Staff',
    },
    {
      id: 'activity-004',
      timestamp: '2025-12-04T19:10:00Z',
      type: 'started',
      description: 'Match started',
      actor: null,
    },
    {
      id: 'activity-005',
      timestamp: '2025-12-04T20:15:00Z',
      type: 'completed',
      description: 'Match completed - Alex Johnson wins 3-1',
      actor: null,
    },
  ],
  notes: [
    {
      id: 'note-001',
      text: 'Great match! Both players showed excellent form.',
      author: 'Tournament Director',
      timestamp: '2025-12-04T20:20:00Z',
    },
  ],
  permissions: {
    canEdit: false,
    canEditParticipants: false,
    canCancel: false,
    canMarkNoShow: false,
    canDelete: false,
  },
}

export const cancelledMatch: MatchDetails = {
  id: 'match-cancelled-001',
  status: 'cancelled',
  format: 'singles',
  matchLength: 3,
  participants: [
    {
      id: 'player-001',
      name: 'Alex Johnson',
      avatarUrl: null,
      rating: 1850,
      ratingChange: null,
      isYou: true,
      isPlaceholder: false,
      isWinner: null,
    },
    {
      id: 'player-005',
      name: 'Emma Rodriguez',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=ER',
      rating: 1810,
      ratingChange: null,
      isYou: false,
      isPlaceholder: false,
      isWinner: null,
    },
  ],
  finalScore: null,
  location: {
    name: 'Ping Pong Palace',
    tableNumber: null,
  },
  timestamps: {
    created: '2025-12-01T10:00:00Z',
    scheduled: '2025-12-02T15:00:00Z',
    started: null,
    completed: null,
  },
  context: [],
  activity: [
    {
      id: 'activity-001',
      timestamp: '2025-12-01T10:00:00Z',
      type: 'created',
      description: 'Match created',
      actor: 'Alex Johnson',
    },
    {
      id: 'activity-002',
      timestamp: '2025-12-02T12:00:00Z',
      type: 'cancelled',
      description: 'Match cancelled - opponent unavailable',
      actor: 'Alex Johnson',
    },
  ],
  notes: [],
  permissions: {
    canEdit: false,
    canEditParticipants: false,
    canCancel: false,
    canMarkNoShow: false,
    canDelete: true,
  },
}

export const doublesMatch: MatchDetails = {
  id: 'match-doubles-001',
  status: 'completed',
  format: 'doubles',
  matchLength: 3,
  participants: [
    {
      id: 'team-001',
      name: 'Alex Johnson & Marcus Chen',
      avatarUrl: null,
      rating: 1885,
      ratingChange: 8,
      isYou: true,
      isPlaceholder: false,
      isWinner: true,
    },
    {
      id: 'team-002',
      name: 'Sarah Williams & David Park',
      avatarUrl: null,
      rating: 1837,
      ratingChange: -8,
      isYou: false,
      isPlaceholder: false,
      isWinner: false,
    },
  ],
  finalScore: [2, 1],
  location: {
    name: 'Spin Chicago',
    tableNumber: 1,
  },
  timestamps: {
    created: '2025-12-04T08:00:00Z',
    scheduled: '2025-12-04T12:00:00Z',
    started: '2025-12-04T12:10:00Z',
    completed: '2025-12-04T13:00:00Z',
  },
  context: [
    {
      id: 'league-002',
      type: 'league',
      name: 'Chicago Doubles League',
      url: '/leagues/league-002',
    },
  ],
  activity: [
    {
      id: 'activity-001',
      timestamp: '2025-12-04T08:00:00Z',
      type: 'created',
      description: 'Match created',
      actor: 'League Admin',
    },
    {
      id: 'activity-002',
      timestamp: '2025-12-04T12:10:00Z',
      type: 'started',
      description: 'Match started',
      actor: null,
    },
    {
      id: 'activity-003',
      timestamp: '2025-12-04T13:00:00Z',
      type: 'completed',
      description: 'Match completed - Alex Johnson & Marcus Chen win 2-1',
      actor: null,
    },
  ],
  notes: [],
  permissions: {
    canEdit: false,
    canEditParticipants: false,
    canCancel: false,
    canMarkNoShow: false,
    canDelete: false,
  },
}

// Map of variant names to mock data
export const mockMatchVariants = {
  pending: pendingMatch,
  scheduled: scheduledMatch,
  in_progress: inProgressMatch,
  completed: completedMatch,
  cancelled: cancelledMatch,
  doubles: doublesMatch,
} as const

export type MockMatchVariant = keyof typeof mockMatchVariants

// Helper to get mock data by variant (supports URL query param)
export function getMockMatchDetails(variant?: MockMatchVariant): MatchDetails {
  return mockMatchVariants[variant ?? 'completed']
}

// Helper to determine primary action button based on status
export function getPrimaryActionLabel(status: MatchStatus): string {
  switch (status) {
    case 'pending':
    case 'scheduled':
      return 'Start scoring'
    case 'in_progress':
      return 'Resume scoring'
    case 'completed':
      return 'View scorecard'
    case 'cancelled':
      return 'View scorecard'
    default:
      return 'View scorecard'
  }
}

// Helper to get status display text
export function getStatusDisplayText(status: MatchStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'scheduled':
      return 'Scheduled'
    case 'in_progress':
      return 'In progress'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status
  }
}

// Helper to get format display text
export function getFormatDisplayText(format: MatchFormat, matchLength: MatchLength): string {
  const formatText = format === 'singles' ? 'Singles' : 'Doubles'
  return `Best of ${matchLength} • ${formatText} match`
}
