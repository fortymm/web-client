import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'

const ENDPOINT = '/matches'

export const createMatchPayloadSchema = z.object({
  id: z.string().uuid(),
  opponentId: z.string().nullable(),
  matchLength: z.union([z.literal(1), z.literal(3), z.literal(5), z.literal(7)]),
})

export type CreateMatchPayload = z.infer<typeof createMatchPayloadSchema>

export const createMatchResponseSchema = z.object({
  id: z.string(),
  playerId: z.string().nullable(),
  opponentId: z.string().nullable(),
  matchLength: z.number(),
  status: z.string(),
  createdAt: z.string().transform((val) => new Date(val)),
})

export type CreateMatchResponse = z.infer<typeof createMatchResponseSchema>

export function useCreateMatch() {
  return useMutation({
    mutationFn: async (payload: CreateMatchPayload): Promise<CreateMatchResponse> => {
      const validatedPayload = createMatchPayloadSchema.parse(payload)
      const response = await api.post(ENDPOINT, validatedPayload)
      return createMatchResponseSchema.parse(response.data)
    },
  })
}

export { ENDPOINT as CREATE_MATCH_ENDPOINT }
