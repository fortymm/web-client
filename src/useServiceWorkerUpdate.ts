import { useRegisterSW } from 'virtual:pwa-register/react'

const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000 // Check every hour

export interface ServiceWorkerUpdateState {
  needRefresh: boolean
  refresh: () => void
  dismiss: () => void
}

export function useServiceWorkerUpdate(): ServiceWorkerUpdateState {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setInterval(() => {
          registration.update()
        }, UPDATE_CHECK_INTERVAL)
      }
    },
  })

  const refresh = () => {
    updateServiceWorker(true)
  }

  const dismiss = () => {
    setNeedRefresh(false)
  }

  return {
    needRefresh,
    refresh,
    dismiss,
  }
}
