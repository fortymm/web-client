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

  it('renders three appearance options', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.allAppearanceRadios).toHaveLength(3)
  })

  it('renders light option', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.lightOption).toBeInTheDocument()
  })

  it('renders dark option', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.darkOption).toBeInTheDocument()
  })

  it('renders system option', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.systemOption).toBeInTheDocument()
  })

  it('defaults to system theme', () => {
    appearanceSettingsPage.render()
    expect(appearanceSettingsPage.systemOption).toBeChecked()
  })

  it('can select light theme', async () => {
    appearanceSettingsPage.render()
    await appearanceSettingsPage.selectAppearance('Light')
    expect(appearanceSettingsPage.lightOption).toBeChecked()
  })

  it('can select dark theme', async () => {
    appearanceSettingsPage.render()
    await appearanceSettingsPage.selectAppearance('Dark')
    expect(appearanceSettingsPage.darkOption).toBeChecked()
  })
})
