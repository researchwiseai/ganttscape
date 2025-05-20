import { describe, it, expect } from "vitest";
import { parseSchedule, renderSchedule } from "../src/index.js";
import { join } from "path";

describe("renderSchedule", () => {
  it("renders simple schedule snapshot", () => {
    const fixture = join(__dirname, "fixtures", "simple-schedule.json");
    const schedule = parseSchedule(fixture);
    const output = renderSchedule(schedule);
    expect(output).toMatchSnapshot();
  });
});
