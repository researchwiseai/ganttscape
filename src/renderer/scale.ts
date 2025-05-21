import type { Scale } from "./layout.js";
import type { Task } from "../core/types.js";
import stringWidth from "string-width";

/**
 * Infer a suitable time scale based on the provided duration in milliseconds.
 * Durations up to 1s use the "ms" scale, up to 1 minute use "second",
 * up to 1 hour use "minute", otherwise "hour".
 */
export function inferScale(durationMs: number): Scale {
    if (durationMs <= 1000) return 'ms';
    if (durationMs <= 60 * 1000) return 'second';
    if (durationMs <= 60 * 60 * 1000) return 'minute';
    return 'hour';
}

/**
 * Infer a suitable scale for a full schedule by looking at the earliest
 * start and latest end times of all tasks.
 */
export function inferScheduleScale(tasks: Task[], termWidth?: number): Scale {
  if (tasks.length === 0) {
    return "second";
  }
  let min = tasks[0].start.getTime();
  let max = tasks[0].end.getTime();
  const taskMap: Record<string, Task> = {};
  tasks.forEach((t) => {
    if (t.start.getTime() < min) min = t.start.getTime();
    if (t.end.getTime() > max) max = t.end.getTime();
    taskMap[t.label] = t;
  });

  if (termWidth !== undefined && termWidth > 0) {
    function getDepth(task: Task): number {
      let depth = 0;
      let current = task.parent;
      while (current && taskMap[current]) {
        depth += 1;
        current = taskMap[current].parent;
      }
      return depth;
    }
    const labelWidth = Math.max(
      ...tasks.map((t) => stringWidth(t.label) + getDepth(t) * 2),
    );
    const steps: [Scale, number][] = [
      ["ms", 1],
      ["second", 1000],
      ["minute", 60 * 1000],
      ["hour", 60 * 60 * 1000],
    ];
    for (const [scale, stepMs] of steps) {
      const width = Math.floor((max - min) / stepMs) + 1;
      if (width <= termWidth - labelWidth - 1) {
        return scale;
      }
    }
  }

  return inferScale(max - min);
}
