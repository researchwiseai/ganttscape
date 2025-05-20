import chalk from "chalk";
import stringWidth from "string-width";

/**
 * Format the task label with indentation and fixed width, truncating with ellipsis.
 */
export function formatLabel(label: string, width: number, depth = 0): string {
  const indent = " ".repeat(depth * 2);
  const available = width - indent.length;
  let text = label;
  if (stringWidth(text) > available) {
    text = text.slice(0, available - 1) + "…";
  }
  return indent + text.padEnd(available);
}

/**
 * Render a row of blocks: filled for active days, shaded otherwise.
 */
export function renderBar(cells: boolean[]): string {
  return cells.map((on) => (on ? chalk.green("█") : chalk.gray("░"))).join("");
}

/**
 * Render the date header in dim style as MM-DD columns separated by space.
 */
export function renderDates(dates: Date[]): string {
  return dates
    .map((d) => {
      const mon = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return chalk.dim(`${mon}-${day}`);
    })
    .join(" ");
}
