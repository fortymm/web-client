import { render } from '@testing-library/react'
import SystemPreview from './SystemPreview'

export const systemPreviewPage = {
  render() {
    render(<SystemPreview />)
  },

  get container() {
    return document.querySelector('.flex.rounded-md.overflow-hidden')
  },

  get lightThemeHalf() {
    return document.querySelector('[data-theme="light"]')
  },

  get darkThemeHalf() {
    return document.querySelector('[data-theme="dark"]')
  },

  get allThemeHalves() {
    return document.querySelectorAll('[data-theme]')
  },

  getLightThemeElements() {
    const light = this.lightThemeHalf
    if (!light) return null

    return {
      container: light,
      header: light.querySelector('.rounded-t'),
      body: light.querySelector('.rounded-b'),
      primaryButton: light.querySelector('.bg-primary.h-2'),
      primaryPanel: light.querySelector('.bg-primary\\/20'),
    }
  },

  getDarkThemeElements() {
    const dark = this.darkThemeHalf
    if (!dark) return null

    return {
      container: dark,
      header: dark.querySelector('.rounded-t'),
      body: dark.querySelector('.rounded-b'),
      primaryButton: dark.querySelector('.bg-primary.h-2'),
      primaryPanel: dark.querySelector('.bg-primary\\/20'),
    }
  },
}
