import { render, screen } from '@testing-library/vue'
import Logo from '@/components/Logo.vue'

describe('Logo', () => {
  test('is a Vue instance', () => {
    render(Logo)
    expect(screen.getByTestId('nuxt-logo')).toBeInTheDocument()
  })
})
