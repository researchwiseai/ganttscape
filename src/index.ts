/**
 * Core entry point for ganttscape.
 */
import { parseSchedule } from './core/parser.js';
import type { Schedule } from './core/types.js';

export { parseSchedule };
export const version = '0.1.0';

/**
 * Render the Gantt chart (stub implementation).
 * @param schedule Parsed schedule of tasks
 * @returns empty string for now
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function render(_schedule: Schedule): string {
  return '';
}