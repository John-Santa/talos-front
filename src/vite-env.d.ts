/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Which data adapter backs the console: fixtures (default) or the Go gateway. */
  readonly VITE_DATA_SOURCE?: 'fixtures' | 'http'
  /** Base URL of the TALOS HTTP gateway when VITE_DATA_SOURCE=http. */
  readonly VITE_TALOS_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
