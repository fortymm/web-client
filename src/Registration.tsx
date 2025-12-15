import { useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useFlash } from '@lib/useFlash'
import CTAPanel from '@common/CTAPanel'
import {
  useCreateUser,
  createUserPayloadSchema,
  extractValidationErrors,
  type CreateUserPayload,
} from './Registration/useCreateUser'

const Registration: FC = () => {
  const createUser = useCreateUser()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserPayload>({
    resolver: zodResolver(createUserPayloadSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: CreateUserPayload) => {
    setApiErrors({})
    createUser.mutate(data, {
      onSuccess: (response) => {
        showFlash(
          `An email was sent to ${response.email}, please access it to confirm your account.`,
          { type: 'success', timeout: 5000 }
        )
        navigate('/login')
      },
      onError: (error) => {
        const validationErrors = extractValidationErrors(error)
        if (validationErrors) {
          setApiErrors(validationErrors)
        } else {
          showFlash('Failed to create account. Please try again.', {
            type: 'error',
            timeout: 5000,
          })
        }
      },
    })
  }

  const emailError = errors.email?.message || apiErrors.email?.[0]

  return (
    <div className="max-w-sm mx-auto pb-24">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Register for an account</h1>
        <p className="text-base-content/70">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>{' '}
          to your account now.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="fieldset w-full">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            autoFocus
            className={`input validator w-full ${emailError ? 'input-error' : ''}`}
            {...register('email')}
          />
          <div
            className={`validator-hint text-error ${emailError ? '!visible' : ''}`}
          >
            {emailError}
          </div>
        </fieldset>

        <CTAPanel>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={createUser.isPending}
          >
            {createUser.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              'Create an account'
            )}
          </button>
        </CTAPanel>
      </form>
    </div>
  )
}

export default Registration
