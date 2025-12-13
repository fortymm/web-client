import { describe, it, expect } from 'vitest'
import { themePreviewPage } from './ThemePreview.page'

describe('ThemePreview', () => {
  describe('theme attribute', () => {
    it('renders with light theme data attribute', () => {
      themePreviewPage.render({ variant: 'light' })

      expect(themePreviewPage.getThemeContainer('light')).toBeInTheDocument()
    })

    it('renders with dark theme data attribute', () => {
      themePreviewPage.render({ variant: 'dark' })

      expect(themePreviewPage.getThemeContainer('dark')).toBeInTheDocument()
    })
  })

  describe('preview structure', () => {
    it('renders all preview elements', () => {
      themePreviewPage.render({ variant: 'light' })

      const elements = themePreviewPage.previewElements
      expect(elements).not.toBeNull()
      expect(elements?.container).toBeInTheDocument()
      expect(elements?.header).toBeInTheDocument()
      expect(elements?.body).toBeInTheDocument()
    })

    it('renders header with decorative elements', () => {
      themePreviewPage.render({ variant: 'light' })

      const elements = themePreviewPage.previewElements
      const headerElements = elements?.header?.querySelectorAll('.bg-base-content\\/30')
      expect(headerElements?.length).toBe(2)
    })

    it('renders body with primary elements', () => {
      themePreviewPage.render({ variant: 'light' })

      const elements = themePreviewPage.previewElements
      expect(elements?.primaryButton).toBeInTheDocument()
      expect(elements?.primaryPanel).toBeInTheDocument()
    })

    it('renders side panel', () => {
      themePreviewPage.render({ variant: 'light' })

      const elements = themePreviewPage.previewElements
      expect(elements?.sidePanel).toBeInTheDocument()
    })
  })

  describe('theme variants', () => {
    it('applies correct styling for light theme', () => {
      themePreviewPage.render({ variant: 'light' })

      const container = themePreviewPage.getThemeContainer('light')
      expect(container).toHaveAttribute('data-theme', 'light')
      expect(container).toHaveClass('bg-base-100')
    })

    it('applies correct styling for dark theme', () => {
      themePreviewPage.render({ variant: 'dark' })

      const container = themePreviewPage.getThemeContainer('dark')
      expect(container).toHaveAttribute('data-theme', 'dark')
      expect(container).toHaveClass('bg-base-100')
    })
  })
})
