import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import AppearanceSettings from './AppearanceSettings'

export const appearanceSettingsPage = {
  render() {
    render(
      <MemoryRouter>
        <AppearanceSettings />
      </MemoryRouter>
    )
  },

  get heading() {
    return screen.getByRole('heading', { name: 'Theme preferences' })
  },

  get description() {
    return screen.getByText(/choose how fortymm looks/i)
  },

  get appearanceFieldset() {
    return screen.getByRole('group', { name: /appearance/i })
  },

  getAppearanceOption(name: string) {
    return screen.getByRole('radio', { name: new RegExp(name, 'i') })
  },

  async selectAppearance(name: string) {
    const radio = screen.getByRole('radio', { name: new RegExp(name, 'i') })
    await userEvent.click(radio)
  },

  get allAppearanceRadios() {
    return screen.getAllByRole('radio')
  },

  get lightOption() {
    return screen.getByRole('radio', { name: /^light/i })
  },

  get darkOption() {
    return screen.getByRole('radio', { name: /^dark/i })
  },

  get systemOption() {
    return screen.getByRole('radio', { name: /use system theme/i })
  },
}
