import { createContext } from 'react'
import type { Appearance, Theme } from './theme'

export interface ThemeContextValue {
  appearance: Appearance
  activeTheme: Theme
  setAppearance: (appearance: Appearance) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
