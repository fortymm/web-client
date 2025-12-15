import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { api } from '@lib/api'

const ENDPOINT = '/account'

export const updateAccountPayloadSchema = z.object({
  username: z.string().min(1, 'Username is required'),
})

export const validationErrorSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
})

export type ValidationErrors = z.infer<typeof validationErrorSchema>

export function extractValidationErrors(
  error: unknown
): Record<string, string[]> | null {
  if (!axios.isAxiosError(error)) return null
  if (error.response?.status !== 422) return null

  const parsed = validationErrorSchema.safeParse(error.response.data)
  if (!parsed.success) return null

  return parsed.data.errors
}

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
