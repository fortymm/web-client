import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const ENDPOINT = '/session'

export const sessionResponseSchema = z.object({
  username: z.string(),
})

export type SessionResponse = z.infer<typeof sessionResponseSchema>

export interface UseSessionReturn {
  username: string | null
  status: 'pending' | 'success' | 'error'
  error: Error | null
  isLoading: boolean
}

export function useSession(): UseSessionReturn {
  const result = useQuery({
    queryKey: ['session'],
    queryFn: async ({ signal }) => {
      const response = await api.get<SessionResponse>(ENDPOINT, { signal })
      return sessionResponseSchema.parse(response.data)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
  })

  return {
    username: result.data?.username ?? null,
    status: result.status,
    error: result.error,
    isLoading: result.isLoading,
  }
}

export { ENDPOINT as SESSION_ENDPOINT }
