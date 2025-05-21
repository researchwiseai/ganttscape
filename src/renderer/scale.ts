import type { Scale } from './layout.js';
import type { Task } from '../core/types.js';

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
export function inferScheduleScale(tasks: Task[]): Scale {
    if (tasks.length === 0) {
        return 'second';
    }
    let min = tasks[0].start.getTime();
    let max = tasks[0].end.getTime();
    for (const t of tasks) {
        if (t.start.getTime() < min) min = t.start.getTime();
        if (t.end.getTime() > max) max = t.end.getTime();
    }
    return inferScale(max - min);
}
