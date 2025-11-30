export type ThemeMode = 'single' | 'sync'

export type Theme =
  | 'light'
  | 'dark'
  | 'cupcake'
  | 'emerald'
  | 'corporate'
  | 'forest'
  | 'lofi'
  | 'pastel'
  | 'wireframe'
  | 'black'
  | 'luxury'
  | 'dracula'
  | 'night'
  | 'coffee'
  | 'dim'
  | 'nord'
  | 'sunset'

export const lightThemes: Theme[] = ['light', 'cupcake', 'emerald', 'corporate', 'lofi', 'pastel', 'wireframe']
export const darkThemes: Theme[] = ['dark', 'forest', 'black', 'luxury', 'dracula', 'night', 'coffee', 'dim', 'nord', 'sunset']

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
