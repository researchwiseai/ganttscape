 # ganttscape

 ganttscape is an open-source TypeScript command-line tool for rendering project timelines as Gantt-style charts directly in Unix terminals.

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