import chalk from 'chalk';
import stringWidth from 'string-width';

/**
 * Format the task label with indentation and fixed width, truncating with ellipsis.
 */
export function formatLabel(label: string, width: number, depth = 0): string {
    const indent = ' '.repeat(depth * 2);
    const available = width - indent.length;
    let text = label;
    if (stringWidth(text) > available) {
        text = text.slice(0, available - 1) + '…';
    }
    return indent + text.padEnd(available);
}

/**
 * Render a row of blocks: filled for active days, shaded otherwise.
 */
export function renderBar(cells: boolean[]): string {
    return cells.map((on) => (on ? chalk.green('█') : chalk.gray('░'))).join('');
}

/**
 * Render the date header in dim style as MM-DD columns separated by space.
 */
import type { Scale } from './layout.js';

export function renderDates(dates: Date[], scale: Scale): string {
    return dates
        .map((d) => {
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            const ms = String(d.getMilliseconds()).padStart(3, '0');
            if (scale === 'ms') {
                return chalk.dim(`${hh}:${mm}:${ss}.${ms}`);
            }
            if (scale === 'second') {
                return chalk.dim(`${hh}:${mm}:${ss}`);
            }
            if (scale === 'minute') {
                return chalk.dim(`${hh}:${mm}`);
            }
            return chalk.dim(`${hh}`);
        })
        .join(' ');
}
