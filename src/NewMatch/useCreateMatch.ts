import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { saveMatch, type StoredMatch } from '../lib/matchesDb'

export const createMatchPayloadSchema = z.object({
  id: z.string().uuid(),
  opponentId: z.string().nullable(),
  matchLength: z.union([z.literal(1), z.literal(3), z.literal(5), z.literal(7)]),
})

export type CreateMatchPayload = z.infer<typeof createMatchPayloadSchema>

export type CreateMatchResponse = StoredMatch

export function useCreateMatch() {
  return useMutation({
    mutationFn: async (payload: CreateMatchPayload): Promise<CreateMatchResponse> => {
      const validatedPayload = createMatchPayloadSchema.parse(payload)

      const match: StoredMatch = {
        id: validatedPayload.id,
        playerId: null,
        opponentId: validatedPayload.opponentId,
        matchLength: validatedPayload.matchLength,
        status: 'in_progress',
        games: [],
        winnerId: null,
        createdAt: new Date(),
      }

      return saveMatch(match)
    },
  })
}
