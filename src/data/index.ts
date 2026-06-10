import type { TalosRepository } from './repository'
import { createFixtureRepository } from './fixtureRepository'
import { createHttpRepository } from './httpRepository'

export type { TalosRepository } from './repository'

/**
 * Picks the data adapter from the environment.
 *
 * Defaults to the local TALOS gateway (`http://localhost:8100`) — TALOS is a
 * console for a real backend, so live data is the default. Set
 * `VITE_DATA_SOURCE=fixtures` to opt out (demos/storybook without a gateway).
 */
export function createRepository(): TalosRepository {
  const source = import.meta.env.VITE_DATA_SOURCE ?? 'http'
  const base = import.meta.env.VITE_TALOS_API_BASE ?? 'http://localhost:8100'
  if (source === 'fixtures' || !base) return createFixtureRepository()
  return createHttpRepository(base)
}
