// Extends Vitest's `expect` with jest-dom matchers (toBeInTheDocument, etc.)
// and registers automatic DOM cleanup after each test.
import '@testing-library/jest-dom/vitest'

// jsdom under vitest does not always expose localStorage; install a minimal
// in-memory Storage so the persistence hooks are testable.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>()
  const memory: Storage = {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => {
      store.delete(key)
    },
    setItem: (key, value) => {
      store.set(key, String(value))
    },
  }
  Object.defineProperty(globalThis, 'localStorage', { value: memory, configurable: true })
}
