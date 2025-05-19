import { parseSchedule, version, renderSchedule } from './index.js';

/**
 * CLI entry point for ganttscape.
 */
function main(): void {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: ganttscape <schedule.yaml|json>');
    process.exit(1);
  }
  const [filePath] = args;
  console.log(`ganttscape v${version}`);
  const schedule = parseSchedule(filePath);
  const output = renderSchedule(schedule);
  if (output) {
    console.log(output);
  }
}

main();