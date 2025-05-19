# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-05-19

### Added
- Core domain model (Task, Schedule, Tag) and parser supporting YAML/JSON with validation.
- ANSI renderer (daily scale): layouts, colored bars, current-day marker, label formatting.
- CLI interface (`ganttscape`): flags `--scale`, `--width`, `--no-color`, `--version`.
- TypeScript project setup: strict types, lint, test pipeline.
- Comprehensive tests (parser, renderer, theme, layout, CLI) with Vitest and snapshot.
- CI workflow for lint/test/build and dry-run npm publish; Release workflow with Changesets.