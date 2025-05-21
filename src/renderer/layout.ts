import type { Task } from "../core/types.js";

/**
 * Represents the grid structure for rendering.
 */
export type Scale = "ms" | "second" | "minute" | "hour";

export interface Grid {
  dates: Date[];
  rows: {
    label: string;
    depth: number;
    cells: boolean[];
    tags?: string[];
  }[];
  labelWidth: number;
}

/**
 * Generate a grid of time points and task rows for the schedule.
 * Points are inclusive from earliest start to latest end.
 */
export function generateGrid(tasks: Task[], scale: Scale = "second"): Grid {
  if (tasks.length === 0) {
    return { dates: [], rows: [], labelWidth: 0 };
  }
  // Determine date range
  let minDate = tasks[0].start;
  let maxDate = tasks[0].end;
  const labelLengths: number[] = [];
  const taskMap: Record<string, Task> = {};

  // Build lookup map first so we can follow parent chains
  tasks.forEach((t) => {
    taskMap[t.label] = t;
  });

  // Helper to compute depth by traversing the parent chain
  function getDepth(task: Task): number {
    let depth = 0;
    let current = task.parent;
    while (current && taskMap[current]) {
      depth += 1;
      current = taskMap[current].parent;
    }
    return depth;
  }

  tasks.forEach((t) => {
    if (t.start < minDate) minDate = t.start;
    if (t.end > maxDate) maxDate = t.end;
    const depth = getDepth(t);
    // length plus indentation for nested tasks
    labelLengths.push(t.label.length + depth * 2);
  });
  // Build time array according to scale
  const stepMs =
    scale === "ms"
      ? 1
      : scale === "second"
        ? 1000
        : scale === "minute"
          ? 60 * 1000
          : 60 * 60 * 1000;
  const dates: Date[] = [];
  for (let t = minDate.getTime(); t <= maxDate.getTime(); t += stepMs) {
    dates.push(new Date(t));
  }
  // Compute rows
  const rows = tasks.map((t) => {
    const depth = getDepth(t);
    const cells = dates.map((d) => d >= t.start && d <= t.end);
    return { label: t.label, depth, cells, tags: t.tags };
  });
  const labelWidth = Math.max(...labelLengths);
  return { dates, rows, labelWidth };
}
