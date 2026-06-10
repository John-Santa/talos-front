import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts (the design system uses IBM Plex Sans for UI/prose and
// IBM Plex Mono for data/paths/hashes). Pinning the metrics avoids reflow.
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/ibm-plex-sans/400-italic.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import '@fontsource/ibm-plex-mono/700.css'
import '@fontsource/ibm-plex-mono/400-italic.css'

import './styles/global.css'
import './styles/talos-system.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
