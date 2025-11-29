import { describe, it, expect } from 'vitest'
import { layoutPage } from './Layout.page'

describe('Layout', () => {
  describe('navbar', () => {
    it('renders the navbar', () => {
      layoutPage.render()
      expect(layoutPage.navbar).toBeInTheDocument()
    })

    it('renders the brand link with correct text', () => {
      layoutPage.render()
      expect(layoutPage.brandLink).toBeInTheDocument()
      expect(layoutPage.brandLink).toHaveTextContent('FortyMM')
    })

    it('brand link points to home page', () => {
      layoutPage.render()
      expect(layoutPage.brandLink).toHaveAttribute('href', '/')
    })
  })

  describe('main content area', () => {
    it('renders the main element', () => {
      layoutPage.render()
      expect(layoutPage.main).toBeInTheDocument()
    })

    it('renders outlet content inside main', () => {
      layoutPage.render(<div>Test Content</div>)
      expect(layoutPage.getOutletContent('Test Content')).toBeInTheDocument()
    })

    it('renders complex outlet content', () => {
      layoutPage.render(
        <div>
          <h1>Welcome</h1>
          <p>This is a test paragraph</p>
        </div>
      )
      expect(layoutPage.getOutletContent('Welcome')).toBeInTheDocument()
      expect(layoutPage.getOutletContent('This is a test paragraph')).toBeInTheDocument()
    })
  })
})
