import type { TalosRepository } from './repository'
import { createFixtureRepository } from './fixtureRepository'
import { createHttpRepository } from './httpRepository'

export type { TalosRepository } from './repository'

/** Picks the data adapter from the environment (fixtures by default). */
export function createRepository(): TalosRepository {
  const source = import.meta.env.VITE_DATA_SOURCE ?? 'fixtures'
  const base = import.meta.env.VITE_TALOS_API_BASE ?? ''
  if (source === 'http' && base) return createHttpRepository(base)
  return createFixtureRepository()
}
