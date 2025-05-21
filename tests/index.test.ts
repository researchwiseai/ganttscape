import { describe, it, expect } from "vitest";
import { version, renderSchedule } from "../src/index";
import type { Schedule } from "../src/core/types";

describe("core API", () => {
  it("version should be a valid semver string", () => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("renderSchedule returns a string", () => {
    const result = renderSchedule({ tasks: [] } as Schedule);
    expect(typeof result).toBe("string");
  });
});

describe("renderSchedule options", () => {
  const schedule: Schedule = {
    tasks: [
      {
        label: "A",
        start: new Date("2024-05-01T00:00:00Z"),
        end: new Date("2024-05-01T00:00:02Z"),
      },
    ],
  };

  it("honours width option", () => {
    const output = renderSchedule(schedule, { width: 1, scale: "second" });
    const header = output.split("\n")[0];
    const cols = header.trim().split(/\s+/);
    expect(cols).toHaveLength(1);
  });

  it("honours scale option", () => {
    const outSecond = renderSchedule(schedule, { scale: "second" });
    const outMinute = renderSchedule(schedule, { scale: "minute" });
    expect(outSecond.split("\n")[0]).toContain("00:00:01");
    expect(outMinute.split("\n")[0]).not.toContain("00:00:01");
  });
});
