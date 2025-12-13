import { render, screen } from '@testing-library/react'
import FlashProvider from './FlashProvider'

export const flashProviderPage = {
  render(children: React.ReactNode) {
    render(<FlashProvider>{children}</FlashProvider>)
  },

  get toastContainer() {
    return document.querySelector('.toast')
  },

  get alerts() {
    return screen.queryAllByRole('alert')
  },
}
