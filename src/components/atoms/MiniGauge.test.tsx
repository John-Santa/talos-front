import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MiniGauge } from './MiniGauge'

describe('MiniGauge', () => {
  it('sets bar width from the value', () => {
    const { container } = render(<MiniGauge value={42} />)
    const bar = container.querySelector<HTMLElement>('.gauge > i')
    expect(bar?.style.width).toBe('42%')
  })

  it('never collapses the bar below 1.5%', () => {
    const { container } = render(<MiniGauge value={0} />)
    const bar = container.querySelector<HTMLElement>('.gauge > i')
    expect(bar?.style.width).toBe('1.5%')
  })

  it('places the threshold tick at the threshold percent', () => {
    const { container } = render(<MiniGauge value={0} threshold={15} />)
    const thr = container.querySelector<HTMLElement>('.thr')
    expect(thr?.style.left).toBe('15%')
  })
})
