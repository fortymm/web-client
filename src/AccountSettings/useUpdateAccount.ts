import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const ENDPOINT = '/account'

export const updateAccountPayloadSchema = z.object({
  username: z.string().min(1, 'Username is required'),
})

export type UpdateAccountPayload = z.infer<typeof updateAccountPayloadSchema>

export const updateAccountResponseSchema = z.object({
  username: z.string(),
})

export type UpdateAccountResponse = z.infer<typeof updateAccountResponseSchema>

export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateAccountPayload) => {
      const validatedPayload = updateAccountPayloadSchema.parse(payload)
      const response = await api.patch<UpdateAccountResponse>(
        ENDPOINT,
        validatedPayload
      )
      return updateAccountResponseSchema.parse(response.data)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['session'], { username: data.username })
    },
  })
}

export { ENDPOINT as UPDATE_ACCOUNT_ENDPOINT }
