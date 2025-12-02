import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'

export interface MockRegisterSWReturn {
  needRefresh: [boolean, (value: boolean) => void]
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>
}

let mockNeedRefresh = false
let mockSetNeedRefresh = vi.fn()
let mockUpdateServiceWorker = vi.fn()

export const useServiceWorkerUpdatePage = {
  mockNeedRefresh(value: boolean) {
    mockNeedRefresh = value
  },

  getMockSetNeedRefresh() {
    return mockSetNeedRefresh
  },

  getMockUpdateServiceWorker() {
    return mockUpdateServiceWorker
  },

  resetMocks() {
    mockNeedRefresh = false
    mockSetNeedRefresh = vi.fn()
    mockUpdateServiceWorker = vi.fn()
  },

  createMockUseRegisterSW() {
    return vi.fn((): MockRegisterSWReturn => ({
      needRefresh: [mockNeedRefresh, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateServiceWorker,
    }))
  },

  async render() {
    const { useServiceWorkerUpdate } = await import('./useServiceWorkerUpdate')
    return renderHook(() => useServiceWorkerUpdate())
  },

  act,
}
