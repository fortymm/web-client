import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'

const ENDPOINT = '/matches'

export const createMatchPayloadSchema = z.object({
  opponentId: z.string().nullable(),
  matchLength: z.union([z.literal(1), z.literal(3), z.literal(5), z.literal(7)]),
})

export type CreateMatchPayload = z.infer<typeof createMatchPayloadSchema>

export interface CreateMatchResponse {
  id: string
  playerId: string | null
  opponentId: string | null
  matchLength: number
  status: string
  createdAt: string
}

export function useCreateMatch() {
  return useMutation({
    mutationFn: async (payload: CreateMatchPayload): Promise<CreateMatchResponse> => {
      const validatedPayload = createMatchPayloadSchema.parse(payload)
      const response = await api.post<CreateMatchResponse>(ENDPOINT, validatedPayload)
      return response.data
    },
  })
}

export { ENDPOINT as CREATE_MATCH_ENDPOINT }
