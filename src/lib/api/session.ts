import { useSuspenseQuery } from '@tanstack/react-query'
import { useTokenStore } from '@/lib/auth/tokenStore'
import { api } from './client'
import type { components } from './schema'

export type Session = components['schemas']['SessionResponse']

export function useSession() {
  return useSuspenseQuery<Session>({
    queryKey: ['session'],
    queryFn: async () => {
      const token = useTokenStore.getState().token
      const init = token
        ? { params: { header: { authorization: `Bearer ${token}` } } }
        : {}
      const { data, error } = await api.POST('/v1/session', init)
      if (error) throw new Error(`Failed to create session: ${JSON.stringify(error)}`)
      useTokenStore.getState().setToken(data.token)
      return data
    },
    staleTime: Infinity,
    gcTime: Infinity,
  }).data
}
