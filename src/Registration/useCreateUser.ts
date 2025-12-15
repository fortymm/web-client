import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { api } from '@lib/api'

const ENDPOINT = '/users'

export const createUserPayloadSchema = z.object({
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

export type CreateUserPayload = z.infer<typeof createUserPayloadSchema>

export const createUserResponseSchema = z.object({
  email: z.string(),
})

export type CreateUserResponse = z.infer<typeof createUserResponseSchema>

export function useCreateUser() {
  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const validatedPayload = createUserPayloadSchema.parse(payload)
      const response = await api.post<CreateUserResponse>(
        ENDPOINT,
        validatedPayload
      )
      return createUserResponseSchema.parse(response.data)
    },
  })
}

export { ENDPOINT as CREATE_USER_ENDPOINT }
