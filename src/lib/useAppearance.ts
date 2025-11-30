import { useEffect, useState } from 'react'
import {
  type Appearance,
  type Theme,
  STORAGE_KEY,
  loadAppearance,
  applyTheme,
} from './theme'

interface UseAppearanceReturn {
  appearance: Appearance
  activeTheme: Theme
  setAppearance: (appearance: Appearance) => void
}

export function useAppearance(): UseAppearanceReturn {
  const [appearance, setAppearanceState] = useState<Appearance>(loadAppearance)
  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  const activeTheme: Theme = appearance === 'system'
    ? (systemDark ? 'dark' : 'light')
    : appearance

  // Apply theme to DOM when it changes
  useEffect(() => {
    applyTheme(activeTheme)
  }, [activeTheme])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const setAppearance = (newAppearance: Appearance) => {
    setAppearanceState(newAppearance)
    localStorage.setItem(STORAGE_KEY, newAppearance)
  }

  return { appearance, activeTheme, setAppearance }
}
