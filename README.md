# TALOS · Web

Web console for the **TALOS** multi-agent orchestration platform — a "hybrid terminal-web"
re-imagining of the Go + Bubbletea TUI (`platform/console`). Keeps the terminal soul (keyboard,
density, monospace) and adds web hierarchy, per-agent identity color, and direct interaction.

## Stack

- **React 18.3** + **Vite** + **TypeScript** (strict)
- **vitest** + React Testing Library (strict TDD — test first)
- **React Router** for navigation
- ESLint (flat) + Prettier
- IBM Plex Sans / Mono, self-hosted via `@fontsource`
- Design system carried verbatim from the Claude Design handoff: `src/styles/talos-system.css`
  (scoped under `.tw`, oklch tokens, one identity hue per agent). **Do not reformat it.**

## Scripts

```bash
npm run dev         # Vite dev server (fixtures by default)
npm run dev:all     # front + gateway together, one command (front talks to the live API)
npm run dev:api     # the Go gateway only (talos/platform/webapi, `go run` — no binaries, just git)
npm test            # vitest (watch)
npm run test:run    # vitest run (CI / one-shot)
npm run coverage    # vitest run --coverage
npm run typecheck   # tsc -b --noEmit
npm run lint        # eslint .
npm run format      # prettier --write .
npm run build       # tsc -b && vite build  (CI only — do NOT build in the dev loop)
```

## Environment

The console reads its data through a swappable `TalosRepository`. Configure via a local `.env`
(see the variables below; copy them into `.env` — it is git-ignored):

| Var | Default | Meaning |
| --- | --- | --- |
| `VITE_DATA_SOURCE` | `fixtures` | `fixtures` (in-memory, seeded from the design) or `http` (the Go gateway) |
| `VITE_TALOS_API_BASE` | _(empty)_ | Base URL of the TALOS HTTP gateway when `VITE_DATA_SOURCE=http`, e.g. `http://localhost:8100` |

The TALOS backend exposes no HTTP API yet, so the console ships fixture-backed. A read-only Go
gateway (`talos/platform/webapi`) is planned to serve the same data; swapping to it is a one-adapter
change (no view/container edits).

## Architecture

Atomic design + container/presentational. `domain/` holds pure types and logic, `data/` the
repository seam + fixtures, `components/` the atoms/molecules/organisms, `views/` the presentational
screens, `containers/` the data-feeding wrappers. See the plan for the full map.
