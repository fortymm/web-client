import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import type { Appearance } from '@lib/theme'
import AppearanceCard from './AppearanceCard'

interface RenderOptions {
  value?: Appearance
  label?: string
  description?: string
  selected?: boolean
  onSelect?: () => void
  variant?: 'light' | 'dark' | 'system'
}

export const appearanceCardPage = {
  render(options: RenderOptions = {}) {
    const {
      value = 'light',
      label = 'Light',
      description = 'Light mode description',
      selected = false,
      onSelect = vi.fn(),
      variant = 'light',
    } = options

    render(
      <AppearanceCard
        value={value}
        label={label}
        description={description}
        selected={selected}
        onSelect={onSelect}
        variant={variant}
      />
    )

    return { onSelect }
  },

  get radio() {
    return screen.getByRole('radio', { hidden: true })
  },

  get label() {
    return screen.getByText((_content, element) => {
      return element?.tagName === 'SPAN' && element.className.includes('font-medium')
    })
  },

  get description() {
    return screen.getByText((_content, element) => {
      return element?.tagName === 'P' && element.className.includes('text-xs')
    })
  },

  get checkIcon() {
    const svg = document.querySelector('svg.text-primary')
    return svg
  },

  async click() {
    await userEvent.click(this.radio)
  },
}
