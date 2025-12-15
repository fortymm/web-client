import { useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from './hooks/useSession'
import { useFlash } from '@lib/useFlash'
import CTAPanel from '@common/CTAPanel'
import {
  useUpdateAccount,
  updateAccountPayloadSchema,
  extractValidationErrors,
  type UpdateAccountPayload,
} from './AccountSettings/useUpdateAccount'

const AccountSettings: FC = () => {
  const { username, isLoading } = useSession()
  const updateAccount = useUpdateAccount()
  const { showFlash } = useFlash()
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateAccountPayload>({
    resolver: zodResolver(updateAccountPayloadSchema),
    values: {
      username: username ?? '',
    },
  })

  const onSubmit = (data: UpdateAccountPayload) => {
    if (!isDirty) {
      showFlash('No changes to save.', { type: 'info', timeout: 3000 })
      return
    }
    setApiErrors({})
    updateAccount.mutate(data, {
      onSuccess: () => {
        showFlash('Your changes have been saved.', { type: 'success', timeout: 3000 })
      },
      onError: (error) => {
        const validationErrors = extractValidationErrors(error)
        if (validationErrors) {
          setApiErrors(validationErrors)
        } else {
          showFlash('Failed to save changes. Please try again.', { type: 'error', timeout: 5000 })
        }
      },
    })
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    if (isLoading) {
      e.preventDefault()
      showFlash('No changes to save.', { type: 'info', timeout: 3000 })
    }
  }

  const usernameError = errors.username?.message || apiErrors.username?.[0]

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <h1 className="text-2xl font-bold mb-2">Account settings</h1>
      <p className="text-base-content/70 mb-8">
        Update how you appear to other players.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset className="fieldset w-full max-w-md">
          <label className="label" htmlFor="username">
            <span className="label-text">Username</span>
          </label>
          {isLoading ? (
            <div className="skeleton h-12 w-full" />
          ) : (
            <input
              id="username"
              type="text"
              className={`input validator w-full ${usernameError ? 'input-error' : ''}`}
              {...register('username')}
            />
          )}
          <div className={`validator-hint ${usernameError ? '!visible' : ''}`}>
            {usernameError}
          </div>
        </fieldset>

        <CTAPanel>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={updateAccount.isPending}
            onClick={handleSaveClick}
          >
            {updateAccount.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              'Save changes'
            )}
          </button>
        </CTAPanel>
      </form>
    </div>
  )
}

export default AccountSettings
