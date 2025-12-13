import { render, within } from '@testing-library/react'
import CTAPanel from './CTAPanel'

export const ctaPanelPage = {
  render(children: React.ReactNode) {
    const { container } = render(<CTAPanel>{children}</CTAPanel>)
    return container
  },

  get panel() {
    // The fixed position panel has these specific classes
    return document.querySelector('.fixed.bottom-0.inset-x-0.z-40') as HTMLElement
  },

  getChildContent() {
    // Get the inner content div
    const panel = this.panel
    return within(panel).getByRole('generic')
  },
}
