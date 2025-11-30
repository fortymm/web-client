import { createContext } from 'react'
import type { Theme, ThemeMode, ThemeConfig } from './theme'

export interface ThemeContextValue {
  config: ThemeConfig
  activeTheme: Theme
  setMode: (mode: ThemeMode) => void
  setSingleTheme: (theme: Theme) => void
  setLightTheme: (theme: Theme) => void
  setDarkTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
