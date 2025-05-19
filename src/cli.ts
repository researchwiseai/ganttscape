import chalk from 'chalk';
import { parseSchedule, version, renderSchedule } from './index.js';

/**
 * CLI entry point for ganttscape.
 */
function main(): void {
  const args = process.argv.slice(2);
  // Handle --no-color flag
  const noColorIdx = args.findIndex((a) => a === '--no-color');
  if (noColorIdx !== -1) {
    chalk.level = 0;
    args.splice(noColorIdx, 1);
  }
  // Handle width option
  let width: number | undefined;
  const widthIdx = args.findIndex((a) => a === '--width' || a === '-w');
  if (widthIdx !== -1) {
    const w = Number(args[widthIdx + 1]);
    if (Number.isNaN(w) || w <= 0) {
      console.error('Invalid width:', args[widthIdx + 1]);
      process.exit(1);
    }
    width = w;
    args.splice(widthIdx, 2);
  }
  if (args.length < 1) {
    console.error('Usage: ganttscape [--no-color] [--width N] <schedule.yaml|json>');
    process.exit(1);
  }
  const [filePath] = args;
  console.log(`ganttscape v${version}`);
  const schedule = parseSchedule(filePath);
  const output = renderSchedule(schedule, { width });
  if (output) {
    console.log(output);
  }
}

main();