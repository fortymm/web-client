import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type TokenState = {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'fortymm.token',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
