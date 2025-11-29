import { screen } from '@testing-library/react'
import { appPage } from '../App.page'

export const matchLengthControlPage = {
  render() {
    appPage.render('/matches/new')
  },

  get control() {
    return screen.getByText('Match length control placeholder')
  },
}
