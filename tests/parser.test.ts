import { describe, it, expect } from "vitest";
import { parseSchedule } from "../src/core/parser";
import { writeFileSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

function writeTempFile(content: string, ext: string): string {
  const dir = mkdtempSync(join(tmpdir(), "ganttscape-"));
  const filePath = join(dir, `schedule${ext}`);
  writeFileSync(filePath, content, "utf-8");
  return filePath;
}

describe("parseSchedule", () => {
  it("parses JSON array of tasks", () => {
    const tasks = [{ label: "Task1", start: "2021-01-01", end: "2021-01-02" }];
    const file = writeTempFile(JSON.stringify(tasks), ".json");
    const schedule = parseSchedule(file);
    expect(schedule.tasks).toHaveLength(1);
    expect(schedule.tasks[0].label).toBe("Task1");
    expect(schedule.tasks[0].start).toEqual(new Date("2021-01-01"));
    expect(schedule.tasks[0].end).toEqual(new Date("2021-01-02"));
    rmSync(file, { recursive: true, force: true });
  });

  it("parses YAML top-level array of tasks", () => {
    const yaml = `
- label: TaskY
  start: '2021-02-01'
  end: '2021-02-02'
`;
    const file = writeTempFile(yaml, ".yaml");
    const schedule = parseSchedule(file);
    expect(schedule.tasks[0].label).toBe("TaskY");
    expect(schedule.tasks[0].start).toEqual(new Date("2021-02-01"));
    expect(schedule.tasks[0].end).toEqual(new Date("2021-02-02"));
    rmSync(file, { recursive: true, force: true });
  });

  it("parses object with tasks property", () => {
    const obj = {
      tasks: [{ label: "TaskObj", start: "2021-03-01", end: "2021-03-02" }],
    };
    const file = writeTempFile(JSON.stringify(obj), ".json");
    const schedule = parseSchedule(file);
    expect(schedule.tasks[0].label).toBe("TaskObj");
    rmSync(file, { recursive: true, force: true });
  });

  it("throws on missing required field label", () => {
    const bad = [{ start: "2021-01-01", end: "2021-01-02" }];
    const file = writeTempFile(JSON.stringify(bad), ".json");
    expect(() => parseSchedule(file)).toThrow(/label/);
    rmSync(file, { recursive: true, force: true });
  });

  it("throws on invalid date", () => {
    const bad = [{ label: "T", start: "invalid", end: "2021-01-01" }];
    const file = writeTempFile(JSON.stringify(bad), ".json");
    expect(() => parseSchedule(file)).toThrow(
      /'start' must be a valid date string/,
    );
    rmSync(file, { recursive: true, force: true });
  });

  it("throws on unsupported extension", () => {
    const file = writeTempFile("[]", ".txt");
    expect(() => parseSchedule(file)).toThrow(/Unsupported file extension/);
    rmSync(file, { recursive: true, force: true });
  });
  it("throws on end date before start date", () => {
    const bad = [{ label: "T", start: "2021-01-03", end: "2021-01-02" }];
    const file = writeTempFile(JSON.stringify(bad), ".json");
    expect(() => parseSchedule(file)).toThrow(/end' date .* before 'start'/);
    rmSync(file, { recursive: true, force: true });
  });

  it("parses and includes optional fields", () => {
    const tasks = [
      { label: "parent-label", start: "2021-01-01", end: "2021-01-02" },
      {
        label: "T",
        start: "2021-01-02",
        end: "2021-01-03",
        description: "desc",
        parent: "parent-label",
        tags: ["a", "b"],
      },
    ];
    const file = writeTempFile(JSON.stringify(tasks), ".json");
    const schedule = parseSchedule(file);
    const t = schedule.tasks[1];
    expect(t.description).toBe("desc");
    expect(t.parent).toBe("parent-label");
    expect(t.tags).toEqual(["a", "b"]);
    rmSync(file, { recursive: true, force: true });
  });

  it("throws on invalid description type", () => {
    const bad = [
      { label: "T", start: "2021-01-01", end: "2021-01-02", description: 123 },
    ];
    const file = writeTempFile(JSON.stringify(bad), ".json");
    expect(() => parseSchedule(file)).toThrow(/description/);
    rmSync(file, { recursive: true, force: true });
  });

  it("throws on invalid parent type", () => {
    const bad = [
      { label: "T", start: "2021-01-01", end: "2021-01-02", parent: 456 },
    ];
    const file = writeTempFile(JSON.stringify(bad), ".json");
    expect(() => parseSchedule(file)).toThrow(/parent/);
    rmSync(file, { recursive: true, force: true });
  });

  it("throws on invalid tags type", () => {
    const bad1 = [
      { label: "T", start: "2021-01-01", end: "2021-01-02", tags: "notarray" },
    ];
    const file1 = writeTempFile(JSON.stringify(bad1), ".json");
    expect(() => parseSchedule(file1)).toThrow(/tags/);
    rmSync(file1, { recursive: true, force: true });
    const bad2 = [
      { label: "T", start: "2021-01-01", end: "2021-01-02", tags: [1, 2] },
    ];
    const file2 = writeTempFile(JSON.stringify(bad2), ".json");
    expect(() => parseSchedule(file2)).toThrow(/tags/);
    rmSync(file2, { recursive: true, force: true });
  });

  it("throws when parent label does not exist", () => {
    const bad = [
      { label: "A", start: "2021-01-01", end: "2021-01-02", parent: "B" },
    ];
    const file = writeTempFile(JSON.stringify(bad), ".json");
    expect(() => parseSchedule(file)).toThrow(/parent 'B' not found/);
    rmSync(file, { recursive: true, force: true });
  });

  it("allows parent referencing a later task", () => {
    const tasks = [
      { label: "child", start: "2021-01-02", end: "2021-01-03", parent: "parent" },
      { label: "parent", start: "2021-01-01", end: "2021-01-04" },
    ];
    const file = writeTempFile(JSON.stringify(tasks), ".json");
    const schedule = parseSchedule(file);
    expect(schedule.tasks[0].parent).toBe("parent");
    rmSync(file, { recursive: true, force: true });
  });

  it("throws on invalid JSON syntax", () => {
    const file = writeTempFile("{", ".json");
    expect(() => parseSchedule(file)).toThrow(/Failed to parse JSON/);
    rmSync(file, { recursive: true, force: true });
  });

  it("throws when tasks property is not an array", () => {
    const obj = { tasks: {} };
    const file = writeTempFile(JSON.stringify(obj), ".json");
    expect(() => parseSchedule(file)).toThrow(/Invalid schedule format/);
    rmSync(file, { recursive: true, force: true });
  });
});
