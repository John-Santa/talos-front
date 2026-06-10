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

## Running in development

```bash
# Option 1 — fixtures only (no gateway required)
npm run dev

# Option 2 — front + gateway in one command
cp .env.example .env   # then edit VITE_TALOS_API_BASE if needed
npm run dev:all
```

`dev:all` starts both the Vite dev server and the Go gateway (`talos/platform/webapi` on
`:8100`). The front is served on Vite's default port (usually `:5173`). Both processes are
killed together with Ctrl-C.

## Environment

The console reads its data through a swappable `TalosRepository`. Configure via a local `.env`
(copy `.env.example` — it is git-ignored):

| Var | Default | Meaning |
| --- | --- | --- |
| `VITE_DATA_SOURCE` | `fixtures` | `fixtures` (in-memory, seeded from the design) or `http` (the Go gateway) |
| `VITE_TALOS_API_BASE` | _(empty)_ | Base URL of the TALOS HTTP gateway when `VITE_DATA_SOURCE=http`, e.g. `http://localhost:8100` |

## HTTP API (talos/platform/webapi)

The Go gateway (`talos/platform/webapi`) exposes the following endpoints. Run it via
`npm run dev:api` or as part of `npm run dev:all`.

### Read

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/orchestration` | Full orchestration snapshot (worktrees, merge order, overlap, gate state) |
| `GET` | `/api/agents` | List all agents with name, hue, and module |
| `GET` | `/api/agents/:figura` | Agent detail: current worktree, DoD checklist, activity |
| `GET` | `/api/judgment/:jiraKey` | Judgment review for a JIRA key (verdict, judges, DoD gate) |

### Write

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `POST` | `/api/worktrees` | `{ figura, jiraKey }` | Create a new worktree for the given agent |
| `DELETE` | `/api/worktrees/:figura` | — | Teardown (remove) the worktree for the given agent |
| `POST` | `/api/merge/:jiraKey` | `{ figura }` | Merge the exact branch `agent/<figura>/<jiraKey>` into develop |

> **Judgment** is wired best-effort via the `ch` CLI (Jira integration). When `ch` is
> unavailable the gateway returns `{ verdict: "pending" }` — no fabricated "agree" result.
> The front renders a "Integración pendiente" banner in that case.

## Architecture

Atomic design + container/presentational. `domain/` holds pure types and logic, `data/` the
repository seam + fixtures, `components/` the atoms/molecules/organisms, `views/` the presentational
screens, `containers/` the data-feeding wrappers.

The repository seam (`src/data/repository.ts`) decouples all views and containers from the
transport layer. Switching between fixtures and the live gateway is a one-line env change — no
view or container edits required.
