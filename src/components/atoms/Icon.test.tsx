import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders a glyph svg with a path', () => {
    const { container } = render(<Icon k="orchestration" />)
    const svg = container.querySelector('svg.glyph')
    expect(svg).not.toBeNull()
    expect(svg?.querySelector('path')).not.toBeNull()
  })

  it('fills orchestration/sdd glyphs and strokes the rest', () => {
    const { container: filled } = render(<Icon k="sdd" />)
    expect(filled.querySelector('svg')?.getAttribute('fill')).toBe('currentColor')
    const { container: stroked } = render(<Icon k="gates" />)
    expect(stroked.querySelector('svg')?.getAttribute('fill')).toBe('none')
  })

  it('adds a center mark for judgment', () => {
    const { container } = render(<Icon k="judgment" />)
    expect(container.querySelector('circle')).not.toBeNull()
  })
})
