import { describe, it, expect, beforeEach } from 'vitest'
import { appearanceSettingsPage } from './AppearanceSettings.page'

describe('AppearanceSettings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the heading', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.heading).toBeInTheDocument()
  })

  it('renders the description', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.description).toBeInTheDocument()
  })

  it('renders theme mode select', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.themeModeSelect).toBeInTheDocument()
  })

  it('defaults to single theme mode', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.themeModeSelect).toHaveValue('single')
  })

  it('renders theme options in single theme mode', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.allThemeRadios.length).toBeGreaterThan(0)
  })

  it('shows light and dark sections in sync mode', async () => {
    appearanceSettingsPage.render()
    await appearanceSettingsPage.selectThemeMode('Sync with system')
    expect(appearanceSettingsPage.lightThemeSection).toBeInTheDocument()
    expect(appearanceSettingsPage.darkThemeSection).toBeInTheDocument()
  })

  it('hides sync sections in single theme mode', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.lightThemeSection).not.toBeInTheDocument()
    expect(appearanceSettingsPage.darkThemeSection).not.toBeInTheDocument()
  })

  it('can select a theme', async () => {
    appearanceSettingsPage.render()
    await appearanceSettingsPage.selectTheme('Dark default')
    expect(appearanceSettingsPage.getThemeCard('Dark default')).toBeChecked()
  })
})
