import { describe, it, expect } from "vitest";
import { inferScale } from "../src/renderer/scale.js";

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
