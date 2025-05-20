import { describe, it, expect } from "vitest";
import { execaSync } from "execa";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import * as os from "os";

describe("CLI integration", () => {
  it("runs and outputs header and chart", () => {
    const tmp = mkdtempSync(join(os.tmpdir(), "ganttscape-"));
    const file = join(tmp, "sched.json");
    const data = [
      {
        label: "A",
        start: "2024-05-01T00:00:00Z",
        end: "2024-05-01T00:00:02Z",
      },
    ];
    writeFileSync(file, JSON.stringify(data), "utf-8");
    const cliPath = join(process.cwd(), "dist", "cli.js");
    const result = execaSync("node", [cliPath, file]);
    const out = result.stdout;
    expect(out).toContain("00:00:00");
    expect(out).toContain("█");
    rmSync(tmp, { recursive: true, force: true });
  });
  it("exits with error when no arguments", () => {
    const cliPath = join(process.cwd(), "dist", "cli.js");
    const result = execaSync("node", [cliPath], { reject: false });
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("error: missing required argument");
  });
  it("exits with error on invalid width option", () => {
    const tmp = mkdtempSync(join(os.tmpdir(), "ganttscape-"));
    const file = join(tmp, "sched.json");
    writeFileSync(
      file,
      JSON.stringify([
        {
          label: "X",
          start: "2024-05-01T00:00:00Z",
          end: "2024-05-01T00:00:01Z",
        },
      ]),
      "utf-8",
    );
    const cliPath = join(process.cwd(), "dist", "cli.js");
    const result = execaSync("node", [cliPath, file, "--width", "abc"], {
      reject: false,
    });
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("Invalid width");
    rmSync(tmp, { recursive: true, force: true });
  });
});
