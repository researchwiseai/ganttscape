import { readFileSync } from 'fs';
import { extname } from 'path';
import YAML from 'yaml';
import type { Task, Schedule } from './types';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function validateTask(raw: unknown, index: number): Task {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error(`Invalid task at index ${index}: not an object`);
  }
  const obj = raw as Record<string, unknown>;
  const { label, start, end, description, parent, tags } = obj;
  if (!isString(label) || !label.trim()) {
    throw new Error(
      `Invalid task at index ${index}: 'label' is required and must be a non-empty string`,
    );
  }
  if (!isString(start) || Number.isNaN(Date.parse(start))) {
    throw new Error(
      `Invalid task at index ${index}: 'start' must be a valid date string`,
    );
  }
  if (!isString(end) || Number.isNaN(Date.parse(end))) {
    throw new Error(
      `Invalid task at index ${index}: 'end' must be a valid date string`,
    );
  }
  if (description !== undefined && !isString(description)) {
    throw new Error(
      `Invalid task at index ${index}: 'description' must be a string`,
    );
  }
  if (parent !== undefined && !isString(parent)) {
    throw new Error(`Invalid task at index ${index}: 'parent' must be a string`);
  }
  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every(isString)) {
      throw new Error(
        `Invalid task at index ${index}: 'tags' must be an array of strings`,
      );
    }
  }
  // Parse dates and validate chronological order
  const startDate = new Date(start as string);
  const endDate = new Date(end as string);
  if (endDate < startDate) {
    throw new Error(
      `Invalid task at index ${index}: 'end' date (${end}) is before 'start' date (${start})`,
    );
  }
  return {
    label,
    start: startDate,
    end: endDate,
    ...(description !== undefined ? { description } : {}),
    ...(parent !== undefined ? { parent } : {}),
    ...(tags !== undefined ? { tags } : {}),
  };
}

/**
 * Parse a schedule file (.json, .yaml, .yml) and return a Schedule.
 * @param filePath Path to the schedule file
 * @throws Error if parsing or validation fails
 */
export function parseSchedule(filePath: string): Schedule {
  const content = readFileSync(filePath, 'utf-8');
  const ext = extname(filePath).toLowerCase();
  let data: unknown;
  if (ext === '.yaml' || ext === '.yml') {
    data = YAML.parse(content);
  } else if (ext === '.json') {
    try {
      data = JSON.parse(content);
    } catch (e) {
      throw new Error(`Failed to parse JSON: ${(e as Error).message}`);
    }
  } else {
    throw new Error(
      `Unsupported file extension '${ext}'. Only .yaml, .yml, .json are supported.`,
    );
  }
  let rawTasks: unknown[];
  if (Array.isArray(data)) {
    rawTasks = data;
  } else if (
    typeof data === 'object' && data !== null &&
    'tasks' in data && Array.isArray((data as Record<string, unknown>).tasks)
  ) {
    rawTasks = (data as Record<string, unknown>).tasks as unknown[];
  } else {
    throw new Error(
      `Invalid schedule format: expected an array of tasks or object with tasks property`,
    );
  }
  const tasks = rawTasks.map((raw, idx) => validateTask(raw, idx));
  return { tasks };
}