import { describe, it, expect } from 'vitest'
import { systemPreviewPage } from './SystemPreview.page'

describe('SystemPreview', () => {
  describe('rendering', () => {
    it('renders container with both theme halves', () => {
      systemPreviewPage.render()

      expect(systemPreviewPage.container).toBeInTheDocument()
      expect(systemPreviewPage.allThemeHalves).toHaveLength(2)
    })

    it('renders light theme half', () => {
      systemPreviewPage.render()

      expect(systemPreviewPage.lightThemeHalf).toBeInTheDocument()
      expect(systemPreviewPage.lightThemeHalf).toHaveAttribute('data-theme', 'light')
    })

    it('renders dark theme half', () => {
      systemPreviewPage.render()

      expect(systemPreviewPage.darkThemeHalf).toBeInTheDocument()
      expect(systemPreviewPage.darkThemeHalf).toHaveAttribute('data-theme', 'dark')
    })
  })

  describe('light theme structure', () => {
    it('renders all light theme elements', () => {
      systemPreviewPage.render()

      const elements = systemPreviewPage.getLightThemeElements()
      expect(elements).not.toBeNull()
      expect(elements?.container).toBeInTheDocument()
      expect(elements?.header).toBeInTheDocument()
      expect(elements?.body).toBeInTheDocument()
    })

    it('renders light theme header decorations', () => {
      systemPreviewPage.render()

      const elements = systemPreviewPage.getLightThemeElements()
      const headerElements = elements?.header?.querySelectorAll('.bg-base-content\\/30')
      expect(headerElements?.length).toBe(2)
    })

    it('renders light theme primary elements', () => {
      systemPreviewPage.render()

      const elements = systemPreviewPage.getLightThemeElements()
      expect(elements?.primaryButton).toBeInTheDocument()
      expect(elements?.primaryPanel).toBeInTheDocument()
    })
  })

  describe('dark theme structure', () => {
    it('renders all dark theme elements', () => {
      systemPreviewPage.render()

      const elements = systemPreviewPage.getDarkThemeElements()
      expect(elements).not.toBeNull()
      expect(elements?.container).toBeInTheDocument()
      expect(elements?.header).toBeInTheDocument()
      expect(elements?.body).toBeInTheDocument()
    })

    it('renders dark theme header decorations', () => {
      systemPreviewPage.render()

      const elements = systemPreviewPage.getDarkThemeElements()
      const headerElements = elements?.header?.querySelectorAll('.bg-base-content\\/30')
      expect(headerElements?.length).toBe(2)
    })

    it('renders dark theme primary elements', () => {
      systemPreviewPage.render()

      const elements = systemPreviewPage.getDarkThemeElements()
      expect(elements?.primaryButton).toBeInTheDocument()
      expect(elements?.primaryPanel).toBeInTheDocument()
    })
  })

  describe('layout', () => {
    it('applies flex layout to container', () => {
      systemPreviewPage.render()

      expect(systemPreviewPage.container).toHaveClass('flex')
    })

    it('applies equal width to both halves', () => {
      systemPreviewPage.render()

      const lightHalf = systemPreviewPage.lightThemeHalf
      const darkHalf = systemPreviewPage.darkThemeHalf

      expect(lightHalf).toHaveClass('flex-1')
      expect(darkHalf).toHaveClass('flex-1')
    })
  })
})
