import { describe, it, expect } from "vitest";
import { generateGrid } from "../src/renderer/layout.js";
import type { Task } from "../src/core/types.js";

describe("layout utils", () => {
  it("generateGrid with empty tasks returns empty grid", () => {
    const grid = generateGrid([], "second");
    expect(grid.dates).toHaveLength(0);
    expect(grid.rows).toHaveLength(0);
    expect(grid.labelWidth).toBe(0);
  });

  it("generateGrid computes correct dates and rows", () => {
    const tasks: Task[] = [
      {
        label: "A",
        start: new Date("2024-05-01T00:00:00Z"),
        end: new Date("2024-05-01T00:00:01Z"),
      },
    ];
    const grid = generateGrid(tasks, "second");
    expect(grid.dates.length).toBe(2);
    expect(grid.rows.length).toBe(1);
    expect(grid.rows[0].cells).toEqual([true, true]);
    expect(grid.labelWidth).toBe(1);
  });
});
