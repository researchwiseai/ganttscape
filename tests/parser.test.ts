import { describe, it, expect } from 'vitest';
import { parseSchedule } from '../src/core/parser';
import { writeFileSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

function writeTempFile(content: string, ext: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'ganttscape-'));
  const filePath = join(dir, `schedule${ext}`);
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

describe('parseSchedule', () => {
  it('parses JSON array of tasks', () => {
    const tasks = [{ label: 'Task1', start: '2021-01-01', end: '2021-01-02' }];
    const file = writeTempFile(JSON.stringify(tasks), '.json');
    const schedule = parseSchedule(file);
    expect(schedule.tasks).toHaveLength(1);
    expect(schedule.tasks[0].label).toBe('Task1');
    expect(schedule.tasks[0].start).toEqual(new Date('2021-01-01'));
    expect(schedule.tasks[0].end).toEqual(new Date('2021-01-02'));
    rmSync(file, { recursive: true, force: true });
  });

  it('parses YAML top-level array of tasks', () => {
    const yaml = `
- label: TaskY
  start: '2021-02-01'
  end: '2021-02-02'
`;
    const file = writeTempFile(yaml, '.yaml');
    const schedule = parseSchedule(file);
    expect(schedule.tasks[0].label).toBe('TaskY');
    expect(schedule.tasks[0].start).toEqual(new Date('2021-02-01'));
    expect(schedule.tasks[0].end).toEqual(new Date('2021-02-02'));
    rmSync(file, { recursive: true, force: true });
  });

  it('parses object with tasks property', () => {
    const obj = { tasks: [{ label: 'TaskObj', start: '2021-03-01', end: '2021-03-02' }] };
    const file = writeTempFile(JSON.stringify(obj), '.json');
    const schedule = parseSchedule(file);
    expect(schedule.tasks[0].label).toBe('TaskObj');
    rmSync(file, { recursive: true, force: true });
  });

  it('throws on missing required field label', () => {
    const bad = [{ start: '2021-01-01', end: '2021-01-02' }];
    const file = writeTempFile(JSON.stringify(bad), '.json');
    expect(() => parseSchedule(file)).toThrow(/label/);
    rmSync(file, { recursive: true, force: true });
  });

  it('throws on invalid date', () => {
    const bad = [{ label: 'T', start: 'invalid', end: '2021-01-01' }];
    const file = writeTempFile(JSON.stringify(bad), '.json');
    expect(() => parseSchedule(file)).toThrow(/'start' must be a valid date string/);
    rmSync(file, { recursive: true, force: true });
  });

  it('throws on unsupported extension', () => {
    const file = writeTempFile('[]', '.txt');
    expect(() => parseSchedule(file)).toThrow(/Unsupported file extension/);
    rmSync(file, { recursive: true, force: true });
  });
});