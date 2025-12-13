import { useEffect, useRef } from 'react'
import { useServiceWorkerUpdate } from '../useServiceWorkerUpdate'
import { useFlash } from '@lib/useFlash'

function UpdateFlash() {
  const { needRefresh, refresh } = useServiceWorkerUpdate()
  const { showFlash, dismissFlash } = useFlash()
  const flashIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (needRefresh && !flashIdRef.current) {
      flashIdRef.current = showFlash('A new version is available.', {
        type: 'info',
        action: {
          label: 'Refresh',
          onClick: refresh,
        },
      })
    } else if (!needRefresh && flashIdRef.current) {
      dismissFlash(flashIdRef.current)
      flashIdRef.current = null
    }
  }, [needRefresh, refresh, showFlash, dismissFlash])

  return null
}

export default UpdateFlash
