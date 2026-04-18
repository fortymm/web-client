import { useQuery } from '@tanstack/react-query'
import type { OpponentPlayer } from '@/components/new-match/data'

export function usePlayerSearch(
  query: string,
  options: { enabled?: boolean } = {},
) {
  const q = query.trim()
  return useQuery<OpponentPlayer[]>({
    queryKey: ['players', q],
    queryFn: async () => {
      const url = q
        ? `/api/players?q=${encodeURIComponent(q)}`
        : '/api/players'
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to load ${res.url}: ${res.status}`)
      return res.json()
    },
    placeholderData: (prev) => prev,
    enabled: options.enabled ?? true,
  })
}
