# ganttscape

ganttscape is an open-source TypeScript command-line tool for rendering project timelines as Gantt-style charts directly in Unix terminals.

## Installation

Install globally via npm:

```bash
npm install --global ganttscape
```

Or via Yarn:

```bash
yarn global add ganttscape
```

## Usage

$ ganttscape [options] <file>

Options:
-V, --version output the version number
--scale <auto|ms|second|minute|hour> Time scale (default: auto)
-w, --width <n> Truncate timeline width to n time slots
--no-color Disable ANSI colors
-h, --help display help for command

## Example

Given `examples/parallel-analysis.yaml`:

```yaml
- label: Load Data
  start: 2024-05-01T00:00:00.000Z
  end: 2024-05-01T00:00:05.000Z
- label: Analyze Sample A
  start: 2024-05-01T00:00:05.000Z
  end: 2024-05-01T00:00:20.000Z
  parent: Load Data
  tags: [analysis]
- label: Analyze Sample B
  start: 2024-05-01T00:00:05.000Z
  end: 2024-05-01T00:00:18.000Z
  parent: Load Data
  tags: [analysis]
- label: Collate Results
  start: 2024-05-01T00:00:20.000Z
  end: 2024-05-01T00:00:25.000Z
  parent: Analyze Sample A
  tags: [result]
```

Running (default auto scale):

```bash
$ ganttscape examples/parallel-analysis.yaml
ganttscape v0.1.0
         00:00:00 00:00:05 00:00:10 00:00:15 00:00:20 00:00:25
Load Data          █████
  Analyze Sample A ░████████████████
  Analyze Sample B ░██████████████
  Collate Results  ░░░░░█████
```

## Architecture

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
