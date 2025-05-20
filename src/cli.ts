import { Command } from "commander";
import chalk from "chalk";
import { parseSchedule, renderSchedule, version } from "./index.js";

const program = new Command();

program
  .name("ganttscape")
  .description(
    "Render project timelines as Gantt-style ASCII charts in Unix terminals",
  )
  .version(version)
  .argument("<file>", "Path to schedule file (YAML or JSON)")
  .option(
    "--scale <scale>",
    "Time scale: ms | second | minute | hour",
    "second",
  )
  .option(
    "-w, --width <number>",
    "Truncate timeline width (number of time slots)",
    (value) => parseInt(value, 10),
    undefined,
  )
  .option("--no-color", "Disable ANSI colors")
  .action((file, options) => {
    const { scale, width, color } = options;
    if (!["ms", "second", "minute", "hour"].includes(scale)) {
      console.error(`Unsupported scale: ${scale}`);
      process.exit(1);
    }
    if (!color) {
      chalk.level = 0;
    }
    // Validate width
    if (
      options.width !== undefined &&
      (Number.isNaN(options.width) || options.width <= 0)
    ) {
      console.error("Invalid width:", options.width);
      process.exit(1);
    }
    let schedule;
    try {
      schedule = parseSchedule(file);
    } catch (err) {
      console.error("Error parsing schedule:", err.message);
      process.exit(1);
    }
    let output;
    try {
      output = renderSchedule(schedule, { width, scale });
    } catch (err) {
      console.error("Error rendering schedule:", err.message);
      process.exit(1);
    }
    process.stdout.write(output + "\n");
  });

program.parse(process.argv);
