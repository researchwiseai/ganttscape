/**
 * Core entry point for ganttscape.
 */
import { parseSchedule } from './core/parser.js';

export { parseSchedule };
export const version = '0.1.0';

/**
 * Render the Gantt chart (stub implementation).
 * @param schedule Parsed schedule of tasks
 * @returns empty string for now
 */
import { renderSchedule } from './renderer/index.js';
import { inferScale, inferScheduleScale } from './renderer/scale.js';
export { renderSchedule, inferScale, inferScheduleScale };
