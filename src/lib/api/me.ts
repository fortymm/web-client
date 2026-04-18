import { useQuery } from '@tanstack/react-query'
import type { Player } from '@/components/dashboard/data'

export function useMe() {
  return useQuery<Player>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/me')
      if (!res.ok) throw new Error(`Failed to load ${res.url}: ${res.status}`)
      return res.json()
    },
  })
}
