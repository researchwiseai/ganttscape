## Design Document: Terminal Gantt Chart CLI (codename: **ganttscape**)

### 1. Purpose & Scope

Build an open‑source TypeScript command‑line tool that renders project timelines as Gantt‑style charts directly in Unix terminals. The first release (v0.1.0) targets **developers and DevOps engineers** who need quick, scriptable visualisations of task schedules inside CI logs or local shells.

### 2. Goals (MVP)

1. **Input → Output in one command:** `ganttscape tasks.yaml|tasks.json` prints a coloured ASCII Gantt chart.
2. **Rich task model** – label, description, start, end, optional parent & tags.
3. **Readable, width‑safe rendering** with ANSI colour support (auto‑disable when `--no‑color` or `NO_COLOR`).
4. **100 % Unix compatibility** (tested on bash/zsh and GitHub Actions Linux runners).
5. **Programmatic API** exported for embedding in other TS projects.

### 3. Non‑Goals (v0.1)

- Windows CMD/Powershell rendering
- Interactive TUI navigation
- Graphical exports (SVG/PNG)

### 4. User Personas & Use‑Cases

| Persona         | Scenario                                                                   |
| --------------- | -------------------------------------------------------------------------- |
| DevOps engineer | Adds a step in a CI pipeline to print the deployment roadmap for the week. |
| OSS maintainer  | Generates a markdown screenshot of project milestones for the README.      |
| Project lead    | Runs the CLI locally to validate YAML schedule files before committing.    |

### 5. High‑Level Architecture

```
                ┌──────────┐
(YAML / JSON) ─▶│  Parser  │
                └────┬─────┘
                     │
                     ▼
                ┌──────────────┐
                │  Task Model  │
                └────┬─────────┘
                     │
                     ▼
                ┌─────────────────┐
                │ Renderer (ANSI) │
                └────┬────────────┘
                     │
                     ▼
           Formatted ANSI string
```

- **CLI Entrypoint** (`src/cli.ts`): argument parsing & file I/O.
- **Core Library** (`src/core/`): parsing, validation, data model (strongly‑typed).
- **Renderer** (`src/renderer/`): layout calculations, colour theming, line wrapping.

### 6. Technical Stack

| Concern         | Choice             | Rationale                                                       |
| --------------- | ------------------ | --------------------------------------------------------------- |
| Language        | **TypeScript 5.x** | Types & modern syntax.                                          |
| Package manager | **Yarn 4 (Berry)** | Modern Plug'n'Play, zero‑install cache, first‑class workspaces. |
| Runtime         | **Node ≥ 18** LTS  | Built‑in ECMAScript modules & Intl.                             |
| CLI framework   | **Commander.js**   | Lightweight, one‑command CLI.                                   |
| Text styling    | **Chalk 5**        | Popular, tree‑shakeable, ESM only.                              |
| Width calc      | **string‑width**   | Correct ANSI‑aware width detection.                             |
| Date utils      | **date‑fns**       | Pure functions & ESM‑ready.                                     |
| Build           | **tsup**           | Zero‑config, ESM + CJS bundles.                                 |
| Dev runner      | **tsx**            | Instant TS execution & watch mode.                              |
| Testing         | **Vitest**         | Jest‑like syntax, fast, ESM aware.                              |

### 7. Project Structure

```
/.github/workflows/
  └─ ci.yml          # build + test matrix
/doc/
  └─ design.md       # <- this file
/examples/
/src/
  ├─ cli.ts
  ├─ index.ts        # programmatic API
  ├─ core/
  │   ├─ parser.ts
  │   └─ types.ts
  └─ renderer/
      ├─ layout.ts
      └─ theme.ts
/tests/
  ├─ fixtures/
  └─ renderer.test.ts
```

### 8. Rendering Specification

- **Time axis granularity:** day columns by default (`--scale week|month`).
- **Characters:** full block `█` for duration, light shade `░` for incomplete; fallback to `#` when Unicode not supported.
- **Colours:** auto‑assign distinct hues per tag (max 8) or use monochrome.
- **Layout rules**

  - Task label column width = longest label + padding (truncate with ellipsis).
  - Indentation for nested tasks (2‑space per level).
  - Current date marker `│` in bright white.

- **Width overflow:** wrap or cut the rightmost timeline when terminal width < chart width; support `--width` flag.

### 9. SemVer & Release Strategy

- Start at **v0.1.0**.
- Use **changesets** to bump versions & generate changelogs.
- Publish both **ESM (`dist/index.mjs`)** and **CJS (`dist/index.cjs`)** + type declarations.
- Tagged releases trigger GitHub Action to publish to npm and create GitHub Release.

### 10. CI / CD Pipeline (GitHub Actions)

1. **CI** (`ci.yml`)

   - Strategy matrix: node 18, 20; os: ubuntu‑latest.
   - Steps: install (Yarn cache), lint (eslint), test (Vitest + coverage), build (tsup), dry‑run publish.

2. **Release** (`release.yml`)

   - Trigger: push to `main` with `version/*` label.
   - Runs `changeset version && changeset publish`.
   - Generates artefacts & attaches built binaries.

### 11. Testing Strategy

- **Unit:** parser edge cases, renderer layout maths.
- **Snapshot:** expected ASCII output vs fixture strings (Vitest `toMatchSnapshot`).
- **E2E CLI:** spawn CLI via `execa`, assert exit code & stdout.
- **Coverage target:** ≥ 90 % lines.

### 12. Roadmap

| Version | Features                                                         |
| ------- | ---------------------------------------------------------------- |
| v0.1.0  | YAML+JSON input, daily scale, colours off flag, ESM+CJS bundles. |
| v0.2.0  | Weekly/month scale, CSV input, tag colour configuration.         |
| v0.3.0  | Windows ANSI support, interactive scroll mode (Ink).             |
| v1.0.0  | Mermaid export, PNG/SVG generation, plugin API, Windows GA.      |

### 13. Risks & Mitigations

| Risk                              | Impact                | Mitigation                                    |
| --------------------------------- | --------------------- | --------------------------------------------- |
| Unicode variance across terminals | Misaligned bars       | Provide test matrix, fallback characters.     |
| Chalk breaking changes (ESM only) | Build failures on CJS | Bundle with tsup, pin major version.          |
| Performance on very wide charts   | Slow logs             | Implement streaming renderer & width cut‑off. |

### 14. Decisions

1. **Input formats:** Support both YAML and JSON; **YAML** is the preferred option and offers richer features (anchors, comments).
2. **Ink integration:** Defer embedding Ink; interactive TUI planned post‑v1.0.
3. **License:** Project will be released under the **MIT License**.
