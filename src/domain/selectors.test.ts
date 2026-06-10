import { describe, it, expect } from 'vitest'
import { mergeTone, gaugeWidth, statusTone, overlapTone } from './selectors'

describe('mergeTone', () => {
  it('is ok well below the threshold', () => {
    expect(mergeTone(0, 15)).toBe('ok')
    expect(mergeTone(10, 15)).toBe('ok') // 10 < 0.7*15 = 10.5
  })
  it('is warn between 0.7·threshold and the threshold', () => {
    expect(mergeTone(12, 15)).toBe('warn')
  })
  it('is danger at or above the threshold', () => {
    expect(mergeTone(15, 15)).toBe('danger')
    expect(mergeTone(20, 15)).toBe('danger')
  })
})

describe('gaugeWidth', () => {
  it('passes through values above the floor', () => {
    expect(gaugeWidth(42)).toBe(42)
  })
  it('clamps to a 1.5% minimum so the bar never vanishes', () => {
    expect(gaugeWidth(0)).toBe(1.5)
  })
})

describe('statusTone', () => {
  it('maps each status to its pill tone', () => {
    expect(statusTone('active')).toBe('ok')
    expect(statusTone('merging')).toBe('accent')
    expect(statusTone('in-review')).toBe('warn')
    expect(statusTone('idle')).toBeUndefined()
  })
})

describe('overlapTone', () => {
  it('maps OK to ok', () => {
    expect(overlapTone('OK')).toBe('ok')
  })
  it('maps WARN to warn', () => {
    expect(overlapTone('WARN')).toBe('warn')
  })
  it('maps CONFLICT to danger', () => {
    expect(overlapTone('CONFLICT')).toBe('danger')
  })
})
