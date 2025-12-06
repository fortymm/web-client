import { describe, it, expect } from 'vitest'
import { searchTodoCardPage } from './SearchTodoCard.page'

describe('SearchTodoCard', () => {
  it('renders status container', () => {
    searchTodoCardPage.render()
    expect(searchTodoCardPage.status).toBeInTheDocument()
  })

  it('displays coming soon title', () => {
    searchTodoCardPage.render()
    expect(searchTodoCardPage.title).toBeInTheDocument()
  })

  it('displays work in progress subtitle', () => {
    searchTodoCardPage.render()
    expect(searchTodoCardPage.subtitle).toBeInTheDocument()
  })
})
