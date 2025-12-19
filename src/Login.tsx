import { useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useFlash } from '@lib/useFlash'
import CTAPanel from '@common/CTAPanel'
import {
  useLogin,
  loginPayloadSchema,
  extractValidationErrors,
  type LoginPayload,
} from './Login/useLogin'

const Login: FC = () => {
  const login = useLogin()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginPayloadSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginPayload) => {
    setApiErrors({})
    login.mutate(data, {
      onSuccess: () => {
        showFlash('You have been logged in successfully.', {
          type: 'success',
          timeout: 5000,
        })
        navigate('/')
      },
      onError: (error) => {
        const validationErrors = extractValidationErrors(error)
        if (validationErrors) {
          setApiErrors(validationErrors)
        } else {
          showFlash('Failed to log in. Please try again.', {
            type: 'error',
            timeout: 5000,
          })
        }
      },
    })
  }

  const emailError = errors.email?.message || apiErrors.email?.[0]
  const passwordError = errors.password?.message || apiErrors.password?.[0]

  return (
    <div className="max-w-sm mx-auto pb-24">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Log in to your account</h1>
        <p className="text-base-content/70">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>{' '}
          for one now.
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

        <fieldset className="fieldset w-full">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={`input validator w-full ${passwordError ? 'input-error' : ''}`}
            {...register('password')}
          />
          <div
            className={`validator-hint text-error ${passwordError ? '!visible' : ''}`}
          >
            {passwordError}
          </div>
        </fieldset>

        <CTAPanel>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={login.isPending}
          >
            {login.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              'Log in'
            )}
          </button>
        </CTAPanel>
      </form>
    </div>
  )
}

export default Login
