import { useEffect, useState, type FC, type ReactNode } from 'react'
import { type Theme, type ThemeConfig, DEFAULT_CONFIG, STORAGE_KEY } from './theme'
import { ThemeContext } from './themeContext'

function getSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function loadConfig(): ThemeConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) }
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_CONFIG
}

function saveConfig(config: ThemeConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(loadConfig)
  const [systemDark, setSystemDark] = useState(getSystemPrefersDark)

  const activeTheme = config.mode === 'single'
    ? config.singleTheme
    : systemDark
      ? config.darkTheme
      : config.lightTheme

  useEffect(() => {
    applyTheme(activeTheme)
  }, [activeTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const updateConfig = (updates: Partial<ThemeConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates }
      saveConfig(newConfig)
      return newConfig
    })
  }

  const value = {
    config,
    activeTheme,
    setMode: (mode: ThemeConfig['mode']) => updateConfig({ mode }),
    setSingleTheme: (singleTheme: Theme) => updateConfig({ singleTheme }),
    setLightTheme: (lightTheme: Theme) => updateConfig({ lightTheme }),
    setDarkTheme: (darkTheme: Theme) => updateConfig({ darkTheme }),
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
