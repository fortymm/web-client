import { useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useFlash } from '@lib/useFlash'
import {
  useLogin,
  loginPayloadSchema,
  extractValidationErrors,
} from './Login/useLogin'
import {
  useLoginWithEmail,
  loginWithEmailPayloadSchema,
  extractValidationErrors as extractEmailValidationErrors,
  type LoginWithEmailPayload,
} from './Login/useLoginWithEmail'

const passwordFormSchema = loginPayloadSchema.omit({ remember_me: true })
type PasswordFormData = z.infer<typeof passwordFormSchema>

const Login: FC = () => {
  const login = useLogin()
  const loginWithEmail = useLoginWithEmail()
  const { showFlash } = useFlash()
  const navigate = useNavigate()
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})
  const [emailApiErrors, setEmailApiErrors] = useState<Record<string, string[]>>({})

  // Magic link form
  const emailForm = useForm<LoginWithEmailPayload>({
    resolver: zodResolver(loginWithEmailPayloadSchema),
    defaultValues: {
      email: '',
    },
  })

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onEmailSubmit = (data: LoginWithEmailPayload) => {
    setEmailApiErrors({})
    loginWithEmail.mutate(data, {
      onSuccess: (response) => {
        showFlash(
          `A login link was sent to ${response.email}. Please check your inbox.`,
          { type: 'success', timeout: 5000 }
        )
      },
      onError: (error) => {
        const validationErrors = extractEmailValidationErrors(error)
        if (validationErrors) {
          setEmailApiErrors(validationErrors)
        } else {
          showFlash('Failed to send login link. Please try again.', {
            type: 'error',
            timeout: 5000,
          })
        }
      },
    })
  }

  const onPasswordSubmit = (data: PasswordFormData, rememberMe: boolean) => {
    setApiErrors({})
    login.mutate({ ...data, remember_me: rememberMe }, {
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

  const magicLinkEmailError = emailForm.formState.errors.email?.message || emailApiErrors.email?.[0]
  const passwordEmailError = passwordForm.formState.errors.email?.message || apiErrors.email?.[0]
  const passwordError = passwordForm.formState.errors.password?.message || apiErrors.password?.[0]

  return (
    <div className="max-w-sm mx-auto pb-24">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Log in</h1>
        <p className="text-base-content/70">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>{' '}
          for an account now.
        </p>
      </div>

      {/* Magic link login */}
      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} noValidate>
        <fieldset className="fieldset w-full">
          <label className="label" htmlFor="magic-link-email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="magic-link-email"
            type="email"
            autoComplete="username"
            autoFocus
            className={`input validator w-full ${magicLinkEmailError ? 'input-error' : ''}`}
            {...emailForm.register('email')}
          />
          <div
            className={`validator-hint text-error ${magicLinkEmailError ? '!visible' : ''}`}
          >
            {magicLinkEmailError}
          </div>
        </fieldset>

        <button
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={loginWithEmail.isPending}
        >
          {loginWithEmail.isPending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <>Log in with email &rarr;</>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="divider my-8">or</div>

      {/* Password login */}
      <form noValidate>
        <fieldset className="fieldset w-full">
          <label className="label" htmlFor="password-email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="password-email"
            type="email"
            autoComplete="username"
            className={`input validator w-full ${passwordEmailError ? 'input-error' : ''}`}
            {...passwordForm.register('email')}
          />
          <div
            className={`validator-hint text-error ${passwordEmailError ? '!visible' : ''}`}
          >
            {passwordEmailError}
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
            {...passwordForm.register('password')}
          />
          <div
            className={`validator-hint text-error ${passwordError ? '!visible' : ''}`}
          >
            {passwordError}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            className="btn btn-primary w-full"
            disabled={login.isPending}
            onClick={passwordForm.handleSubmit((data) => onPasswordSubmit(data, true))}
          >
            {login.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>Log in and stay logged in &rarr;</>
            )}
          </button>
          <button
            type="button"
            className="btn btn-ghost text-primary w-full"
            disabled={login.isPending}
            onClick={passwordForm.handleSubmit((data) => onPasswordSubmit(data, false))}
          >
            Log in only this time
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
