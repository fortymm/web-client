import { describe, it, expect, vi } from 'vitest'
import { matchLengthControlPage } from './MatchLengthControl.page'
import { type MatchLength } from './MatchLengthControl'

describe('MatchLengthControl', () => {
  it('displays the match length label', () => {
    matchLengthControlPage.render()
    expect(matchLengthControlPage.label).toBeInTheDocument()
  })

  it('renders all four options', () => {
    matchLengthControlPage.render()
    expect(matchLengthControlPage.allRadios).toHaveLength(4)
    expect(matchLengthControlPage.getRadio(1)).toBeInTheDocument()
    expect(matchLengthControlPage.getRadio(3)).toBeInTheDocument()
    expect(matchLengthControlPage.getRadio(5)).toBeInTheDocument()
    expect(matchLengthControlPage.getRadio(7)).toBeInTheDocument()
  })

  it('has accessible group', () => {
    matchLengthControlPage.render()
    expect(matchLengthControlPage.group).toBeInTheDocument()
  })

  it('shows correct option as checked based on value prop', () => {
    matchLengthControlPage.render({ value: 3 })
    expect(matchLengthControlPage.getRadio(3)).toBeChecked()
    expect(matchLengthControlPage.getRadio(1)).not.toBeChecked()
    expect(matchLengthControlPage.getRadio(5)).not.toBeChecked()
    expect(matchLengthControlPage.getRadio(7)).not.toBeChecked()
  })

  it('defaults to 5 when no value specified in page object', () => {
    matchLengthControlPage.render()
    expect(matchLengthControlPage.getRadio(5)).toBeChecked()
  })

  it.each([
    { clickLength: 1, startValue: 3 },
    { clickLength: 3, startValue: 1 },
    { clickLength: 5, startValue: 1 },
    { clickLength: 7, startValue: 1 },
  ] as { clickLength: MatchLength; startValue: MatchLength }[])(
    'calls onChange with $clickLength when clicking that option',
    async ({ clickLength, startValue }) => {
      const { onChange } = matchLengthControlPage.render({ value: startValue })
      await matchLengthControlPage.selectLength(clickLength)
      expect(onChange).toHaveBeenCalledWith(clickLength)
    }
  )

  describe('disabled state', () => {
    it('disables all radios when disabled prop is true', () => {
      matchLengthControlPage.render({ disabled: true })
      matchLengthControlPage.allRadios.forEach((radio) => {
        expect(radio).toBeDisabled()
      })
    })

    it('prevents onChange when disabled', async () => {
      const onChange = vi.fn()
      matchLengthControlPage.render({ value: 5, onChange, disabled: true })
      await matchLengthControlPage.selectLength(3)
      expect(onChange).not.toHaveBeenCalled()
    })

    it('applies btn-disabled class when disabled', () => {
      matchLengthControlPage.render({ disabled: true })
      matchLengthControlPage.allButtons.forEach((button) => {
        expect(button).toHaveClass('btn-disabled')
      })
    })
  })

  describe('styling', () => {
    it('has join styling on all buttons', () => {
      matchLengthControlPage.render()
      matchLengthControlPage.allButtons.forEach((button) => {
        expect(button).toHaveClass('join-item', 'btn', 'btn-sm', 'flex-1')
      })
    })

    it('has minimum touch target height', () => {
      matchLengthControlPage.render()
      matchLengthControlPage.allButtons.forEach((button) => {
        expect(button).toHaveClass('min-h-[44px]')
      })
    })

    it('highlights selected button with accent color', () => {
      matchLengthControlPage.render({ value: 3 })
      expect(matchLengthControlPage.getButton(3)).toHaveClass('has-[:checked]:btn-accent')
    })
  })

  describe('keyboard accessibility', () => {
    it('radios are keyboard accessible', () => {
      matchLengthControlPage.render()
      matchLengthControlPage.allRadios.forEach((radio) => {
        expect(radio).not.toHaveAttribute('tabindex', '-1')
      })
    })
  })
})
