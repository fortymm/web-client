import type { FC } from 'react'
import { lightThemes, darkThemes, type Theme, type ThemeMode } from '../lib/theme'
import { useTheme } from '../lib/useTheme'
import ThemeCard from './ThemeCard'
import ThemePreview from './ThemePreview'

const themeLabels: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
}

const AppearanceSettings: FC = () => {
  const { config, setMode, setSingleTheme } = useTheme()

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as ThemeMode)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Theme preferences</h1>
      <p className="text-base-content/70 mb-6">
        Choose how FortyMM looks to you. Select a single theme, or sync with your system and
        automatically switch between day and night themes.
      </p>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Theme mode</label>
        <div className="flex items-center gap-3">
          <select
            className="select select-bordered w-48"
            value={config.mode}
            onChange={handleModeChange}
            aria-label="Theme mode"
          >
            <option value="single">Single theme</option>
            <option value="sync">Sync with system</option>
          </select>
          <span className="text-base-content/60 text-sm">
            {config.mode === 'single'
              ? 'FortyMM will use your selected theme'
              : 'FortyMM theme will match your system active settings'}
          </span>
        </div>
      </div>

      {config.mode === 'single' ? (
        <div>
          <h2 className="sr-only">Available themes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lightThemes.map((theme) => (
              <ThemeCard
                key={theme}
                theme={theme}
                label={themeLabels[theme]}
                selected={config.singleTheme === theme}
                onSelect={() => setSingleTheme(theme)}
                variant="light"
              />
            ))}
            {darkThemes.map((theme) => (
              <ThemeCard
                key={theme}
                theme={theme}
                label={themeLabels[theme]}
                selected={config.singleTheme === theme}
                onSelect={() => setSingleTheme(theme)}
                variant="dark"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h2 className="text-lg font-semibold">Light theme</h2>
            </div>
            <p className="text-base-content/60 text-sm mb-4">
              This theme will be active when your system is set to "light mode"
            </p>
            <ThemePreview theme="light" label="Light" variant="light" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <h2 className="text-lg font-semibold">Dark theme</h2>
            </div>
            <p className="text-base-content/60 text-sm mb-4">
              This theme will be active when your system is set to "dark mode"
            </p>
            <ThemePreview theme="dark" label="Dark" variant="dark" />
          </div>
        </div>
      )}
    </div>
  )
}

export default AppearanceSettings
