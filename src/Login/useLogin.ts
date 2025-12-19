import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { api } from '@lib/api'

const ENDPOINT = '/sessions'

export const loginPayloadSchema = z.object({
  email: z.string().email('Email must be valid'),
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean(),
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

export type LoginPayload = z.infer<typeof loginPayloadSchema>

export const loginResponseSchema = z.object({
  email: z.string(),
})

export type LoginResponse = z.infer<typeof loginResponseSchema>

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const validatedPayload = loginPayloadSchema.parse(payload)
      const response = await api.post<LoginResponse>(
        ENDPOINT,
        validatedPayload
      )
      return loginResponseSchema.parse(response.data)
    },
  })
}

export { ENDPOINT as LOGIN_ENDPOINT }
