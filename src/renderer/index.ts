import type { Schedule } from '../core/types.js';
import { generateGrid } from './layout.js';
import { formatLabel, renderBar, renderDates } from './theme.js';

/**
 * Render the full schedule as an ANSI Gantt chart (daily scale).
 */
export function renderSchedule(schedule: Schedule): string {
  const { dates, rows, labelWidth } = generateGrid(schedule.tasks);
  if (dates.length === 0) return '';

  // Header row: labels for each date
  const header = ' '.repeat(labelWidth) + ' ' + renderDates(dates);
  const lines = [header];

  // Each task row
  rows.forEach(({ label, depth, cells }) => {
    const lbl = formatLabel(label, labelWidth, depth);
    const bar = renderBar(cells);
    lines.push(lbl + ' ' + bar);
  });

  return lines.join('\n');
}