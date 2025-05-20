import { describe, it, expect } from "vitest";
import { formatLabel, renderBar, renderDates } from "../src/renderer/theme.js";
import stringWidth from "string-width";

// Simple ANSI strip for testing
function stripAnsi(str: string): string {
  return str.replace(/\u001b\[[0-9;]*m/g, "");
}

describe("theme utils", () => {
  it("formatLabel without indent pads correctly", () => {
    const lbl = formatLabel("Hi", 5, 0);
    expect(stringWidth(lbl)).toBe(5);
    expect(lbl).toBe("Hi   ");
  });

  it("formatLabel with indent prepends spaces", () => {
    const lbl = formatLabel("Task", 8, 1);
    expect(lbl.startsWith("  ")).toBe(true);
    expect(stringWidth(lbl)).toBe(8);
  });

  it("formatLabel truncates long labels with ellipsis", () => {
    const lbl = formatLabel("LongLabel", 5, 0);
    expect(lbl).toBe("Long…");
  });

  it("renderBar maps booleans to blocks", () => {
    const bar = renderBar([true, false, true]);
    const stripped = stripAnsi(bar);
    expect(stripped).toBe("█░█");
  });

  it("renderDates formats date array correctly", () => {
    const dates = [
      new Date("2021-01-01T00:00:00Z"),
      new Date("2021-01-01T00:00:05Z"),
    ];
    const header = renderDates(dates, "second");
    const stripped = stripAnsi(header);
    expect(stripped).toContain("00:00:00");
    expect(stripped).toContain("00:00:05");
  });
});
