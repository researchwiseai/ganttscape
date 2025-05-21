import { Command } from 'commander';
import chalk from 'chalk';
import { parseSchedule, renderSchedule, version, inferScheduleScale } from './index.js';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import * as os from 'os';
import { join } from 'path';

const program = new Command();

program
    .name('ganttscape')
    .description('Render project timelines as Gantt-style ASCII charts in Unix terminals')
    .version(version)
    .argument('<file>', 'Path to schedule file (YAML or JSON)')
    .option('--scale <scale>', 'Time scale: auto | ms | second | minute | hour', 'auto')
    .option(
        '-w, --width <number>',
        'Truncate timeline width (number of time slots)',
        (value) => parseInt(value, 10),
        undefined,
    )
    .option('--no-color', 'Disable ANSI colors')
    .action((file, options) => {
        const { scale, width, color } = options;
        if (!['ms', 'second', 'minute', 'hour', 'auto'].includes(scale)) {
            console.error(`Unsupported scale: ${scale}`);
            process.exit(1);
        }
        if (!color) {
            chalk.level = 0;
        }
        // Validate width
        if (options.width !== undefined && (Number.isNaN(options.width) || options.width <= 0)) {
            console.error('Invalid width:', options.width);
            process.exit(1);
        }
        let schedule;
        try {
            schedule = parseSchedule(file);
        } catch (err) {
            console.error('Error parsing schedule:', err instanceof Error ? err.message : err);
            process.exit(1);
        }
        const finalScale = scale === 'auto' ? inferScheduleScale(schedule.tasks) : scale;
        let output;
        try {
            output = renderSchedule(schedule, { width, scale: finalScale });
        } catch (err) {
            console.error('Error rendering schedule:', err instanceof Error ? err.message : err);
            process.exit(1);
        }
        process.stdout.write(output + '\n');
    });

// in-source test suite
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('cli should accept a valid file and generate a valid output', () => {
    const tmp = mkdtempSync(join(os.tmpdir(), 'ganttscape-'));
    const file = join(tmp, 'sched.json');
    writeFileSync(
        file,
        JSON.stringify([
            {
                label: 'A',
                start: '2024-05-01T00:00:00Z',
                end: '2024-05-03T00:00:00Z',
            },
        ]),
        'utf-8',
    );
    const args = ['runtime', 'entrypoint', file];
    // Capture stdout and stderr
    // Capture stdout and stderr
    const stdoutChunks: string[] = []
    const stderrChunks: string[] = []
    const origStdout = process.stdout.write.bind(process.stdout)
    const origStderr = process.stderr.write.bind(process.stderr)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(process.stdout as any).write = (chunk: any, ...args: any[]) => {
        stdoutChunks.push(chunk.toString())
        // return origStdout(chunk, ...args)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(process.stderr as any).write = (chunk: any, ...args: any[]) => {
        stderrChunks.push(chunk.toString())
        return origStderr(chunk, ...args)
    }

    // invoke the CLI in-process
    program.parse(args)

    // restore
    process.stdout.write = origStdout
    process.stderr.write = origStderr

    // Check the output
    const output = stdoutChunks.join('')
    expect(output).toContain('A')
    expect(stderrChunks.join('')).toBe('')
    rmSync(tmp, { recursive: true, force: true });
  })
}

export default program;