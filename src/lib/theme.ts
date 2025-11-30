export type ThemeMode = 'single' | 'sync'

export type Theme = 'light' | 'dark'

export const lightThemes: Theme[] = ['light']
export const darkThemes: Theme[] = ['dark']

export interface ThemeConfig {
  mode: ThemeMode
  singleTheme: Theme
  lightTheme: Theme
  darkTheme: Theme
}

export const DEFAULT_CONFIG: ThemeConfig = {
  mode: 'single',
  singleTheme: 'light',
  lightTheme: 'light',
  darkTheme: 'dark',
}

export const STORAGE_KEY = 'fortymm-theme-config'
