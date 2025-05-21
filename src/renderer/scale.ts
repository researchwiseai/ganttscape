import type { Scale } from "./layout.js";

/**
 * Infer a suitable time scale based on the provided duration in milliseconds.
 * Durations up to 1s use the "ms" scale, up to 1 minute use "second",
 * up to 1 hour use "minute", otherwise "hour".
 */
export function inferScale(durationMs: number): Scale {
  if (durationMs <= 1000) return "ms";
  if (durationMs <= 60 * 1000) return "second";
  if (durationMs <= 60 * 60 * 1000) return "minute";
  return "hour";
}
