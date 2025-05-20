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
