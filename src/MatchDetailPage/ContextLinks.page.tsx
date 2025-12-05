import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ContextLinks, { type ContextLinksProps } from './ContextLinks'

export const contextLinksPage = {
  render(options: Partial<ContextLinksProps> = {}) {
    const props: ContextLinksProps = {
      context: options.context ?? [],
    }
    render(
      <MemoryRouter>
        <ContextLinks {...props} />
      </MemoryRouter>
    )
    return props
  },

  queryContainer() {
    return screen.queryByTestId('context-links')
  },

  getLink(name: string) {
    return screen.getByRole('link', { name: new RegExp(name, 'i') })
  },

  queryLink(name: string) {
    return screen.queryByRole('link', { name: new RegExp(name, 'i') })
  },
}
