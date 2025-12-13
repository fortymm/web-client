import { render } from '@testing-library/react'
import ThemePreview from './ThemePreview'

interface RenderOptions {
  variant?: 'light' | 'dark'
}

export const themePreviewPage = {
  render(options: RenderOptions = {}) {
    const { variant = 'light' } = options

    render(<ThemePreview variant={variant} />)
  },

  getThemeContainer(variant: 'light' | 'dark') {
    return document.querySelector(`[data-theme="${variant}"]`)
  },

  get previewElements() {
    const container = document.querySelector('[data-theme]')
    if (!container) return null

    return {
      container,
      header: container.querySelector('.rounded-t'),
      body: container.querySelector('.rounded-b'),
      primaryButton: container.querySelector('.bg-primary.h-2'),
      primaryPanel: container.querySelector('.bg-primary\\/20'),
      sidePanel: container.querySelector('.bg-base-300'),
    }
  },
}
