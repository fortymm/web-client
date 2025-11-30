import { useEffect, useState, type FC, type ReactNode } from 'react'
import { type Appearance, type Theme, DEFAULT_APPEARANCE, STORAGE_KEY } from './theme'
import { ThemeContext } from './themeContext'

function getSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function loadAppearance(): Appearance {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // Ignore errors
  }
  return DEFAULT_APPEARANCE
}

function saveAppearance(appearance: Appearance): void {
  localStorage.setItem(STORAGE_KEY, appearance)
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [appearance, setAppearanceState] = useState<Appearance>(loadAppearance)
  const [systemDark, setSystemDark] = useState(getSystemPrefersDark)

  const activeTheme: Theme = appearance === 'system'
    ? (systemDark ? 'dark' : 'light')
    : appearance

  useEffect(() => {
    applyTheme(activeTheme)
  }, [activeTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const setAppearance = (newAppearance: Appearance) => {
    setAppearanceState(newAppearance)
    saveAppearance(newAppearance)
  }

  const value = {
    appearance,
    activeTheme,
    setAppearance,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
