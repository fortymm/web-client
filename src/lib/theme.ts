export type Appearance = 'light' | 'dark' | 'system'

export type Theme = 'light' | 'dark'

export const STORAGE_KEY = 'fortymm-appearance'

export const DEFAULT_APPEARANCE: Appearance = 'system'

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

function resolveTheme(appearance: Appearance): Theme {
  if (appearance === 'system') {
    return getSystemPrefersDark() ? 'dark' : 'light'
  }
  return appearance
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
}

/** Apply initial theme before React renders to prevent flash */
export function initTheme(): void {
  const appearance = loadAppearance()
  applyTheme(resolveTheme(appearance))
}

export { loadAppearance, applyTheme, resolveTheme, getSystemPrefersDark }
