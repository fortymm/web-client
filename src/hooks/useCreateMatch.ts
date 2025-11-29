import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { type MatchLength } from '../NewMatch/MatchLengthControl'

interface CreateMatchPayload {
  opponentId: string | null
  matchLength: MatchLength
  status: 'in_progress'
}

interface CreateMatchResponse {
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
      const response = await api.post<CreateMatchResponse>('/matches', payload)
      return response.data
    },
  })
}
