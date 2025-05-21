import { readFileSync } from 'fs';
import { extname } from 'path';
import YAML from 'yaml';
import type { Task, Schedule } from './types';

function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function parseFlexibleDate(value: string): Date | null {
    const ts = Date.parse(value);
    if (!Number.isNaN(ts)) return new Date(ts);
    const match = value.match(/^(.+[+-]\d{2}:\d{2})Z$/);
    if (match) {
        const ts2 = Date.parse(match[1]);
        if (!Number.isNaN(ts2)) return new Date(ts2);
    }
    return null;
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
    const startDate = isString(start) ? parseFlexibleDate(start) : null;
    if (!startDate) {
        throw new Error(`Invalid task at index ${index}: 'start' must be a valid date string`);
    }
    const endDate = isString(end) ? parseFlexibleDate(end) : null;
    if (!endDate) {
        throw new Error(`Invalid task at index ${index}: 'end' must be a valid date string`);
    }
    if (description !== undefined && !isString(description)) {
        throw new Error(`Invalid task at index ${index}: 'description' must be a string`);
    }
    if (parent !== undefined && !isString(parent)) {
        throw new Error(`Invalid task at index ${index}: 'parent' must be a string`);
    }
    if (tags !== undefined) {
        if (!Array.isArray(tags) || !tags.every(isString)) {
            throw new Error(`Invalid task at index ${index}: 'tags' must be an array of strings`);
        }
    }
    // Parse dates and validate chronological order
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
        typeof data === 'object' &&
        data !== null &&
        'tasks' in data &&
        Array.isArray((data as Record<string, unknown>).tasks)
    ) {
        rawTasks = (data as Record<string, unknown>).tasks as unknown[];
    } else {
        throw new Error(
            `Invalid schedule format: expected an array of tasks or object with tasks property`,
        );
    }
    const tasks = rawTasks.map((raw, idx) => validateTask(raw, idx));
    // Validate that all parent references match an existing task label
    const labels = new Set(tasks.map((t) => t.label));
    tasks.forEach((task, idx) => {
        if (task.parent !== undefined && !labels.has(task.parent)) {
            throw new Error(`Invalid task at index ${idx}: parent '${task.parent}' not found`);
        }
    });
    return { tasks };
}
