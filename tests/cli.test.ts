import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import * as os from 'os';

describe('CLI integration', () => {
  it('runs and outputs header and chart', () => {
    const tmp = mkdtempSync(join(os.tmpdir(), 'ganttscape-'));
    const file = join(tmp, 'sched.json');
    const data = [{ label: 'A', start: '2021-01-01', end: '2021-01-01' }];
    writeFileSync(file, JSON.stringify(data), 'utf-8');
    const result = spawnSync('yarn', ['dev', file], { encoding: 'utf-8' });
    const out = result.stdout;
    expect(out).toContain('ganttscape v0.1.0');
    expect(out).toContain('01-01');
    expect(out).toContain('█');
    rmSync(tmp, { recursive: true, force: true });
  });
});