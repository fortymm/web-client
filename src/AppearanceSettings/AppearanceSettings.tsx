import type { FC } from 'react'
import { useTheme } from '../lib/useTheme'
import AppearanceCard from './AppearanceCard'

const AppearanceSettings: FC = () => {
  const { appearance, setAppearance } = useTheme()

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Theme preferences</h1>
      <p className="text-base-content/70 mb-8">
        Choose how FortyMM looks: light, dark, or follow your system theme.
      </p>

      <fieldset>
        <legend className="text-sm font-medium mb-6">Appearance</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AppearanceCard
            value="light"
            label="Light"
            description="Always use the light theme."
            selected={appearance === 'light'}
            onSelect={() => setAppearance('light')}
            variant="light"
          />
          <AppearanceCard
            value="dark"
            label="Dark"
            description="Always use the dark theme."
            selected={appearance === 'dark'}
            onSelect={() => setAppearance('dark')}
            variant="dark"
          />
          <AppearanceCard
            value="system"
            label="Use system theme"
            description="Match your device's theme."
            selected={appearance === 'system'}
            onSelect={() => setAppearance('system')}
            variant="system"
          />
        </div>
        <p className="text-xs text-base-content/40 mt-6 text-center">
          With Use system theme, FortyMM switches automatically when your device switches between Light and Dark.
        </p>
      </fieldset>
    </div>
  )
}

export default AppearanceSettings
