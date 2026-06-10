import { describe, it, expect } from 'vitest'
import { FIGURAS, AGENTS, ALL_AGENTS, isFigura } from './agents'

describe('agents registry', () => {
  it('has all 10 figuras', () => {
    expect(FIGURAS).toHaveLength(10)
    expect(ALL_AGENTS).toHaveLength(10)
  })

  it('maps each figura to its own id and hue token', () => {
    for (const f of FIGURAS) {
      expect(AGENTS[f].id).toBe(f)
      expect(AGENTS[f].hueToken).toBe(`--ag-${f}`)
    }
  })

  it('describes hermes as DevOps on Sonnet', () => {
    expect(AGENTS.hermes.role).toContain('DevOps')
    expect(AGENTS.hermes.model).toBe('Sonnet')
  })

  it('keeps roster order in ALL_AGENTS', () => {
    expect(ALL_AGENTS.map((a) => a.id)).toEqual([...FIGURAS])
  })

  it('narrows valid names with isFigura', () => {
    expect(isFigura('hermes')).toBe(true)
    expect(isFigura('nobody')).toBe(false)
  })
})
