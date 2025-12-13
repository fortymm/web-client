import { describe, it, expect, vi } from 'vitest'
import { appearanceCardPage } from './AppearanceCard.page'

describe('AppearanceCard', () => {
  describe('rendering', () => {
    it('displays label and description', () => {
      appearanceCardPage.render({
        label: 'Light Mode',
        description: 'Use light theme',
      })

      expect(appearanceCardPage.label).toHaveTextContent('Light Mode')
      expect(appearanceCardPage.description).toHaveTextContent('Use light theme')
    })

    it('renders radio input with correct value', () => {
      appearanceCardPage.render({
        value: 'dark',
      })

      expect(appearanceCardPage.radio).toHaveAttribute('value', 'dark')
      expect(appearanceCardPage.radio).toHaveAttribute('name', 'appearance')
    })

    it('shows check icon when selected', () => {
      appearanceCardPage.render({
        selected: true,
      })

      expect(appearanceCardPage.checkIcon).toBeInTheDocument()
    })

    it('hides check icon when not selected', () => {
      appearanceCardPage.render({
        selected: false,
      })

      expect(appearanceCardPage.checkIcon).not.toBeInTheDocument()
    })
  })

  describe('selection state', () => {
    it('marks radio as checked when selected', () => {
      appearanceCardPage.render({
        selected: true,
      })

      expect(appearanceCardPage.radio).toBeChecked()
    })

    it('marks radio as unchecked when not selected', () => {
      appearanceCardPage.render({
        selected: false,
      })

      expect(appearanceCardPage.radio).not.toBeChecked()
    })
  })

  describe('interaction', () => {
    it('calls onSelect when clicked', async () => {
      const onSelect = vi.fn()
      appearanceCardPage.render({
        selected: false,
        onSelect,
      })

      await appearanceCardPage.click()

      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('does not call onSelect when already selected (radio button behavior)', async () => {
      const onSelect = vi.fn()
      appearanceCardPage.render({
        selected: true,
        onSelect,
      })

      await appearanceCardPage.click()

      // Radio buttons don't trigger onChange when clicking an already-checked button
      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  describe('theme variants', () => {
    it('renders light theme preview', () => {
      appearanceCardPage.render({
        variant: 'light',
      })

      const preview = document.querySelector('[data-theme="light"]')
      expect(preview).toBeInTheDocument()
    })

    it('renders dark theme preview', () => {
      appearanceCardPage.render({
        variant: 'dark',
      })

      const preview = document.querySelector('[data-theme="dark"]')
      expect(preview).toBeInTheDocument()
    })

    it('renders system theme preview with both light and dark halves', () => {
      appearanceCardPage.render({
        variant: 'system',
      })

      const lightPreview = document.querySelector('[data-theme="light"]')
      const darkPreview = document.querySelector('[data-theme="dark"]')

      expect(lightPreview).toBeInTheDocument()
      expect(darkPreview).toBeInTheDocument()
    })
  })

  describe('appearance values', () => {
    it('handles light appearance value', () => {
      appearanceCardPage.render({
        value: 'light',
        variant: 'light',
      })

      expect(appearanceCardPage.radio).toHaveAttribute('value', 'light')
    })

    it('handles dark appearance value', () => {
      appearanceCardPage.render({
        value: 'dark',
        variant: 'dark',
      })

      expect(appearanceCardPage.radio).toHaveAttribute('value', 'dark')
    })

    it('handles system appearance value', () => {
      appearanceCardPage.render({
        value: 'system',
        variant: 'system',
      })

      expect(appearanceCardPage.radio).toHaveAttribute('value', 'system')
    })
  })
})
