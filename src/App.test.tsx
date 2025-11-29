import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { appPage } from './App.page'

describe('App', () => {
  describe('routing', () => {
    it('renders the layout on the root route', () => {
      appPage.render('/')
      expect(appPage.navbar).toBeInTheDocument()
      expect(appPage.main).toBeInTheDocument()
    })

    it('renders the landing page content on the root route', () => {
      appPage.render('/')
      expect(screen.getByRole('button', { name: /count is/ })).toBeInTheDocument()
    })

    it('renders the brand link in the navbar', () => {
      appPage.render('/')
      expect(appPage.brandLink).toBeInTheDocument()
    })
  })

  describe('layout structure', () => {
    it('has the navbar with FortyMM branding', () => {
      appPage.render('/')
      expect(appPage.brandLink).toHaveTextContent('FortyMM')
    })

    it('has a main content area', () => {
      appPage.render('/')
      expect(appPage.main).toBeInTheDocument()
    })
  })
})
