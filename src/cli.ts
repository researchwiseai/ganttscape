/* eslint-disable no-console */
import { version, render } from './index.js';

/**
 * CLI entry point for ganttscape.
 */
function main(): void {
  console.log(`ganttscape v${version}`);
  const output = render();
  if (output) {
    console.log(output);
  }
}

main();