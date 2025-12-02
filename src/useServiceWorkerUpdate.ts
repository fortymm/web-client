import { useRegisterSW } from 'virtual:pwa-register/react'

export interface ServiceWorkerUpdateState {
  needRefresh: boolean
  refresh: () => void
  dismiss: () => void
}

export function useServiceWorkerUpdate(): ServiceWorkerUpdateState {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

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
