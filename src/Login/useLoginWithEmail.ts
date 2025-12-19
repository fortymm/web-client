import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { api } from '@lib/api'

const ENDPOINT = '/sessions/email'

export const loginWithEmailPayloadSchema = z.object({
  email: z.string().email('Email must be valid'),
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

export type LoginWithEmailPayload = z.infer<typeof loginWithEmailPayloadSchema>

export const loginWithEmailResponseSchema = z.object({
  email: z.string(),
})

export type LoginWithEmailResponse = z.infer<typeof loginWithEmailResponseSchema>

export function useLoginWithEmail() {
  return useMutation({
    mutationFn: async (payload: LoginWithEmailPayload) => {
      const validatedPayload = loginWithEmailPayloadSchema.parse(payload)
      const response = await api.post<LoginWithEmailResponse>(
        ENDPOINT,
        validatedPayload
      )
      return loginWithEmailResponseSchema.parse(response.data)
    },
  })
}

export { ENDPOINT as LOGIN_WITH_EMAIL_ENDPOINT }
