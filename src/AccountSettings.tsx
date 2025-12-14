import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from './hooks/useSession'
import {
  useUpdateAccount,
  updateAccountPayloadSchema,
  type UpdateAccountPayload,
} from './AccountSettings/useUpdateAccount'

const AccountSettings: FC = () => {
  const { username, isLoading } = useSession()
  const updateAccount = useUpdateAccount()

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
    updateAccount.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Account settings</h1>
        <p className="text-base-content/70 mb-8">
          Manage your account information and preferences.
        </p>
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Account settings</h1>
      <p className="text-base-content/70 mb-8">
        Manage your account information and preferences.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <legend className="text-sm font-medium mb-6">Profile</legend>

          <div className="form-control w-full max-w-md">
            <label className="label" htmlFor="username">
              <span className="label-text">Username</span>
            </label>
            <input
              id="username"
              type="text"
              className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
              {...register('username')}
            />
            {errors.username && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.username.message}
                </span>
              </label>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isDirty || updateAccount.isPending}
            >
              {updateAccount.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Save changes'
              )}
            </button>
          </div>

          {updateAccount.isSuccess && (
            <div className="alert alert-success mt-4">
              <span>Your changes have been saved.</span>
            </div>
          )}

          {updateAccount.isError && (
            <div className="alert alert-error mt-4">
              <span>Failed to save changes. Please try again.</span>
            </div>
          )}
        </fieldset>
      </form>
    </div>
  )
}

export default AccountSettings
