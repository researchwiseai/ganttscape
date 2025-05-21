import { describe, it, expect } from "vitest";
import { inferScale, inferScheduleScale } from "../src/renderer/scale.js";
import type { Task } from "../src/core/types.js";

describe("inferScale", () => {
  it("returns ms for durations up to 1s", () => {
    expect(inferScale(1)).toBe("ms");
    expect(inferScale(1000)).toBe("ms");
  });

  it("returns second for durations up to 1 minute", () => {
    expect(inferScale(1001)).toBe("second");
    expect(inferScale(60 * 1000)).toBe("second");
  });

  it("returns minute for durations up to 1 hour", () => {
    expect(inferScale(60 * 1000 + 1)).toBe("minute");
    expect(inferScale(60 * 60 * 1000)).toBe("minute");
  });

  it("returns hour for longer durations", () => {
    expect(inferScale(60 * 60 * 1000 + 1)).toBe("hour");
  });
});

describe("inferScheduleScale", () => {
  it("handles empty task list", () => {
    expect(inferScheduleScale([])).toBe("second");
  });

  it("infers hour scale for multi-day schedule", () => {
    const tasks: Task[] = [
      {
        label: "A",
        start: new Date("2021-01-01"),
        end: new Date("2021-01-03"),
      },
    ];
    expect(inferScheduleScale(tasks)).toBe("hour");
  });

  it("uses terminal width when provided", () => {
    const tasks: Task[] = [
      {
        label: "A",
        start: new Date("2024-05-01T00:00:00Z"),
        end: new Date("2024-05-01T00:00:10Z"),
      },
    ];
    expect(inferScheduleScale(tasks, 100)).toBe("second");
    expect(inferScheduleScale(tasks, 10)).toBe("minute");
  });
});
