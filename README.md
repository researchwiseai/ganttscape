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
--scale <day|week|month> Time scale (default: day) [daily scale only]
-w, --width <n> Truncate timeline width to n days
--no-color Disable ANSI colors
-h, --help display help for command

## Example

Given `examples/simple-schedule.yaml`:

```yaml
- label: Task A
  start: 2021-01-01
  end: 2021-01-03
- label: Task B
  start: 2021-01-02
  end: 2021-01-04
  parent: Task A
  tags: [alpha]
```

Running:

```bash
$ ganttscape examples/simple-schedule.yaml
ganttscape v0.1.0
         01-01 01-02 01-03 01-04
Task A   ███░
  Task B ░███
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
