# Repository Guidelines for Codex Agents

This project is a TypeScript CLI for rendering ASCII Gantt charts. It uses Yarn
Berry (v4) with the node-modules linker and targets Node.js 18+. All source code
lives under `src/` and unit tests under `tests/`.

## Development conventions

- **TypeScript & ESM** – All code is TypeScript using ECMAScript modules. Import
  files with explicit `.js` extensions when referencing compiled output.
- **Linting** – The repository uses ESLint with `@typescript-eslint` rules.
- **Testing** – Tests are written with Vitest. Coverage is expected to be high
  (>90 %) as noted in `design-doc.md`.
- **Building** – Production bundles are generated with `tsup` into `dist/`.
- **CI** – GitHub Actions run `yarn lint`, `yarn test`, type checks and build.

## Required commands before committing

Run the following to ensure consistency:

```bash
# Install dependencies if needed
yarn install --immutable
# Lint and test
yarn lint
yarn test
```

If type definitions change, also run:

```bash
npx tsc --noEmit
```

Commits should have concise messages using the conventional `feat:`, `fix:`,
`docs:`, `chore:` prefixes where appropriate.

