import { describe, it, expect } from "vitest";
import { parseSchedule, renderSchedule } from "../src/index.js";
import { join } from "path";

describe("renderSchedule", () => {
  it("renders simple schedule snapshot", () => {
    const fixture = join(__dirname, "fixtures", "simple-schedule.json");
    const schedule = parseSchedule(fixture);
    const output = renderSchedule(schedule, { scale: "second" });
    expect(output).toMatchSnapshot();
  });

  it("renders nested tasks correctly", () => {
    const schedule = {
      tasks: [
        {
          label: "A",
          start: new Date("2024-05-01T00:00:00Z"),
          end: new Date("2024-05-01T00:00:03Z"),
        },
        {
          label: "B",
          start: new Date("2024-05-01T00:00:01Z"),
          end: new Date("2024-05-01T00:00:03Z"),
          parent: "A",
        },
        {
          label: "C",
          start: new Date("2024-05-01T00:00:02Z"),
          end: new Date("2024-05-01T00:00:03Z"),
          parent: "B",
        },
        {
          label: "D",
          start: new Date("2024-05-01T00:00:03Z"),
          end: new Date("2024-05-01T00:00:03Z"),
          parent: "C",
        },
      ],
    };
    const output = renderSchedule(schedule, { scale: "second" });
    expect(output).toMatchSnapshot();
  });
});
