import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMatch } from '@lib/matchesDb'

export function useDeleteMatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (matchId: string): Promise<void> => {
      await deleteMatch(matchId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}
