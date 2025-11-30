import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import AppearanceSettings from './AppearanceSettings'
import { ThemeProvider } from '../lib/ThemeProvider'

export const appearanceSettingsPage = {
  render() {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AppearanceSettings />
        </MemoryRouter>
      </ThemeProvider>
    )
  },

  get heading() {
    return screen.getByRole('heading', { name: 'Theme preferences' })
  },

  get description() {
    return screen.getByText(/choose how fortymm looks to you/i)
  },

  get themeModeSelect() {
    return screen.getByRole('combobox', { name: 'Theme mode' })
  },

  async selectThemeMode(mode: 'Single theme' | 'Sync with system') {
    await userEvent.selectOptions(appearanceSettingsPage.themeModeSelect, mode)
  },

  getThemeCard(name: string) {
    return screen.getByRole('radio', { name: new RegExp(name, 'i') })
  },

  async selectTheme(name: string) {
    const radio = screen.getByRole('radio', { name: new RegExp(name, 'i') })
    await userEvent.click(radio)
  },

  get lightThemeSection() {
    return screen.queryByRole('heading', { name: 'Light theme' })
  },

  get darkThemeSection() {
    return screen.queryByRole('heading', { name: 'Dark theme' })
  },

  get allThemeRadios() {
    return screen.getAllByRole('radio')
  },
}
