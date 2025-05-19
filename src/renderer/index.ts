import type { Schedule } from '../core/types.js';
import { generateGrid } from './layout.js';
import { formatLabel, renderDates } from './theme.js';

/**
 * Render the full schedule as an ANSI Gantt chart (daily scale).
 */
import chalk from 'chalk';
export function renderSchedule(schedule: Schedule): string {
  const { dates, rows, labelWidth } = generateGrid(schedule.tasks);
  if (dates.length === 0) return '';

  // Header row: labels for each date
  const header = ' '.repeat(labelWidth) + ' ' + renderDates(dates);
  const lines = [header];
  // Determine current date marker position
  const today = new Date();
  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  const markerIndex = dates.findIndex(
    (d) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() ===
      currentDate,
  );
  // Each task row with current-date marker
  rows.forEach(({ label, depth, cells }) => {
    const lbl = formatLabel(label, labelWidth, depth);
    const bar = cells
      .map((on, idx) => {
        if (idx === markerIndex) {
          return chalk.whiteBright('│');
        }
        return on ? chalk.green('█') : chalk.gray('░');
      })
      .join('');
    lines.push(lbl + ' ' + bar);
  });

  return lines.join('\n');
}