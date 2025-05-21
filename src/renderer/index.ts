import chalk from 'chalk';
import type { Schedule } from '../core/types.js';
import { generateGrid, type Scale } from './layout.js';
import { formatLabel, renderDates } from './theme.js';

/**
 * Render the full schedule as an ANSI Gantt chart.
 * Supports configurable time scale, width truncation and tag-based colours.
 */
export function renderSchedule(
    schedule: Schedule,
    opts: { width?: number; scale?: Scale } = {},
): string {
    const scale = opts.scale ?? 'second';
    let { dates, rows, labelWidth } = generateGrid(schedule.tasks, scale);
    // Handle width override: truncate dates and cells
    if (opts.width !== undefined && opts.width < dates.length) {
        dates = dates.slice(0, opts.width);
        rows = rows.map((r) => ({ ...r, cells: r.cells.slice(0, opts.width) }));
    }
    if (dates.length === 0) {
        return '';
    }

    // Prepare header
    const header = ' '.repeat(labelWidth) + ' ' + renderDates(dates, scale);
    const lines: string[] = [header];

    // Build tag color mapping (max 8 colors)
    const palette = [
        chalk.green,
        chalk.blue,
        chalk.magenta,
        chalk.cyan,
        chalk.yellow,
        chalk.red,
        chalk.white,
        chalk.gray,
    ];
    const tagSet = new Set<string>();
    schedule.tasks.forEach((t) => t.tags?.forEach((tag) => tagSet.add(tag)));
    const tagColors = new Map<string, (txt: string) => string>();
    Array.from(tagSet).forEach((tag, i) => {
        tagColors.set(tag, palette[i % palette.length]);
    });

    // Current date marker position
    const now = new Date();
    const stepMs =
        scale === 'ms'
            ? 1
            : scale === 'second'
              ? 1000
              : scale === 'minute'
                ? 60 * 1000
                : 60 * 60 * 1000;
    const currentTime = Math.floor(now.getTime() / stepMs) * stepMs;
    const markerIndex = dates.findIndex((d) => d.getTime() === currentTime);

    // Render each task row
    rows.forEach(({ label, depth, cells, tags }) => {
        const lbl = formatLabel(label, labelWidth, depth);
        const colorFn =
            tags && tags.length && tagColors.get(tags[0]) ? tagColors.get(tags[0])! : chalk.green;
        const bar = cells
            .map((on, idx) => {
                if (idx === markerIndex) {
                    return chalk.whiteBright('│');
                }
                return on ? colorFn('█') : chalk.gray('░');
            })
            .join('');
        lines.push(lbl + ' ' + bar);
    });

    return lines.join('\n');
}
